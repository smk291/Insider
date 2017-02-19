const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const fetchUrl = require('fetch').fetchUrl;
const CerealScraper = require('cerealscraper');
const Promise = require('bluebird');
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

router.get('/scrape/:city', authorize, (req, res, next) => {
  const newListings = [];

  knex('listings')
    .returning('*')
    .then(listings => {
      const listingsHash = {};

      listings.reduce((acc, listing) => {
        // eslint-disable-next-line no-param-reassign
        acc[listing.urlnum] = true;
        return acc;
      }, listingsHash);

      const { city } = req.params;
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
            }
          });
        },
        getNextRequestOptions() {
          const dispatcher = this;
          const pagesToLoad = 3;
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
                const { details } = listingToFormat;
                const { coords } = listingToFormat;

                delete listingToFormat.details;
                delete listingToFormat.coords;

                // eslint-disable-next-line max-len
                const completeListing = Object.assign({}, scrapedRowsFromSearchPage[i], listingToFormat, details, coords);

                newListings.push(completeListing);

                if (newListings.length === scrapedRowsFromSearchPage.length) {
                  knex('listings')
                    .insert(decamelizeKeys(newListings))
                    .returning('*')
                    .then(insertedRows => res.send(camelizeKeys(insertedRows)))
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

module.exports = router;
