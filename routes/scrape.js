'use strict';

const boom = require('boom');
const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const ev = require('express-validation');
const bluebird = require('bluebird');
// const validations = require('../validations/token');
const {camelizeKeys, decamelizeKeys} = require('humps');
const request = require('request');
const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');
const timeout = require('connect-timeout');
const fetchUrl = require("fetch").fetchUrl;

var CerealScraper = require('cerealscraper'),
  TextSelector = CerealScraper.Blueprint.TextSelector,
  ConstantSelector = CerealScraper.Blueprint.ConstantSelector,
  TransformSelector = CerealScraper.Blueprint.TransformSelector,
  Promise = require('bluebird');

function authorize(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err) => {
    if (err) {
      req.verify = false;
    } else {
      req.verify = true;
    }

    next();
  });
}

router.get('/scrape/:city', authorize, (req, res) => {
  let newListings = [];

  knex('listings').returning('*').then((listings) => {
    let listingsHash = {};

    listings.reduce((acc, listing) => {
      acc[listing.urlnum] = true;
      return acc;
    }, listingsHash);

    const {city} = req.params,
      scrapedRowsFromSearchPage = [];

    let cereallist = new CerealScraper.Blueprint({
      requestTemplate: {
        method: 'GET',
        uri: `http://${city}.craigslist.org/search/sub`,
        qs: {}
      },
      itemsSelector: '.rows .result-row',
      fieldSelectors: {
        postDate: new TextSelector('.result-date'),
        title: new TextSelector('p a', 0),
        photos: new TransformSelector('a', 0, function(el) {
          if (el[0] && el[0].attribs && el[0].attribs['data-ids']) {
            el = el[0].attribs['data-ids'].split(',');
            el = el.map((str) => {
              return str.substr(2)
            });
            return {photos: el};
          }
        }),
        neighborhood: new TextSelector('.result-hood', 0),
        urlnum: new TransformSelector('', 0, function(el) {
          return el._root[0].attribs['data-pid'];
        }),
        url: new TransformSelector('.result-title', 0, function(el) {
          return el[0].attribs.href;
        }),
        price: new TransformSelector('span .result-price', 0, function(el) {
          let price = el.text().replace('$', '');

          if (price) {
            return price;
          }

          return null;
        }),
        subOrApt: new TransformSelector('.attrgroup span b', 0, (el) => {
          return 'sub'
        })
      },
      itemProcessor: function(item) {
        return new Promise(function(resolve, reject) {
          resolve();
          if (!listingsHash[item.urlnum]) {
            scrapedRowsFromSearchPage.push(item);
          }
        });
      },
      getNextRequestOptions: function() {
        var dispatcher = this,
          pagesToLoad = 3,
          rowsPerPage = 100,
          requestOptions = dispatcher.blueprint.requestTemplate;

        dispatcher.pagesRequested = (dispatcher.pagesRequested === undefined)
          ? 0
          : dispatcher.pagesRequested;
        dispatcher.pagesRequested++;
        if (dispatcher.pagesRequested > pagesToLoad) {
          return null;
        } else {
          requestOptions.qs['s'] = dispatcher.pagesRequested * rowsPerPage - rowsPerPage;
          return requestOptions;
        }
      },
      parallelRequests: true,
      requestLimiterOptions: {
        requests: 1,
        perUnit: 'second'
      },
      processLimiterOptions: {
        requests: 100,
        perUnit: "second"
      }
    });

    var dispatcher = new CerealScraper.Dispatcher(cereallist).start().then(function() {
      for (let i = 0; i < scrapedRowsFromSearchPage.length; i++) {
        let listingEnums = {
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
            'laundry on site', 'w/d in unit', 'laundry in bldg'
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
            'private bath', 'no private bath'
          ],
          private_room: [
            'private room', 'room not private'
          ],
          cat: ['cats are OK - purrr'],
          dog: ['dogs are OK - wooof'],
          furnished: ['furnished'],
          smoking: ['no smoking'],
          wheelchair: ['wheelchair accessible']
        };

        let cerealIndiv = new CerealScraper.Blueprint({
          requestTemplate: {
            method: 'GET',
            uri: `http://seattle.craigslist.org${scrapedRowsFromSearchPage[i].url}`,
            qs: {}
          },
          itemsSelector: '.body',
          fieldSelectors: {
            descr: new TransformSelector('#postingbody', 0, function(el) {
              if (el[0] && el.children && el[0].children[2]) {
                return el[0].children[2].data
              }
            }),
            details: new TransformSelector('.mapAndAttrs .attrgroup:last-of-type', 0, (el) => {
              let detailHash = {};

              if (el[0] && el[0].children) {
                let tempDetailStorage = [];

                el[0].children.map((el) => {
                  if (el.children && el.children.length > 0) {
                    tempDetailStorage.push(el.children[0].data);
                  }
                });

                for (let i = 0; i < tempDetailStorage.length; i++) {
                  for (let field in listingEnums) {
                    if (listingEnums[field].indexOf(tempDetailStorage[i]) !== -1) {
                      detailHash[field] = tempDetailStorage[i];
                      delete listingEnums[field];
                    }
                  }
                }
              }

              return detailHash;
            }),
            sqft: new TransformSelector('.attrgroup sup', 0, (el) => {
              if (el && el[0] && el[0].prev && el[0].prev.prev && el[0].prev.prev.children[0].data) {
                return el[0].prev.prev.children[0].data;
              }
            }),
            coords: new TransformSelector('.mapbox', 0, function(el) {
              if (el[0] && el[0].children[1]) {
                return {lat: el[0].children[1].attribs['data-latitude'], lon: el[0].children[1].attribs['data-longitude']}
                // accuracy: el[0].children[1].attribs['data-accuracy']
              }
            }),
            streetAddress: new TransformSelector('.mapbox', 0, function(el) {
              if (el[0] && el[0].children && el[0].children[3] && el[0].children[3].children) {
                return el[0].children[3].children[0].data;
              }
            }),
            subOrApt: new TransformSelector('.attrgroup span b', 0, (el) => {
              return 'sub'
            })
          },

          itemProcessor: function(detailedItem) {
            return new Promise(function(resolve, reject) {
              resolve();
              const details = Object.assign({}, detailedItem.details);
              delete detailedItem.details;

              const coords = detailedItem.coords;
              delete detailedItem.coords;

              let completeListing = Object.assign({}, scrapedRowsFromSearchPage[i], detailedItem, details, coords);

              newListings.push(completeListing)

              if (newListings.length === scrapedRowsFromSearchPage.length) {
                knex('listings').insert(decamelizeKeys(newListings)).returning('*').then((insertedRows) => {
                  res.send(camelizeKeys(insertedRows));
                })
              }
            });
          }
        });

        let dispatcher2 = new CerealScraper.Dispatcher(cerealIndiv).start();
      }
    });
  }).catch((err) => {
    throw boom.create(400, err)
  })
});

router.get('/scrape_for_404/', authorize, (req, res) => {
  knex('listings').where('void', null).returning('*').then((listings) => {
    let countNew404 = 0;
    let j = 0;
    for (let i = 0; i < listings.length; i++) {
      fetchUrl(`http://seattle.craigslist.org${listings[i].url}`, (error, meta, body) => {
        if (body.indexOf(`This posting has expired.`) !== -1 || body.indexOf(`There is nothing here`) !== -1 || body.indexOf(`This posting has been deleted by its author`) !== -1 || body.indexOf(`This posting has been flagged for removal`) !== -1) {
          knex('listings').where('urlnum', listings[i].urlnum).first().update({
            void: true
          }, '*').then((row) => {
            countNew404++;
          }).catch((err) => {
            throw boom.create(400, err);
          });
        }
      });
    }
    res.send(200, countNew404);
  }).catch((err) => {
    throw boom.create(400, err)
  });
})

module.exports = router;