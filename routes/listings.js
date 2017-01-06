//eslint-disable-next-line new-cap
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

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.verify = false;

      return next(boom.create(401, 'Unauthorized'));
    }

    res.verify = true;
    req.token = decoded;

    next();
  });
};

var CerealScraper   = require('cerealscraper'),
  TextSelector      = CerealScraper.Blueprint.TextSelector,
  ConstantSelector  = CerealScraper.Blueprint.ConstantSelector,
  TransformSelector = CerealScraper.Blueprint.TransformSelector,
  Promise           = require('bluebird');

router.get('/listings_check/', (req, res) => {
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

  const housingTypes = ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage/cabin'],
        laundryTypes     = ['laundry on site', 'w/d in unit', 'laundry in bldg'],
        parkingTypes     = ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking'],
        bathTypes        = ['private bath', 'no private bath'],
        privateRoomTypes = ['private room', 'room not private'],
        catTypes         = ['cats are OK - purrr'],
        dogTypes         = ['dogs are OK - wooof'],
        furnishedTypes   = ['furnished'],
        smokingTypes     = ['no smoking'],
        wheelchairTypes  = ['wheelchair accessible'];

  let detailsObject    = {},
      urlnum           = '',
      typeList         = {
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

  knex('listings')
    .whereNull('checked')
    .whereNull('void')
    .first()
    .then((row) => {
      if (!row){
        throw boom.create(400, `No bedrooms-null, void-null rows found`);
      }
      url = row.url;

      request(`http://seattle.craigslist.org${url}`, function (error, response, body) {
        if (!error && response.statusCode == 404) {
          knex('listings')
            .whereNull('bedrooms')
            .whereNull('void')
            .first()
            .update({void: true, checked: true}, '*')
            .then((row) => {
              throw boom.create(400, `Page at ${urlnum} no longer exists. New row is ${row}`)
            }).catch((err) => {
              throw boom.create(400, `Error: ${JSON.stringify(err)}`);
            })
        }
      })

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
          }),
          subOrApt: new TransformSelector('.attrgroup span b', 0, (el) => {
            return 'sub';
          })
        },

        itemProcessor: function(pageItem) {
          return new Promise(function(resolve, reject) {
            if (pageItem.meta !== undefined && pageItem.meta.indexOf('The title on the listings page will be removed') !== -1){
              knex('listings')
                .where('urlnum', urlnum)
                .first()
                .update({void: true}, '*')
                .then((row) => {
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
              street_address:     pageItem.address,
              sub_or_apt:         pageItem.subOrApt,
              checked:            true
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
      res.status(400).send(`Err: err is ${err}`)
    });
})

//Post meal
router.post('/listings', authorize,
/*ev(validations.post),*/
(req, res, next) => {
  const {
    housingSearchesId, location, neighborhood, aptInHouse, streetAddress, crossStreets, cost, costPer, bedrooms, bathrooms, housingType, rent, own, roommates, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
  } = req.body;

  const {userId} = req.token;

  knex('listings').insert(decamelizeKeys({
    location, neighborhood, aptInHouse, streetAddress, crossStreets, cost, costPer, bedrooms, bathrooms, housingType, rent, own, roommates, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
  }), '*').returning('id').then((id) => {
    knex('housing_searches_listings_users').insert(decamelizeKeys({userId, listingsId: id[0], housingSearchesId}), '*').then((housingSearchesListingsUsersRow) => {
      res.send(decamelizeKeys(housingSearchesListingsUsersRow));
    });
  }).catch((err) => {
    next(err);
  });

  knex
});

//Get individual listing
router.get('/listings/:id', authorize, (req, res, next) => {
  const {userId} = req.token;
  const {id} = req.params;

  knex('listings').where('id', id).first().then((listing) => {
    if (listing === [] || !listing) {
      throw boom.create(400, `No listings exist for user`);
    }

    res.send(listing);
  }).catch((err) => {
    next(err);
  });
});

//Get all listings
router.get('/listings', (req, res, next) => {
  knex('listings')
    .orderBy('id', 'desc')
    .then((listings) => {
      if (listings === [] || !listings) {
        throw boom.create(400, `No listings found`);
      }

      res.send(listings);
    }).catch((err) => {
      next(err);
    });
});

// Patch a listing
router.patch('/listings/:id', authorize,
/*ev(validations.post),*/
(req, res, next) => {
  // url
  // urlnum
  // post_date
  // title
  // photos
  // empty_page
  // bedrooms
  // sqft
  // descr
  // notes
  // price
  // neighborhood
  // location
  // street_address
  // state
  // zip
  // lat
  // lon
  // cross_streets
  // checked
  // housing_type
  // laundry_types
  // parking_types
  // bath_types
  // private_room_types
  // cat_types
  // dog_types
  // furnished_types
  // smoking_types
  // wheelchair_types
  // sub_or_apt
  // true


  const {
    housingSearchesId, location, neighborhood, aptInHouse, streetAddress, crossStreets, cost, costPer, bedrooms, bathrooms, housingType, rent, own, roommates, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
  } = req.body;
  const {id} = req.params;
  const {userId} = req.token;
  const patchContents = {
    location, neighborhood, aptInHouse, streetAddress, crossStreets, cost, costPer, bedrooms, bathrooms, housingType, rent, own, roommates, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
  };

  knex('listings').where('id', id).first().then((row) => {
    if (!row) {
      throw boom.create(400, `No listing found at listings.id ${id}`);
    }

    knex('housing_searches_listings_users').where('user_id', userId).where('listings_id', id).first().then((row) => {
      if (!row) {
        throw boom.create(400, `Listing at id ${id} does not belong to user.id ${userId}`);
      }
    }).catch((err) => {
      next(err);
    });

    const updateRow = {};

    for (let key in patchContents) {
      if (key) {
        updateRow[key] = patchContents[key];
      }
    }

    return knex('listings').where('id', id).update(decamelizeKeys(updateRow), '*');
  }).then((row) => {
    res.send(camelizeKeys(row));
  }).catch((err) => {
    next(err);
  });
});

router.delete('/listings/:id', authorize, (req, res, next) => {
  const listingsId = req.params.id;
  const {userId} = req.token;
  const deleted = {};

  knex('listings').where('id', listingsId).first().then((row) => {
    if (!row) {
      throw boom.create(400, `No listing at listing.id ${listingsId}`);
    }

    deleted.fromListings = camelizeKeys(row);

    knex('housing_searches_listings_users').where('listings_id', listingsId).then((row) => {
      if (Number(row.user_id) !== userId && row.user_id) {
        throw boom.create(400, `listings_id ${listingsId} does not belong to current user user.id ${userId}`);
      }
    }).catch((err) => {
      next(err);
    });
  }).then(() => {
    knex('housing_searches_listings_users').where('listings_id', listingsId)
      .where('user_id', userId)
      .first()
      .then((row) => {
        if (!row) {
          throw boom.create(400, `listings.id ${listingsId} exists in listings, but there's no entry for it in users_listings. This shouldn't be possible.`);
        }

        deleted.fromListingsUsers = camelizeKeys(row);

        return knex('listings').where('id', listingsId).del();
      }).then(() => {
        res.send(deleted);
      }).catch((err) => {
        next(err);
      });
  }).catch((err) => {
    next(err);
  });
});

module.exports = router;
