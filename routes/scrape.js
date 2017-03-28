const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps'); 
const cheerio = require('cheerio');
const request = require('request');

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
      const partialListings = {};
      const urlnumsFromSearch = [];

      values.map(eachPage => {
        let $ = cheerio.load(eachPage)
        $('.result-row').map((i, el) => {
          const urlnum = $(el).data('pid');
          let photos = $('a', el).data('ids');

          urlnumsFromSearch.push(urlnum);

          if (!photos || photos.length === 0) {
            photos = null;
          } else {
            photos = photos.split(',');
            photos = photos.map(partialPath => partialPath.slice(2))
          }

          partialListings[urlnum] = {
            bedrooms: $('.housing', el).text().replace(/(\dbr)|[^]/g, '$1').replace(/br/, ''),
            urlnum,
            url: $('.result-row a', el).attr('href'),
            photos,
            price: $('a span.result-price', el).text().replace(/\$/, ''),
            postDate: $('p time', el).attr('datetime'),
            neighborhood: $('.result-hood', el).text().trim().replace(/^\(|\)$/g, ''),
          };
        });
      });

      return [partialListings, urlnumsFromSearch];
    })
}

function checkForDuplicates(next, searchData) {
  const partialListingsToAdd = searchData[0];
  const urlnumsFromSearch = searchData[1];
  let urlnumsToVoidInTable = [];

  let filterSearchResults = new Promise((resolve, reject) => {
    knex('listings')
      .select('urlnum')
      .orderBy('urlnum', 'desc')
      .then(output => {
        let urlnumsFromTable = output.map(el => el.urlnum);

        urlnumsFromTable.map(numFromTable => {
          if (partialListingsToAdd[numFromTable] !== undefined) {
            delete partialListingsToAdd[numFromTable];
          } else {
            urlnumsToVoidInTable.push(numFromTable);
          }
        });

        resolve([partialListingsToAdd, urlnumsToVoidInTable]);
      })
      .catch(err => reject(err));
  });

  return filterSearchResults.then(dataToAddOrVoid => {
    const partialListingsToAdd = dataToAddOrVoid[0];
    const urlnumsToVoidInTable = dataToAddOrVoid[1];

    let voidingListings = new Promise((resolve, reject) => {
      knex('listings')
        .whereIn('urlnum', urlnumsToVoidInTable)
        .update('void', true)
        .returning('*')
        .then(voided => {
          resolve(voided);
        });
    });

    return voidingListings.then(voided => {
      return partialListingsToAdd;
    });
  });
}

function scrapeListings(results){
  if (!Object.keys(results)) {
    return 0
  }

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
  return scrapedListings.reduce((acc, el, i) => {
    const $ = cheerio.load(el);
    const currentUrlnum = $('.postinginfos p:nth-child(1)').text().replace(/\D+/g, '');
    const dataCategories = {
      housing: ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage/cabin'],
      laundry: ['laundry on site', 'w/d in unit', 'laundry in bldg'],
      parking: ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking'],
      bath: ['private bath', 'no private bath'],
      privateRoom: ['private room', 'room not private'],
      cat: ['cats are OK - purrr'],
      dog: ['dogs are OK - wooof'],
      furnished: ['furnished'],
      smoking: ['no smoking'],
      wheelchair: ['wheelchair accessible']
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

    const newListingData = {
      urlnum: Number(currentUrlnum),
      descr: $('#postingbody').text().trim(),
      title: $('#titletextonly').text(),
      price: $('.postingtitletext .price').text().replace(/\$/, ''),
      sqft: $('.postingtitletext .housing').text().replace(/[\d]br|\s|\-|\/|ft2/g, ""),
      lat: $('.mapbox .viewposting').data('latitude'),
      lon: $('.mapbox .viewposting').data('longitude'),
      streetAddress: $('.mapbox div.mapaddress').first().text()
    };

    const newListing = Object.assign({}, scrapedResults[currentUrlnum], newListingData, detailsHash);

    newListingFormatted = Object.keys(newListing).reduce((nL, el, i) => {
      nL[el] = newListing[el];

      if (nL[el] === null || nL[el] === undefined || nL[el] === '' || nL[el].length === 0) {
        nL[el] = null;
      } else if (Number(nL[el])) {
        nL[el] = Number(nL[el]);
      }

      return nL;
    }, {})

    acc[currentUrlnum] = newListingFormatted;
    return acc
  }, {})
}

function insertNewListings(req, res, next, newListings) {
  const listingsForInsertion = Object.keys(newListings).map(listing => {
      return newListings[listing];
  });

  return new Promise((resolve, reject) => {
    knex('listings')
      .insert(decamelizeKeys(listingsForInsertion), '*')
      .then(newRows => {
        resolve(camelizeKeys(newRows));
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
  .then(partialListingsAndUrlnums => {
    return checkForDuplicates(next, partialListingsAndUrlnums);
  })
  .then(filteredResults => {
    if (Object.keys(filteredResults).length === 0) {
      return 0
    } else {
      return scrapeListings(filteredResults);
    }
  }).then(allData => {
    if (allData === 0) {
      res.send('No new listings');
    } else {
      const toInsert = createCompleteListings(allData[0], allData[1]);
      const inserted = insertNewListings(req, res, next, toInsert)

      inserted.then(insertedListings => {
        res.send([insertedListings, insertedListings.length])
      })
    }
  })
  .catch(err => next(err));
});

module.exports = router;
