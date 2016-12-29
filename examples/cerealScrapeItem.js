// This example demonstrates how to define a Blueprint in CerealScraper and then executing the scrape job
'use strict';
const CerealScraper = require('cerealscraper'),
  TextSelector = CerealScraper.Blueprint.TextSelector,
  ConstantSelector = CerealScraper.Blueprint.ConstantSelector,
  TransformSelector = CerealScraper.Blueprint.TransformSelector,
  Promise = require('bluebird');

const single = function(urlFragment) {
  let storage = [];

  let cerealIndiv = new CerealScraper.Blueprint({
    requestTemplate: {
      method: 'GET',
      uri: `http://seattle.craigslist.org/see/sub/${urlFragment}.html`,
      qs: {}
    },
    itemsSelector: '.body',
    fieldSelectors: {
      body2: new TransformSelector('#postingbody', 0, function(el) {
        return el[0].children[2].data.split('\n');
      }),
      detailsmapped: new TransformSelector('.mapAndAttrs p:nth-of-type(2)', 0, (el) => {
        let arr = [];

        el[0].children.map((el) => {
          if (el.children && el.children.length > 0) {
            arr.push(el.children[0].data);
          }
        });

        return arr;
      }),

      latLong: new TransformSelector('.mapbox', 0, function(el) {
        let coord = {
          latitude: el[0].children[1].attribs['data-latitude'],
          longitude: el[0].children[1].attribs['data-longitude'],
          accuracy: el[0].children[1].attribs['data-accuracy']
        }
        return coord;
      }),
      address: new TransformSelector('.mapbox', 0, function(el) {
        return el[0].children[3].children[0].data;
      })
    },

    itemProcessor: function(pageItem) {
      return new Promise(function(resolve, reject) {
        storage.push(pageItem)
        resolve();
      });
    }
  });

  new CerealScraper
    .Dispatcher(cerealIndiv)
    .start()
    .then(function() {
      console.log(storage);
      return storage
    });

}

module.exports = single;