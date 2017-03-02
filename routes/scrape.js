const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const fetchUrl = require('fetch').fetchUrl;
const CerealScraper = require('cerealscraper');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const https = require('https');
const cheerio = require('cheerio');
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


router.get('new_scrape', authorize, (req, res, next) => {
  // Read about promisify in bluebird
  // Read about limiter package and RateLimiter
  // read about request.spread/catch
  // Outline:
  // Get list of urls from psql
  // Create hash of URLs ({[url]: true}) to provide quick lookup for listings already exist in database
    // Alternatively: store this object statically instead of generating it each time the program runs. This should be better, faster and simpler somewhat, though it'll mean creating the initial object and updating it
  // ASYNC -- Make call to main search page
    // Find number of results, divide by 100, round up for number of pages
    // Pull information from each page
  // ASYNC -- Make https requests to each url
    // If url exists in database
      // Delete that from the lookup hash
    // If url doesn't exist
      // Find all relevant information in the html
      // Put it in the database
        // Alternatively, push the new listings to an array and insert all at once. If this is a possibility, it would obviously be preferable
  // EITHER
    // Insert listings into database one by one
    // or
    // Insert all
  // Send user response containing list of number of new entries + the new entries
    // Add these to the table without making call to API?
    // No, if I did that I'd need to process those listings.
      // Sounds like a pain
      // But it would probably be faster actually than calling API
});

router.get('/scrape_total/:city', authorize, (req, res, next) => {
  let { city } = req.params;
  let response = '';

  let cg = https.get(`https://${city}.craigslist.org/search/sub`, (searchRes) => {
    searchRes.on('data', (chunk) => response += chunk);

    searchRes.on('error', (e) => {
      next(e);
    });

    searchRes.on('end', () => {
      try {
        let $ = cheerio.load(response);
        let pages = Math.ceil(Number($('.totalcount:first-of-type').text()) / 100);
        let response = https.get(`/scrape/${city}/${pages}`);
      } catch (err) {
        next(err)
      }
    });

    cg.end();
  })
})

router.get('/scrape/:city/:pages', authorize, (req, res, next) => {
  const newListings = [];
  const voidedListings = [];

  knex('listings')
    .whereNot('void', true)
    .then(listings => {
      const listingsHash = {};

      listings.reduce((acc, listing) => {
        // eslint-disable-next-line no-param-reassign
        acc[listing.urlnum] = true;
        return acc;
      }, listingsHash);

      const { city, pages } = req.params;
      const scrapedRowsFromSearchPage = [];
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
            if (!listingsHash[item.urlnum]) {
              scrapedRowsFromSearchPage.push(item);
            } else {
              delete listingsHash[item.urlnum];
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
          requests: 3,
          perUnit: 'second',
        },
        processLimiterOptions: {
          requests: 10,
          perUnit: 'second',
        },
      });

      // eslint-disable-next-line no-unused-vars
      const dispatcher = new CerealScraper.Dispatcher(cereallist).start().then(() => {
        for (let i = 0; i < scrapedRowsFromSearchPage.length; i += 1) {
          const listingEnums = {
            housing: [
              'apartment',
              'condo',
              'house',
              'townhouse',
              'duplex',
              'land',
              'in-law',
              'cottage/cabin',
            ],
            laundry: [
              'laundry on site',
              'w/d in unit',
              'laundry in bldg',
            ],
            parking: [
              'off-street parking',
              'detached garage',
              'attached garage',
              'valet parking',
              'street parking',
              'carport',
              'no parking',
            ],
            bath: [
              'private bath',
              'no private bath',
            ],
            private_room: [
              'private room',
              'room not private',
            ],
            cat: [
              'cats are OK - purrr',
            ],
            dog: [
              'dogs are OK - wooof',
            ],
            furnished: [
              'furnished',
            ],
            smoking: [
              'no smoking',
            ],
            wheelchair: [
              'wheelchair accessible',
            ],
          };

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
                resolve();

                if (listingsToFormat.length === 0) {
                  res.status(200).send('No new listings to add');
                }

                const { details, coords } = listingToFormat;

                delete listingToFormat.details;
                delete listingToFormat.coords;

                // eslint-disable-next-line max-len
                const completeListing = Object.assign({}, scrapedRowsFromSearchPage[i], listingToFormat, details, coords);

                newListings.push(completeListing);

                if (newListings.length === scrapedRowsFromSearchPage.length) {
                  knex('listings')
                    .insert(decamelizeKeys(newListings))
                    .returning('*')
                    .then(insertedRows => {
                      Object.keys(listingsHash).map(key => {
                        knex('listings')
                          .where('urlnum', key)
                          .update({ 'void': true }, '*')
                          .then(voidedListing => {
                            voidedListings.push(voidedListing);
                          })
                          .catch(err => next(err));
                      });

                      res.status(200).send({
                        insertedRows: insertedRows.length,
                        inserted: camelizeKeys(insertedRows),
                        voidedRows: voidedRows.length,
                        voided: camelieKeys(voidedRows)
                      })
                    })
                    .catch(err => next(err));
                }
              });
            },
          });

          // eslint-disable-next-line no-unused-vars
          new CerealScraper.Dispatcher(cerealIndiv).start();
        }
      });
    }).catch(err => next(err));
});

router.get('/scrape_check_for_404', authorize, (req, res, next) => {
  let countNew404 = 0;
  let voidedRows = [];
  let i = 0;

  knex('listings')
    .where('void', null)
    .returning('*')
    .then(listings => {
      if (listings.length === 0) {
        res.status(200).send('No listings or all listings are expired.')
      }

      function checkFor404() {
        i++
        console.log(i);
        let listing = listings.shift();
        console.log(listing);

        fetchUrl(`http://seattle.craigslist.org${listing.url}`, (error, meta, body) => {
          if (error) {
            next(err)
          }

          if (body && (body.indexOf('This posting has expired.') !== -1
          || body.indexOf('There is nothing here') !== -1
          || body.indexOf('This posting has been deleted by its author') !== -1
          || body.indexOf('This posting has been flagged for removal') !== -1)) {
            knex('listings')
              .where('urlnum', listing.urlnum)
              .first()
              .update({ void: true }, '*')
              .then((voidedRow) => {
                countNew404 += 1;

                voidedRows.push([i, decamelizeKeys(voidedRow)]);

                if (listings.length !== 0) {
                  checkFor404();
                } else {
                  res.status(200).send([countNew404, voidedRows]);
                }
              })
              .catch(err => next(err));
          } else {
            if (listings.length !== 0) {
              checkFor404();
            } else {
              res.status(200).send([countNew404, voidedRows]);
            }
          }
        });
      }

      checkFor404();

    })
    .catch(err => next(err));
});

module.exports = router;
