const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const fetchUrl = require('fetch').fetchUrl;
const Promise = require('bluebird');
const https = require('https');
const cheerio = require('cheerio');
const request = require('request');
// const request = Promise.promisify(require('request'))
// const ev = require('express-validation');
// const validations = require('../validations/token');

// eslint-disable-next-line babel/new-cap
const router = express.Router();

function authorize(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, err => {
    if (err) {
      // eslint-disable-next-line no-param-reassign
      req.verify = false;
    } else {
      // eslint-disable-next-line no-param-reassign
      req.verify = true;
    }

    next();
  });
}

function getNumberOfPages(city) {
  return new Promise((resolve, reject) => {
    request.get(`https://${city}.craigslist.org/search/sub`, (err, response, body) => {
      if (err) {
        return reject(err);
      }

      let $ = cheerio.load(body);
      resolve(Math.floor($('.totalcount').first().text() / 100));
    });
  })
}

function getPromisesForResultsPages(city, numOfPages){
  let searchResultsPromises = [];

  for (var i = 0; i <= numOfPages; i++) {
    let newPromise = new Promise((resolve, reject) => {
      request.get(`https://${city}.craigslist.org/search/sub?s=${i * 120}`, (err, response, body) => {
        if (err) {
          reject(err);
        }

        resolve(body);
      });
    });

    searchResultsPromises.push(newPromise);
  }

  return searchResultsPromises;
}

function scrapeResults(searchResults) {
  return Promise.all(searchResults)
    .then(values => {
      const listings = {};

      values.map(eachPage => {
        let $ = cheerio.load(eachPage)
        $('.result-row').map((i, el) => {
          let bedrooms = null
          const bedroomNum = $('.housing', el).text().replace(/(\dbr)|[^]/g, '$1').replace(/br/, '');

          if (bedroomNum !== '') {
            bedrooms = Number(bedroomNum)
          }

          const urlnum = $(el).data('pid');
          // If the urlnum isn't already present in the database...

          let price = $('a span.result-price', el).text().replace(/\$/, '');

          if (price === '') {
            price = null;
          }

          let photos = $('a', el).data('ids');

          if (!photos || photos.length === 0) {
            photos = null;
          } else {
            photos = photos.split(',');
            photos = photos.map(partialPath => partialPath.slice(2))
          }

          let neighborhood = $('.result-hood', el).text().trim().replace(/^\(|\)$/g, '');

          if (neighborhood.length === 0) {
            neighborhood = null;
          }

          const url = $('.result-row a', el).attr('href');

          // console.log(url);

          listings[urlnum] = {
            bedrooms,
            urlnum,
            url,
            photos,
            price,
            postDate: $('p time', el).attr('datetime'),
            neighborhood,
          };
        });
      });

      // let keys = Object.keys(listings)
      // console.log('********scrapeResults********')
      // console.log(listings[keys[0]].urlnum);
      // console.log(listings[keys[1]].urlnum);
      // console.log(listings[keys[2]].urlnum);

      return listings;
    })
}

function checkForDuplicates(next, searchResults) {
  let filterSearchResults = new Promise((resolve, reject) => {
    knex('listings')
      .select('urlnum')
      .then(urlnums => {
        urlnums.map(urlnum => {
          if (searchResults[urlnum.urlnum] !== undefined) {
            delete searchResults[urlnum.urlnum];
          }
        });

        resolve(searchResults);
      })
      .catch(err => reject(err));
  });

  return filterSearchResults.then(filteredListings => {
    return filteredListings;
  });
}

function scrapeListings(results){
  const requestListings = Object.keys(results).reduce((acc, listing, i) => {
    const promise = new Promise((resolve, reject) => {
      request.get(`http://seattle.craigslist.org${results[listing].url}`, (err, response, body) => {
        if (err) {
          reject(err);
        }

        resolve(body);
      })
    });

    acc.push(promise);

    return acc;
  }, []);

  return Promise.all(requestListings).then(completedRequests => {
    return [results, completedRequests];
  });
}

function createCompleteListings(scrapedResults, scrapedListings) {
  let keys = Object.keys(scrapedResults);
  let listingskeys = Object.keys(scrapedListings);

  return scrapedListings.reduce((acc, el, i) => {
    const $ = cheerio.load(el);
    const currentUrlnum = $('.postinginfos p:nth-child(1)').text().replace(/\D+/g, '');
    const dataCategories = {
      housing: [
        'apartment',
        'condo',
        'house',
        'townhouse',
        'duplex',
        'land',
        'in-law',
        'cottage/cabin'
      ],
      laundry: [
        'laundry on site',
        'w/d in unit',
        'laundry in bldg'
      ],
      parking: [
        'off-street parking',
        'detached garage',
        'attached garage',
        'valet parking',
        'street parking',
        'carport',
        'no parking'
      ],
      bath: [
        'private bath',
        'no private bath'
      ],
      privateRoom: [
        'private room',
        'room not private'
      ],
      cat: [
        'cats are OK - purrr'
      ],
      dog: [
        'dogs are OK - wooof'
      ],
      furnished: [
        'furnished'
      ],
      smoking: [
        'no smoking'
      ],
      wheelchair: [
        'wheelchair accessible'
      ]
    };

    let detailsCheerio = $('.mapAndAttrs .attrgroup:last-of-type span').map((i, el) => {
      return ($(el).text());
    });

    const detailsHash = {}

    for (let i = 0; i < detailsCheerio.length; i++){
      Object.keys(dataCategories).map(category => {
        if (dataCategories[category].indexOf(detailsCheerio[i]) !== -1) {
          detailsHash[category] = detailsCheerio[i];
          delete dataCategories[category];
        }
      });
    }

    let sqft = null;
    const sqftRegex = $('.postingtitletext .housing').text().replace(/[\d]br|\s|\-|\/|ft2/g, "");

    if (sqftRegex !== '') {
      sqft = Number(sqftRegex);
    }

    let streetAddress = $('.mapbox div.mapaddress').first().text();

    if (streetAddress === '') {
      streetAddress = null;
    }

    let lat = $('.mapbox .viewposting').data('latitude');

    if (lat === undefined) {
      lat = null;
    } else {
      lat = Number(lat);
    }

    let lon = $('.mapbox .viewposting').data('longitude');

    if (lon === undefined) {
      lon = null;
    } else {
      long = Number(lon);
    }

    let price = $('.postingtitletext .price').text().replace(/\$/, '');

    if (price === '') {
      price = null;
    } else {
      price = Number(price);
    }

    const newListingData = {
      urlnum: Number(currentUrlnum),
      descr: $('#postingbody').text().trim(),
      title: $('#titletextonly').text(),
      // bedrooms: $('.attrgroup span b').first().text(),
      price,
      sqft,
      lat,
      lon,
      streetAddress
    };

    // console.log(scrapedResults[$('.postinginfos p:nth-child(1)').text().replace(/\D+/g, '')]);

    acc[currentUrlnum] = Object.assign(
      {},
      scrapedResults[$('.postinginfos p:nth-child(1)').text().replace(/\D+/g, '')],
      newListingData,
      detailsHash
    );

    return acc
  }, {})
}

function insertNewListings(req, res, next, newListings) {
  const listingsForInsertion = Object.keys(newListings).map(listing => {
      return newListings[listing];
  });

  Object.keys(newListings).map(urlnum => {
    knex('listings')
      .where('urlnum', urlnum)
      .first()
      .then(listing => {
        console.log(listing === undefined);
      })
  })

  return new Promise((resolve, reject) => {
    knex('listings')
      .insert(decamelizeKeys(listingsForInsertion), '*')
      .then(newListings => {
        resolve(camelizeKeys(newListings));
      })
      .catch(err => next(err));
  });
}

router.get('/results/:city', authorize, (req, res, next) => {
  let { city } = req.params;
  const getNumOfResultsPages = getNumberOfPages(city);

  getNumOfResultsPages.then((pagesOfResults) => {
    const searchResultsPromises = getPromisesForResultsPages(city, pagesOfResults);

    return scrapeResults(searchResultsPromises);
  })
  .then(searchResults => {
    return checkForDuplicates(next, searchResults);
  })
  .then(filteredResults => {
    if (Object.keys(filteredResults).length === 0) {
      return
    } else {
      return scrapeListings(filteredResults);
    }
  }).then(allData => {
    if (allData === undefined) {
      res.send('No new listings');
    } else {
      const toInsert = createCompleteListings(allData[0], allData[1]);
      const inserted = insertNewListings(req, res, next, toInsert)

      inserted.then(insertedListings => {
        res.send(insertedListings)
      })
    }
  })
  .catch(err => next(err));
});

// padmapper
// abodo
// hotpads
// apartments
// zumper
// 206-650-2204, Rob

module.exports = router;
