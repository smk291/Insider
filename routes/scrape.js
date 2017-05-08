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

// Active listings come from search results
// Search results are divided into pages
// Start by getting number of pages
function getNumberOfSearchResultsPages(city, uriFrag) {
  return new Promise((resolve, reject) => {
    request.get(`https://${city}.craigslist.org/search/${uriFrag}`, (err, response, body) => {
      if (err) {
        return reject(err);
      }

      let $ = cheerio.load(body);
      resolve(Math.floor($('.totalcount').first().text() / 100));
    });
  })
}

// Scrape each page of results
function scrapeSearchResultsPages(city, numOfPages, uriFrag){
  let promisePerPageOfResults = [];
  for (var i = 0; i <= numOfPages; i++) {
    let newPromise = new Promise((resolve, reject) => {
      request.get(`https://${city}.craigslist.org/search/${uriFrag}?s=${i * 120}`, (err, response, body) => {
        if (err) {
          reject(err);
        }

        resolve(body);
      });
    });

    promisePerPageOfResults.push(newPromise);
  }

  return promisePerPageOfResults;
}

function scrapeActiveListings(searchResults, subOrApt) {
  return Promise.all(searchResults)
    // values == array of scraped search-results pages
    .then(values => {
      const activeListingsFromSearch = {};
      const urlnumsFromSearch = [];

      // iterate over the pages, 
      values.map(eachPage => {
        let $ = cheerio.load(eachPage)
        // scrape the active listings
        $('.result-row').map((i, el) => {
          // 'urlnum' is craigslist's unique identifier for each listing
          // Sometimes the same urlnum appears
          // in both sublets search and main housing search
          const urlnum = $(el).data('pid');
          let photos = $('a', el).data('ids');

          urlnumsFromSearch.push(urlnum);

          if (!photos || photos.length === 0) {
            photos = null;
          } else {
            photos = photos.split(',');
            photos = photos.map(partialPath => partialPath.slice(2))
          }

          // make partial row
          activeListingsFromSearch[urlnum] = {
            bedrooms: $('.housing', el).text().replace(/(\dbr)|[^]/g, '$1').replace(/br/, ''),
            urlnum,
            url: $('.result-row a', el).attr('href'),
            photos,
            price: $('a span.result-price', el).text().replace(/\$/, ''),
            postDate: $('p time', el).attr('datetime'),
            neighborhood: $('.result-hood', el).text().trim().replace(/^\(|\)$/g, ''),
            subOrApt
          };
        });
      });

      // return have of partial rows for possible insertion 
      // and array of urlnums to simplify duplicate-checking
      return [activeListingsFromSearch, urlnumsFromSearch];
    })
}

function filterDuplicates(next, searchData, subOrApt) {
  const partialListingsToAdd = searchData[0];
  const urlnumsFromSearch = searchData[1];
  let urlnumsToVoidInTable = [];

  let filterSearchResults = new Promise((resolve, reject) => {
    knex(`listings_${subOrApt}`)
      .where('sub_or_apt', subOrApt)
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
      knex(`listings_${subOrApt}`)
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

function scrapeNewListings(results){
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

function buildCompleteListings(scrapedResults, scrapedListings) {
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
      descr: $('#postingbody').text().trim().replace('QR Code Link to This Post\n            \n        \n', ''),
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

function insertNewListings(req, res, next, newListings, subOrApt) {
  const listingsForInsertion = Object.keys(newListings).map(listing => {
      return newListings[listing];
  });

  return new Promise((resolve, reject) => {
    knex(`listings_${subOrApt}`)
      .insert(decamelizeKeys(listingsForInsertion), '*')
      .then(newRows => {
        resolve(camelizeKeys(newRows));
      })
      .catch(err => next(err));
  });
}

router.get('/scrape/:city/:subOrApt', authorize, (req, res, next) => {
  let { city, subOrApt } = req.params;
  let uriFrag = subOrApt === 'apt'? 'apa': 'sub';

  const getNumOfResultsPages = getNumberOfSearchResultsPages(city, uriFrag);

  getNumOfResultsPages.then((pagesOfResults) => {
    const searchResultsPromises = scrapeSearchResultsPages(city, pagesOfResults, uriFrag);

    return scrapeActiveListings(searchResultsPromises, subOrApt);
  })
  .then(partialListingsAndUrlnums => {
    return filterDuplicates(next, partialListingsAndUrlnums, subOrApt);
  })
  .then(filteredResults => {
    if (Object.keys(filteredResults).length === 0) {
      return 0
    } else {
      return scrapeNewListings(filteredResults);
    }
  }).then(allData => {
    if (allData === 0) {
      res.send('No new listings');
    } else {
      const toInsert = buildCompleteListings(allData[0], allData[1]);
      const inserted = insertNewListings(req, res, next, toInsert, subOrApt);

      inserted.then(insertedListings => {
        res.send([insertedListings, insertedListings.length])
      })
    }
  })
  .catch(err => next(err));
});

router.get('/scrape_rescrape/:city/:subOrApt', authorize, (req, res, next) => {
  const {city, subOrApt } = req.params;
  const rescrapedListing = req.body;

  console.log(rescrapedListing);


  const rescrapePage = scrapeListings({padding: rescrapedListing});

  rescrapePage.then(([rescrapedListing, newScrape]) => {
    console.log(newScrape);
  }) 

  // craigslist | post not found
})

module.exports = router;
