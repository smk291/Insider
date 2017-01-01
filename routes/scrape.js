// eslint-disable-next-line new-cap
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
const {camelizeKeys} = require('humps');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const decycle = require('json-decycle').decycle;
const retrocycle = require('json-decycle').retrocycle;
const timeout = require('connect-timeout');

var CerealScraper = require('cerealscraper'),
  TextSelector = CerealScraper.Blueprint.TextSelector,
  ConstantSelector = CerealScraper.Blueprint.ConstantSelector,
  TransformSelector = CerealScraper.Blueprint.TransformSelector,
  Promise = require('bluebird');

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

router.get('/scrape_details/:urlnum', (req, res) => {
  let storage = [];
  const {urlnum} = req.params;
  let url = '';

  knex('listings')
    .where('urlnum', urlnum)
    .first()
    .then((row) => {
      // console.log(row);
      if (!row) {
        throw boom.create(400, `Entry for url ${urlnum} does not exist`)
      }
      url = row.url;
      let br = 0;
      let area = 0;

      let cerealIndiv = new CerealScraper.Blueprint({
        requestTemplate: {
          method: 'GET',
          uri: `http://seattle.craigslist.org${url}`,
          qs: {}
        },
        itemsSelector: '.body',
        fieldSelectors: {
          // body2: new TransformSelector('#postingbody', 0, function(el) {
          //   return el[0].children[2].data
          //   //.split('\n');
          // }),
          // // detailsmapped: new TransformSelector('.mapAndAttrs p:nth-of-type(2)', 0, (el) => {
          // //   let arr = [];
          // //
          // //   el[0].children.map((el) => {
          // //     if (el.children && el.children.length > 0) {
          // //       arr.push(el.children[0].data);
          // //     }
          // //   });
          // //
          // //   return arr;
          // // }),
          // detailsmapped: new TransformSelector('.mapAndAttrs .attrgroup:last-of-type', 0, (el) => {
          //   let arr = [];
          //
          //   el[0].children.map((el) => {
          //     if (el.children && el.children.length > 0) {
          //       arr.push(el.children[0].data);
          //     }
          //   });
          //
          //   return arr;
          // }),
          // // apartment, condo, house, townhouse, duplex, land, in-law, cottage/cabin
          // // laundry on site, w/d in unit, laundry in bldg
          // // off-street parking, detached garage, attached garage, valet parking, street parking, carport, no parking
          // // private bath, no private bath
          // // private room, room not private
          // // cats are OK - purrr
          // // dogs are OK - wooof
          // // furnished
          // // no smoking
          // // wheelchair accessible
          // // .property_date (available...)
          bedrooms: new TransformSelector('.attrgroup span b', 0, (el) => {
            // console.log(el[0].children);
            // for (let i = 0; i < el[0].children.length; i++){
            //   if (el[0].children[i].name === 'span'){
            //     // console.log(el[0].children[i].children);
            //     for (let j = 0; j < el[0].children[i].children.length; j++){
            //       if (el[0].children[i].children[j].type === 'tag'){
            //         for (let k = 0; k < el[0].children[i].children[j].children.length; k++){
            //           if (el[0].children[i].children[j].children[k].data){
            //             // console.log(el[0].children[i].children[j].children[k].data);
            //             if (el[0].children[i].children[j].children[k].data.toLowerCase().indexOf('br')){
            //               br = el[0].children[i].children[j].children[k].data;
            //               // console.log(br);
            //               return br;
            //             }
            //           }
            //         }
            //       }
            //     }
            //   }
            // };
            console.log(el[0].children[0].data);
          }),
          // sqft: new TransformSelector('.attrgroup sup', 0, (el) => {
          //   return el[0].prev.prev.children[0].data;
          // }),
          // latLong: new TransformSelector('.mapbox', 0, function(el) {
          //   let coord = {
          //     latitude: el[0].children[1].attribs['data-latitude'],
          //     longitude: el[0].children[1].attribs['data-longitude'],
          //     accuracy: el[0].children[1].attribs['data-accuracy']
          //   }
          //   return coord;
          // }),
          // address: new TransformSelector('.mapbox', 0, function(el) {
          //   return el[0].children[3].children[0].data;
          // })
        },

        itemProcessor: function(pageItem) {
          return new Promise(function(resolve, reject) {
            storage.push(pageItem)
            resolve();

          // knex('listings')
          //   .where('url', id)
          //   .first()
          //   .then((row) => {
              // let {url, post_date, title, photos, bedrooms, sqft, place, neighborhood, price} = pageItem;
              // let toInsert = {url, post_date, title, photos, bedrooms, sqft, place, neighborhood, price};

              // for (let key in toInsert){
              //   if (!toInsert[key]){
              //     delete toInsert[key]
              //   }
              // }
              //
              // knex('listings')
              //   .update(toInsert, '*')
              //   .then((row) => {
              //     // res.send(row);
              //   });
            //
            // }).then((res) => {
            //   console.log(res);
            // }).catch((err) => {
            //   throw boom.create(400, `error: ${JSON.stringify(err)}`)
            // });

          return storage
          })
        },
      })

      new CerealScraper.Dispatcher(cerealIndiv).start().then(function() {
        // console.log(storage);
        res.send(storage);
      })
    }).catch((err) => {
      throw boom.create(400, `Err: err is ${err}`)
    })


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
            if (row){
              throw boom.create(400, `Entry for url ${pageItem.url} already exists`)
            }

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
        requestOptions.qs['s'] = dispatcher.pagesRequested * rowsPerPage - rowsPerPage; // s is the query string Craigslist uses to paginate
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

// let brsq = [];
//
// if (el.indexOf('br') !== -1) {
//   brsq.push(el.slice(0, el.indexOf('br')))
// }
//
// if (el.indexOf('ft')) {
//   let start = el.indexOf('ft');
//   while (start - 1 > 0 && (el[start - 1].charCodeAt() > 47 && el[start - 1].charCodeAt() < 58)) {
//     start--;
//   }
// }
// brsq.push(el[start]);



// body2: new TransformSelector('#postingbody', 0, function(el) {
//   return el[0].children[2].data
//   //.split('\n');
// }),
// detailsmapped: new TransformSelector('.mapAndAttrs p:nth-of-type(2)', 0, (el) => {
//   let arr = [];
//
//   el[0].children.map((el) => {
//     if (el.children && el.children.length > 0) {
//       arr.push(el.children[0].data);
//     }
//   });
//
//   return arr;
// }),
// bedrooms: new TransformSelector('.mapAndAttrs', 0, (el) => {
//   console.log(el);
// })
// // apartment, condo, house, townhouse, duplex, land, in-law, cottage/cabin
// // laundry on site, w/d in unit, laundry in bldg
// // off-street parking, detached garage, attached garage, valet parking, street parking, carport, no parking
// // private bath, no private bath
// // private room, room not private
// // cats are OK - purrr
// // dogs are OK - wooof
// // furnished
// // no smoking
// // wheelchair accessible
// // .property_date (available...)
// bedrooms: new TransformSelector('.attrgroup', 0, (el) => {
//   // console.log(el[0].children);
//   for (let i = 0; i < el[0].children.length; i++){
//     if (el[0].children[i].name === 'span'){
//       // console.log(el[0].children[i].children);
//       for (let j = 0; j < el[0].children[i].children.length; j++){
//         if (el[0].children[i].children[j].type === 'tag'){
//           for (let k = 0; k < el[0].children[i].children[j].children.length; k++){
//             if (el[0].children[i].children[j].children[k].data){
//               // console.log(el[0].children[i].children[j].children[k].data);
//               if (el[0].children[i].children[j].children[k].data.toLowerCase().indexOf('br')){
//                 br = el[0].children[i].children[j].children[k].data;
//                 console.log(br);
//                 return br;
//               }
//               if (el[0].children[i].children[j].children[k].data > 80){
//                 area = el[0].children[i].children[j].children[k].data
//               }
//             }
//           }
//         }
//       }
//     }
//   };
// }),
// sqft: new TextSelector('.attrgroup', 0, (el) => {
//   return area;
// }),
// latLong: new TransformSelector('.mapbox', 0, function(el) {
//   let coord = {
//     latitude: el[0].children[1].attribs['data-latitude'],
//     longitude: el[0].children[1].attribs['data-longitude'],
//     accuracy: el[0].children[1].attribs['data-accuracy']
//   }
//   return coord;
// }),
// address: new TransformSelector('.mapbox', 0, function(el) {
//   return el[0].children[3].children[0].data;
// })
// },
//
// itemProcessor: function(pageItem) {
//   return new Promise(function(resolve, reject) {
//     storage.push(pageItem)
//     resolve();
//
// knex('listings')
//   .where('url', id)
//   .first()
//   .then((row) => {
//     let {url, post_date, title, photos, bedrooms, sqft, place, neighborhood, price} = pageItem;
//     let toInsert = {url, post_date, title, photos, bedrooms, sqft, place, neighborhood, price};
//
//     for (let key in toInsert){
//       if (!toInsert[key]){
//         delete toInsert[key]
//       }
//     }
//
//     knex('listings')
//       .update(toInsert, '*')
//       .then((row) => {
//         // res.send(row);
//       });
//
//   }).then((res) => {
//     console.log(res);
//   }).catch((err) => {
//     throw boom.create(400, `error: ${JSON.stringify(err)}`)
//   });
//
// return storage
// })