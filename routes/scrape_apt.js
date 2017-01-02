// eslint-disable-next-line new-cap
'use strict';

const boom                           = require('boom');
const bcrypt                         = require('bcrypt-as-promised');
const express                        = require('express');
const router                         = express.Router();
const jwt                            = require('jsonwebtoken');
const knex                           = require('../knex');
const ev                             = require('express-validation');
const bluebird                       = require('bluebird');
// const validations = require('../validations/token');
const {camelizeKeys, decamelizeKeys} = require('humps');
const request                        = require('request');
const cheerio                        = require('cheerio');
const fs                             = require('fs');
const decycle                        = require('json-decycle').decycle;
const retrocycle                     = require('json-decycle').retrocycle;
const timeout                        = require('connect-timeout');

var CerealScraper   = require('cerealscraper'),
  TextSelector      = CerealScraper.Blueprint.TextSelector,
  ConstantSelector  = CerealScraper.Blueprint.ConstantSelector,
  TransformSelector = CerealScraper.Blueprint.TransformSelector,
  Promise           = require('bluebird');

// function authorize(req, res, next) {
//   jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err) => {
//     if (err) {
//       req.verify = false;
//     } else {
//       req.verify = true;
//     }
//
//     next();
//   });
// }

router.get('/scrape_details_apt/:urlnum', (req, res) => {
  let storage     = [],
      url         = '',
      details     = [],
      br          = 0,
      area        = 0,
      housingtype = '',
      laundry     = '',
      parking     = '',
      privatebath = null,
      privatebr   = null,
      cats        = null,
      dogs        = null,
      furnished   = null,
      nosmoking   = null,
      wheelchair  = null;

  const {urlnum}         = req.params,
        housingTypes     = ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage/cabin'],
        laundryTypes     = ['laundry on site', 'w/d in unit', 'laundry in bldg'],
        parkingTypes     = ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking'],
        bathTypes        = ['private bath', 'no private bath'],
        privateRoomTypes = ['private room', 'room not private'],
        catTypes         = ['cats are OK - purrr'],
        dogTypes         = ['dogs are OK - wooof'],
        furnishedTypes   = ['furnished'],
        smokingTypes     = ['no smoking'],
        wheelchairTypes  = ['wheelchair accessible'];

  let typeList = {
    housingTypes,
    laundryTypes,
    parkingTypes,
    bathTypes,
    privateRoomTypes,
    catTypes,
    dogTypes,
    furnishedTypes,
    smokingTypes,
    wheelchairTypes
  };
  // // .property_date (available...)
  let detailsObject = {};

  knex('listings')
    .where('urlnum', urlnum)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, `Entry for url ${urlnum} does not exist`)
      }

      url = row.url;

      let cerealIndiv = new CerealScraper.Blueprint({
        requestTemplate: {
          method: 'GET',
          uri:    `http://seattle.craigslist.org${url}`,
          qs:     {}
        },
        itemsSelector: '.body',
        fieldSelectors: {
          urlnum: new TransformSelector('span .result-price', 0, function(el) {
            return urlnum;
          }),
          desc: new TransformSelector('#postingbody', 0, function(el) {
            if (el[0] && el.children && el[0].children[2]){
              return el[0].children[2].data
            }
          }),
          detailsmapped: new TransformSelector('.mapAndAttrs .attrgroup:last-of-type', 0, (el) => {
            if (el[0] && el[0].children){
              let arr = [];

              el[0].children.map((el) => {
                if (el.children && el.children.length > 0) {
                  arr.push(el.children[0].data);
                }
              });

              for (let i = 0; i < arr.length; i++){
                for (let key in typeList){
                  if (typeList[key].indexOf(arr[i]) !== -1){
                    detailsObject[key] = arr[i];
                    delete typeList[key];
                  }
                }
              }
            }

            return detailsObject;
          }),
          housingtype: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.housingTypes){
              return detailsObject.housingTypes
            }
            return  null
          }),
          laundry: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.laundryTypes){
              return detailsObject.laundryTypes
            }
            return  null
          }),
          parking: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.parkingTypes){
              return detailsObject.parkingTypes
            }
            return  null
          }),
          privatebath: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.bathTypes){
              return detailsObject.bathTypes
            }
            return  null
          }),
          privatebr: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.privateRoomTypes){
              return detailsObject.privateRoomTypes
            }
            return  null
          }),
          cats: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.catTypes){
              return detailsObject.catTypes
            }
            return  null
          }),
          dogs: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.dogTypes){
              return detailsObject.dogTypes
            }
            return  null
          }),
          furnished: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.furnishedTypes){
              return detailsObject.furnishedTypes
            }
            return  null
          }),
          nosmoking: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.smokingTypes){
              return detailsObject.smokingTypes
            }
            return  null
          }),
          wheelchair: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.wheelChairTypes){
              return detailsObject.wheelChairTypes;
            }
            return null
          }),
          bedrooms: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (el[0] && el[0].children){
              return el[0].children[0].data;
            }
          }),
          sqft: new TransformSelector('.attrgroup sup', 0, (el) => {
            if (el && el[0] && el[0].prev && el[0].prev.prev && el[0].prev.prev.children[0].data){
              return el[0].prev.prev.children[0].data;
            }
            return null;
          }),
          latLong: new TransformSelector('.mapbox', 0, function(el) {
            let coord = {latitude: null, longitude: null, accuracy: null};

            if (el[0] && el[0].children[1]){
              coord = {
                latitude: el[0].children[1].attribs['data-latitude'],
                longitude: el[0].children[1].attribs['data-longitude'],
                accuracy: el[0].children[1].attribs['data-accuracy']
              }
            }

            return coord;
          }),
          address: new TransformSelector('.mapbox', 0, function(el) {
            if (el[0] && el[0].children && el[0].children[3] && el[0].children[3].children) {
              return el[0].children[3].children[0].data;
            }
          })
        },

        itemProcessor: function(pageItem) {
          return new Promise(function(resolve, reject) {
            storage.push(pageItem)
            resolve();
            let toInsert = {
              urlnum:             pageItem.urlnum,
              descr:              pageItem.desc,
              housing_type:       pageItem.housingtype,
              laundry_types:      pageItem.laundry,
              parking_types:      pageItem.parking,
              bath_types:         pageItem.privatebath,
              private_room_types: pageItem.privatebr,
              cat_types:          pageItem.cats,
              dog_types:          pageItem.dogs,
              furnished_types:    pageItem.furnished,
              smoking_types:      pageItem.nosmoking,
              wheelchair_types:   pageItem.wheelchair,
              bedrooms:           pageItem.bedrooms,
              sqft:               pageItem.sqft,
              lat:                pageItem.latLong.latitude,
              lon:                pageItem.latLong.longitude,
              street_address:     pageItem.address
            };

            knex('listings')
              .where('urlnum', toInsert.urlnum)
              .first()
              .update(decamelizeKeys(toInsert))
              .returning('*')
              .then((row) => {
                  // console.log(row);
              }).catch((err) => {
                throw boom.create(400, `error: ${JSON.stringify(err)}`)
              });
          })
        },
      })

      new CerealScraper.Dispatcher(cerealIndiv).start().then(function() {
        res.send(storage);
    })

    }).catch((err) => {
      throw boom.create(400, `Err: err is ${err}`)
    });
})

router.get('/scrape_null/', (req, res) => {
  let storage     = [],
      url         = '',
      details     = [],
      br          = 0,
      area        = 0,
      housingtype = '',
      laundry     = '',
      parking     = '',
      privatebath = null,
      privatebr   = null,
      cats        = null,
      dogs        = null,
      furnished   = null,
      nosmoking   = null,
      wheelchair  = null;

  const housingTypes     = ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage/cabin'],
        laundryTypes     = ['laundry on site', 'w/d in unit', 'laundry in bldg'],
        parkingTypes     = ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking'],
        bathTypes        = ['private bath', 'no private bath'],
        privateRoomTypes = ['private room', 'room not private'],
        catTypes         = ['cats are OK - purrr'],
        dogTypes         = ['dogs are OK - wooof'],
        furnishedTypes   = ['furnished'],
        smokingTypes     = ['no smoking'],
        wheelchairTypes  = ['wheelchair accessible'];

let typeList         = {
    housingTypes,
    laundryTypes,
    parkingTypes,
    bathTypes,
    privateRoomTypes,
    catTypes,
    dogTypes,
    furnishedTypes,
    smokingTypes,
    wheelchairTypes
  },
    detailsObject    = {},
    urlnum           = '';

  knex('listings')
    .whereNull('bedrooms')
    .whereNull('void')
    .first()
    .then((row) => {
      if (!row){
        throw boom.create(404, `No bedrooms-null, void-null rows found`);
        return undefined;
      }
      url = row.url;

      request(`http://seattle.craigslist.org${url}`, function (error, response, body) {
        if (!error && response.statusCode == 404) {
          knex('listings')
            .whereNull('bedrooms')
            .whereNull('void')
            .first()
            .update({void: true}, '*')
            .then((row) => {
              throw boom.create(404, `Page at ${urlnum} no longer exists. New row is ${row}`)
            }).catch((err) => {
              throw boom.create(400, `Error: ${JSON.stringify(err)}`);
            })
        }
      })

      if (!row) {
        throw boom.create(400, `Entry for url ${urlnum} does not exist`)
      }

      urlnum = row.urlnum;

      let cerealIndiv = new CerealScraper.Blueprint({
        requestTemplate: {
          method: 'GET',
          uri:    `http://seattle.craigslist.org${url}`,
          qs:     {}
        },
        itemsSelector: '.body',
        fieldSelectors: {
          meta: new TransformSelector('h5', 0, function (el) {
            if (el[0] && el[0].children && el[0].children[0].data){
              return el[0].children[0].data;
            };
          }),
          urlnum: new TransformSelector('span .result-price', 0, function(el) {
            return urlnum;
          }),
          desc: new TransformSelector('#postingbody', 0, function(el) {
            if (el[0] && el.children && el[0].children[2]){
              return el[0].children[2].data
            }
          }),
          detailsmapped: new TransformSelector('.mapAndAttrs .attrgroup:last-of-type', 0, (el) => {
            if (el[0] && el[0].children){
              let arr = [];

              el[0].children.map((el) => {
                if (el.children && el.children.length > 0) {
                  arr.push(el.children[0].data);
                }
              });

              for (let i = 0; i < arr.length; i++){
                for (let key in typeList){
                  if (typeList[key].indexOf(arr[i]) !== -1){
                    detailsObject[key] = arr[i];
                    delete typeList[key];
                  }
                }
              }
            }

            return detailsObject;
          }),
          housingtype: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.housingTypes){
              return detailsObject.housingTypes
            }
            return  null
          }),
          laundry: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.laundryTypes){
              return detailsObject.laundryTypes
            }
            return  null
          }),
          parking: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.parkingTypes){
              return detailsObject.parkingTypes
            }
            return  null
          }),
          privatebath: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.bathTypes){
              return detailsObject.bathTypes
            }
            return  null
          }),
          privatebr: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.privateRoomTypes){
              return detailsObject.privateRoomTypes
            }
            return  null
          }),
          cats: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.catTypes){
              return detailsObject.catTypes
            }
            return  null
          }),
          dogs: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.dogTypes){
              return detailsObject.dogTypes
            }
            return  null
          }),
          furnished: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.furnishedTypes){
              return detailsObject.furnishedTypes
            }
            return  null
          }),
          nosmoking: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.smokingTypes){
              return detailsObject.smokingTypes
            }
            return  null
          }),
          wheelchair: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (detailsObject.wheelChairTypes){
              return detailsObject.wheelChairTypes;
            }
            return null
          }),
          bedrooms: new TransformSelector('.attrgroup span b', 0, (el) => {
            if (el[0] && el[0].children){
              return el[0].children[0].data;
            }
          }),
          sqft: new TransformSelector('.attrgroup sup', 0, (el) => {
            if (el && el[0] && el[0].prev && el[0].prev.prev && el[0].prev.prev.children[0].data){
              return el[0].prev.prev.children[0].data;
            }
            return null;
          }),
          latLong: new TransformSelector('.mapbox', 0, function(el) {
            let coord = {latitude: null, longitude: null, accuracy: null};

            if (el[0] && el[0].children[1]){
              coord = {
                latitude: el[0].children[1].attribs['data-latitude'],
                longitude: el[0].children[1].attribs['data-longitude'],
                accuracy: el[0].children[1].attribs['data-accuracy']
              }
            }

            return coord;
          }),
          address: new TransformSelector('.mapbox', 0, function(el) {
            if (el[0] && el[0].children && el[0].children[3] && el[0].children[3].children) {
              return el[0].children[3].children[0].data;
            }
          })
        },

        itemProcessor: function(pageItem) {
          return new Promise(function(resolve, reject) {
            console.log(pageItem.meta);
            if (pageItem.meta !== undefined && pageItem.meta.indexOf('The title on the listings page will be removed') !== -1){
              knex('listings')
                .where('urlnum', urlnum)
                .first()
                .update({void: true}, '*')
                .then((row) => {
                  console.log(row);
                  res.send(`Page at ${urlnum} no longer exists.`);
                }).catch((err) => {
                  throw boom.create(400, `Error: ${JSON.stringify(err)}`);
                });
            }
            storage.push(pageItem)
            resolve();
            let toInsert = {
              urlnum:             pageItem.urlnum,
              descr:              pageItem.desc,
              housing_type:       pageItem.housingtype,
              laundry_types:      pageItem.laundry,
              parking_types:      pageItem.parking,
              bath_types:         pageItem.privatebath,
              private_room_types: pageItem.privatebr,
              cat_types:          pageItem.cats,
              dog_types:          pageItem.dogs,
              furnished_types:    pageItem.furnished,
              smoking_types:      pageItem.nosmoking,
              wheelchair_types:   pageItem.wheelchair,
              bedrooms:           pageItem.bedrooms,
              sqft:               pageItem.sqft,
              lat:                pageItem.latLong.latitude,
              lon:                pageItem.latLong.longitude,
              street_address:     pageItem.address
            };

            knex('listings')
              .where('urlnum', toInsert.urlnum)
              .first()
              .update(decamelizeKeys(toInsert))
              .returning('*')
              .then((row) => {
                  // console.log(row);
              }).catch((err) => {
                throw boom.create(400, `error: ${JSON.stringify(err)}`)
              });
          })
        },
      })

      new CerealScraper.Dispatcher(cerealIndiv).start().then(function() {
        res.send(storage);
    })

    }).catch((err) => {
      throw boom.create(400, `Err: err is ${err}`)
    });
})

router.get('/scrape_list/:city', (req, res) => {
  let {city} = req.params;
  let details = [];
  let list = [];

  let cereallist = new CerealScraper.Blueprint({
    requestTemplate: {
      method: 'GET',
      uri: 'http://seattle.craigslist.org/search/sub',
      qs: {}
    },
    itemsSelector: '.rows .result-row',
    skipRows: [],
    fieldSelectors: {
      post_date: new TextSelector('.result-date'),
      title: new TextSelector('p a', 0),
      photos: new TransformSelector('a', 0, function(el) {
        el = el[0].attribs['data-ids'].split(',');
        el = el.map((str) => {
          return str.substr(2)
          // `https://images.craigslist.org/${}_300x300.jpg`
        });
        return {photos: el};
      }),
      bedrooms: new TransformSelector('.result-meta .housing', 0, (el) => {
        if (el[0].children[0].data) {
          let insert = el[0].children[0].data.replace(/^[\r\n]+|\.|[\r\n]+$/g, "");
          // console.log(insert);// console.log(insert);
        }
      }),
      sqft: new TransformSelector('.result-meta .housing', 0, (el) => {
        if (el[0].children[0].data) {
          let insert = el[0].children[0].data.replace(/^[\r\n]+|\.|[\r\n]+$/g, "");
          // console.log(insert);
        }
      }),
      neighborhood: new TextSelector('.result-hood', 0),
      urlnum: new TransformSelector('', 0, function(el) {
        console.log(el._root[0].attribs['data-pid']);
        // console.log(el[0].attribs['data-pid');
        return el._root[0].attribs['data-pid'];
      }),
      url: new TransformSelector('.result-title', 0, function(el) {
        return el[0].attribs.href;
      }),
      price: new TransformSelector('span .result-price', 0, function(el) {
        return parseFloat(el.text().replace('$', ''));
      })
    },
    itemProcessor: function(pageItem) {
      return new Promise(function(resolve, reject) {
        resolve();
        list.push(pageItem);
        //date, title, photos, br_sqft, place, url, price
        knex('listings')
          .where('url', pageItem.url)
          .first()
          .then((row) => {
            // if (row){
            //   throw boom.create(400, `Entry for url ${pageItem.url} already exists`)
            // }

            let {url, urlnum, post_date, title, photos, bedrooms, sqft, place, neighborhood, price} = pageItem;
            let toInsert = {url, urlnum, post_date, title, photos, bedrooms, sqft, place, neighborhood, price};

            for (let key in toInsert){
              if (!toInsert[key]){
                delete toInsert[key]
              }
            }

            knex('listings')
              .insert(toInsert, '*')
              .then((row) => {
                // res.send(row);
              });
          })
        return list;
      });
    },
    getNextRequestOptions: function() {
      var dispatcher = this,
        pagesToLoad = 2,
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

  var dispatcher = new CerealScraper.Dispatcher(cereallist);

  dispatcher.start().then(function() {
    // console.log(`list.length is ${list.length}`);
    // console.log(`details.length is ${details.length}`);
    // details = list.map((el) => {
    //   request.get(`http://localhost:3000/scrape_details/${el.url}`)
    // });
    //
    // list = list.map ((el) => {
    //   el.details =
    // })
    res.send(list);
  });
})

module.exports = router;