const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const fetchUrl = require('fetch').fetchUrl;
const CerealScraper = require('cerealscraper');
const Promise = require('bluebird');
const https = require('https');
const cheerio = require('cheerio');
const request = require('request');
// const request = Promise.promisify(require('request'))
// const ev = require('express-validation');
// const validations = require('../validations/token');

// eslint-disable-next-line babel/new-cap
const router = express.Router();
const TextSelector = CerealScraper.Blueprint.TextSelector;
const TransformSelector = CerealScraper.Blueprint.TransformSelector;

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

          if ($('.housing', el).text().replace(/(\dbr)|[^]/g, '$1').replace(/br/, '') !== '') {
            bedrooms = Number($('.housing', el).text().replace(/(\dbr)|[^]/g, '$1').replace(/br/, ''))
          }

          const urlnum = $(el).data('pid');
          // If the urlnum isn't already present in the database...

          listings[urlnum] = {
            bedrooms,
            urlnum,
            url: $('a', el).attr('href'),
            photos: $('a', el).data('ids'),
            price: Number($('a span.result-price', el).text().replace(/\$/, '')),
            postDate: $('p time', el).attr('datetime'),
            neighborhood: $('.result-hood', el).text().trim().replace(/[^\w|\s]/g, ''),
          };
        });
      });

      return listings;
    })
}

function scrapeListings(results){
  const requestListings = Object.keys(results).reduce((acc, listing, i) => {
    if (i < 3) { //--------------------->
      const promise = new Promise((resolve, reject) => {
        request.get(`http://seattle.craigslist.org${results[listing].url}`, (err, response, body) => {
          if (err) {
            reject(err);
          }

          resolve(body);
        })
      });

      acc.push(promise);
    } // -------------------------->

    return acc;
  }, []);

  return Promise.all(requestListings).then(completedRequests => {
    return [results, completedRequests];
  });
}

function createCompleteListing(scrapedResults, scrapedListings) {
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

    console.log(detailsHash);

    let sqft = null;
    const sqftRegex = $('.postingtitletext .housing').text().replace(/[\d]br|\s|\-|\/|ft2/g, "");

    if ($('.postingtitletext .housing').text().replace(/[\d]br|\s|\-|\/|ft2/g, "") !== '') {
      sqft = Number($('.postingtitletext .housing').text().replace(/[\d]br|\s|\-|\/|ft2/g, ""));
    }

    const newListingData = {
      urlnum: Number(currentUrlnum),
      descr: $('#postingbody').text().trim(),
      title: $('#titletextonly').text(),
      // bedrooms: $('.attrgroup span b').first().text(),
      price: Number($('.postingtitletext .price').text().replace(/\$/, '')),
      sqft,
      lat: $('.mapbox .viewposting').data('latitude'),
      lon: $('.mapbox .viewposting').data('longitude'),
      streetAddress: $('.mapbox div.mapaddress').first().text(),
    };

    acc[currentUrlnum] = Object.assign(
      {},
      scrapedResults[$('.postinginfos p:nth-child(1)').text().replace(/\D+/g, '')],
      newListingData,
      detailsHash
    );

    return acc
  }, {})
}

router.get('/results/:city', authorize, (req, res, next) => {
  let { city } = req.params;
  const getNumOfResultsPages = getNumberOfPages(city);

  getNumOfResultsPages.then((pagesOfResults) => {
    const searchResultsPromises = getPromisesForResultsPages(city, pagesOfResults);

    return scrapeResults(searchResultsPromises)
  })
  .then(searchResults => {
    return scrapeListings(searchResults);
  }).then(allData => {
    res.send(createCompleteListing(allData[0], allData[1]));
  })
  .catch(err => next(err));
});

// padmapper
// abodo
// hotpads
// apartments
// zumper
// 206-650-2204, Rob

router.get('/scrape/:city', authorize, (req, res, next) => {
  let { city } = req.params;
  const newListings = [];
  let urlnums = {};

  const getPages = new Promise((resolve, reject) => {
    request.get(`https://${city}.craigslist.org/search/sub`, (err, response, body) => {
      if (err) {
        return reject(err);
      }

      let $ = cheerio.load(body);
      resolve($('.totalcount').first().text());
    });
  });

  getPages.then((activeListings) => {
    let pages = Math.ceil(activeListings / 100);

    knex('listings')
      .where('void', null)
      .then(storedlistings => {
        const listingsHash = {};
        const scrapedRowsFromSearchPage = [];

        storedlistings.reduce((acc, listing) => {
          // eslint-disable-next-line no-param-reassign
          acc[listing.urlnum] = true;
          return acc;
        }, listingsHash);

        const cereallist = new CerealScraper.Blueprint({
          requestTemplate: {
            method: 'GET',
            uri: `http://${city}.craigslist.org/search/sub`,
            qs: {},
          },
          itemsSelector: '.rows .result-row',
          fieldSelectors: {
            postDate: new TextSelector('.result-date'),
            title: new TextSelector('p a', 0),
            // eslint-disable-next-line consistent-return
            photos: new TransformSelector('a', 0, el => {
              if (el[0] && el[0].attribs && el[0].attribs['data-ids']) {
                let photoUrls = el;

                photoUrls = photoUrls[0].attribs['data-ids'].split(',');
                photoUrls = photoUrls.map(str => {
                  return str.substr(2);
                });
                return { photos: photoUrls };
              }
            }),
            neighborhood: new TextSelector('.result-hood', 0),
            urlnum: new TransformSelector('', 0, el => {
              // eslint-disable-next-line no-underscore-dangle
              return el._root[0].attribs['data-pid'];
            }),
            url: new TransformSelector('.result-title', 0, el => {
              return el[0].attribs.href;
            }),
            price: new TransformSelector('span .result-price', 0, el => {
              const price = el.text().replace('$', '');

              if (price) {
                return price;
              }

              return null;
            }),
          },
          itemProcessor(item) {
            // eslint-disable-next-line no-unused-vars
            return new Promise((resolve, reject) => {
              resolve();
              urlnums[item.urlnum] = true;

              if (!listingsHash[item.urlnum]) {
                scrapedRowsFromSearchPage.push(item);
              }
            });
          },
          getNextRequestOptions() {
            const dispatcher = this;
            const pagesToLoad = pages;
            const rowsPerPage = 100;
            const requestOptions = dispatcher.blueprint.requestTemplate;

            dispatcher.pagesRequested = (dispatcher.pagesRequested === undefined)
              ? 0
              : dispatcher.pagesRequested;
            dispatcher.pagesRequested += 1;
            if (dispatcher.pagesRequested > pagesToLoad) {
              return null;
            }

            requestOptions.qs.s = (dispatcher.pagesRequested * rowsPerPage) - rowsPerPage;
            return requestOptions;
          },
          parallelRequests: true,
          requestLimiterOptions: {
            requests: 1,
            perUnit: 'second',
          },
          processLimiterOptions: {
            requests: 100,
            perUnit: 'second',
          },
        });

        // eslint-disable-next-line no-unused-vars
        const dispatcher = new CerealScraper.Dispatcher(cereallist).start().then(() => {

          if (scrapedRowsFromSearchPage.length === 0) {
            res.send([0,0])
          } else {
          for (let i = 0; i < scrapedRowsFromSearchPage.length; i += 1) {
            const cerealIndiv = new CerealScraper.Blueprint({
              requestTemplate: {
                method: 'GET',
                uri: `http://seattle.craigslist.org${scrapedRowsFromSearchPage[i].url}`,
                qs: {},
              },
              itemsSelector: '.body',
              fieldSelectors: {
                // eslint-disable-next-line consistent-return
                descr: new TransformSelector('#postingbody', 0, el => {
                  if (el[0] && el.children && el[0].children[2]) {
                    return el[0].children[2].data;
                  }
                }),
                details: new TransformSelector('.mapAndAttrs .attrgroup:last-of-type', 0, el => {
                  const detailHash = {};

                  if (el[0] && el[0].children) {
                    const tempDetailStorage = [];

                    // eslint-disable-next-line array-callback-return
                    el[0].children.map(detail => {
                      if (detail.children && detail.children.length > 0) {
                        tempDetailStorage.push(detail.children[0].data);
                      }
                    });

                    for (let j = 0; j < tempDetailStorage.length; j += 1) {
                      // eslint-disable-next-line array-callback-return
                      Object.keys(listingEnums).map(field => {
                        if (listingEnums[field].indexOf(tempDetailStorage[j]) !== -1) {
                          detailHash[field] = tempDetailStorage[j];
                          delete listingEnums[field];
                        }
                      });
                    }
                  }

                  return detailHash;
                }),
                // eslint-disable-next-line array-callback-return, consistent-return
                bedrooms: new TransformSelector('.attrgroup span b', 0, el => {
                  if (el[0] && el[0].children){
                    return el[0].children[0].data;
                  }
                }),
                sqft: new TransformSelector('.attrgroup sup', 0, el => {
                  // eslint-disable-next-line max-len
                  if (el && el[0] && el[0].prev && el[0].prev.prev && el[0].prev.prev.children[0].data) {
                    return el[0].prev.prev.children[0].data;
                  }
                }),
                // eslint-disable-next-line consistent-return
                coords: new TransformSelector('.mapbox', 0, el => {
                  if (el[0] && el[0].children[1]) {
                    return {
                      lat: el[0].children[1].attribs['data-latitude'],
                      lon: el[0].children[1].attribs['data-longitude'],
                    };
                    // accuracy: el[0].children[1].attribs['data-accuracy']
                  }
                }),
                // eslint-disable-next-line consistent-return
                streetAddress: new TransformSelector('.mapbox', 0, el => {
                  if (el[0] && el[0].children && el[0].children[3] && el[0].children[3].children) {
                    return el[0].children[3].children[0].data;
                  }
                }),
              },
              itemProcessor(detailedItem) {
                const listingToFormat = detailedItem;
                // eslint-disable-next-line no-unused-vars
                return new Promise((resolve, _reject) => {
                  const { details } = listingToFormat;
                  const { coords } = listingToFormat;

                  delete listingToFormat.details;
                  delete listingToFormat.coords;

                  // eslint-disable-next-line max-len
                  const completeListing = Object.assign({}, scrapedRowsFromSearchPage[i], listingToFormat, details, coords);

                  newListings.push(completeListing);

                  if (newListings.length === scrapedRowsFromSearchPage.length) {
                    let voidTheseListings = Object.assign({}, listingsHash);

                    Object.keys(listingsHash).map((urlnum) => {
                      if (listingsHash[urlnum] === urlnums[urlnum]) {
                        delete voidTheseListings[urlnum];
                      }
                    });

                    let inserted = [];

                    console.log(newListings);

                    return new Promise((resolve, reject) => {
                      newListings.map((listing) => {
                        knex('listings')
                          .where('urlnum', listing.urlnum)
                          .first()
                          .then(storedListing => {
                            console.log(listing.urlnum);
                            console.log(listingsHash[listing.urlnum]);

                            if (listingsHash[listing.urlnum]) {
                              knex('listings')
                                .insert(decamelizeKeys(listing))
                                .returning('*')
                                .then(newListing => {
                                  inserted.push(newListing);
                                })
                                .catch(err => next(err));
                            }
                          })
                          .catch(err => next(err));
                      });

                      resolve();
                    });

                    // let voidThese = function () {
                    //   new Promise((resolve, reject) => {
                    //     Object.keys(voidTheseListings).map((urlnum) => {
                    //       knex('listings')
                    //         .where('urlnum', urlnum)
                    //         .update({void: true})
                    //         .then(() => {
                    //           console.log(`voided: ${Object.keys(voidTheseListings).length}`);
                    //         })
                    //         .catch(err => next(err));
                    //     });
                    //     resolve();
                    //   });
                    // }



                    insert.then(() => {
                      voidThese();
                    })
                    .then(() => {
                      res.send([newListings.length, newListings, voidTheseListings.length, voidTheseListings]);
                    });

                    // knex('listings')
                    //   .insert(decamelizeKeys(newListings))
                    //   .returning('*')
                    //   .then(insertedRows => {
                    //     let inserted = insertedRows;
                    //   })
                    //   // .then(() => {
                    //   //   res.send([insertedRows.length, Object.keys(voidTheseListings).length])
                    //   // })
                    //   .catch(err => next(err));



                  }

                  resolve();
                });
              },
            });

            // eslint-disable-next-line no-unused-vars
            new CerealScraper.Dispatcher(cerealIndiv).start();
          }}
        });
      }).catch(err => next(err));
  });
});

router.get('/scrape_for_404/', authorize, (req, res, next) => {
  knex('listings')
    .where('void', null)
    .returning('*')
    .then(listings => {
      let countNew404 = 0;

      function checkFor404(listing) {
        fetchUrl(`http://seattle.craigslist.org${listing.url}`, (error, meta, body) => {
          if (body.indexOf('This posting has expired.') !== -1
          || body.indexOf('There is nothing here') !== -1
          || body.indexOf('This posting has been deleted by its author') !== -1
          || body.indexOf('This posting has been flagged for removal') !== -1) {
            knex('listings')
              .where('urlnum', listing.urlnum)
              .first()
              .update({ void: true })
              .then(() => {
                countNew404 += 1;
              })
              .catch(err => next(err));
          }
        });
      }

      for (let i = 0; i < listings.length; i += 1) {
        checkFor404(listings[i]);
      }

      res.send(200, countNew404);
    })
    .catch(err => next(err));
});

router.get('/scrape_for_404_2/:city', authorize, (req, res, next) => {
  const newListings = [];

  knex('listings')
    .where('void', null)
    .then(listings => {
      const listingsHash = {};

      listings.reduce((acc, listing) => {
        // eslint-disable-next-line no-param-reassign
        acc[listing.urlnum] = true;
        return acc;
      }, listingsHash);

      const { city } = req.params;
      const activeListingNumbers = {};
      const cereallist = new CerealScraper.Blueprint({
        requestTemplate: {
          method: 'GET',
          uri: `http://${city}.craigslist.org/search/sub`,
          qs: {},
        },
        itemsSelector: '.rows .result-row',
        fieldSelectors: {
          urlnum: new TransformSelector('', 0, el => {
            // eslint-disable-next-line no-underscore-dangle
            return el._root[0].attribs['data-pid'];
          }),
        },
        itemProcessor(item) {
          // eslint-disable-next-line no-unused-vars
          return new Promise((resolve, reject) => {
            resolve();
            activeListingNumbers[item.urlnum] = true;
          });
        },
        getNextRequestOptions() {
          const dispatcher = this;
          const pagesToLoad = 6;
          const rowsPerPage = 100;
          const requestOptions = dispatcher.blueprint.requestTemplate;

          dispatcher.pagesRequested = (dispatcher.pagesRequested === undefined)
            ? 0
            : dispatcher.pagesRequested;
          dispatcher.pagesRequested += 1;
          if (dispatcher.pagesRequested > pagesToLoad) {
            return null;
          }

          requestOptions.qs.s = (dispatcher.pagesRequested * rowsPerPage) - rowsPerPage;
          return requestOptions;
        },
        parallelRequests: true,
        requestLimiterOptions: {
          requests: 1,
          perUnit: 'second',
        },
        processLimiterOptions: {
          requests: 100,
          perUnit: 'second',
        },
      });

      // eslint-disable-next-line no-unused-vars
      const dispatcher = new CerealScraper.Dispatcher(cereallist).start().then(() => {
        console.log(Object.keys(activeListingNumbers).length);
        console.log(Object.keys(listingsHash).length);

        let filteredHash = Object.assign({}, listingsHash);
        let i = 0;
        let j = 0;
        Object.keys(listingsHash).map((urlnum) => {
          i++;

          if (listingsHash[urlnum] === activeListingNumbers[urlnum]) {
            j++;
            console.log(urlnum);
            console.log(`j: ${j}`);
            delete filteredHash[urlnum];
            console.log(`filteredHash: ${Object.keys(filteredHash).length}`);
          }
          console.log(`i: ${i}`);
        });

        console.log(Object.keys(activeListingNumbers).length);
        console.log(Object.keys(listingsHash).length);
        console.log(Object.keys(filteredHash).length);
      });


    }).catch(err => next(err));
});

module.exports = router;
