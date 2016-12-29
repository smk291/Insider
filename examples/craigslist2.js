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
    },

    getNextRequestOptions: function() {
      var dispatcher = this,
        pagesToLoad = 1,
        rowsPerPage = 1,
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
      requests: 1,
      perUnit: "second"
    }
  });

  new CerealScraper.Dispatcher(cerealIndiv).start().then(function() {
    console.log(storage);
    // return storage
  });
  // console.log(storage);
  // return storage;
}

const getList = function(city) {
  let details = [];
  let list = [];

  let cereallist = new CerealScraper.Blueprint({
    requestTemplate: {
      method: 'GET',
      uri: `http://${city}.craigslist.org/search/sub`,
      qs: {}
    },

    itemsSelector: '.rows .result-row',
    skipRows: [],
    fieldSelectors: {
      title: new TextSelector('p a', 0),
      price: new TextSelector('a', 0),
      transformSelector2: new TransformSelector('li', 0, function(el) {
        return el._root[0].attribs['data-pid'];
      }),

      price: new TransformSelector('span .result-price', 0, function(el) {
        return parseFloat(el.text().replace('$', ''));
      })
    },

    itemProcessor: function(pageItem) {
      return new Promise(function(resolve, reject) {
        resolve();
        return new Promise((res, rej) => {
          let detailsElement = single(pageItem.transformSelector2);
          pageItem.details = detailsElement;
          list.push(pageItem);
        })
      });
    },

    getNextRequestOptions: function() {
      var dispatcher = this,
        pagesToLoad = 1,
        rowsPerPage = 10,
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

    parallelRequests: false,
    requestLimiterOptions: {
      requests: 1,
      perUnit: 'second'
    },
    processLimiterOptions: {
      requests: 100,
      perUnit: "second"
    }
  });

  new CerealScraper.Dispatcher(cereallist).start().then(function() {
    // console.log(list);
    console.log(`list.length is ${list.length}`);
    // console.log(details);
    console.log(`details.length is ${details.length}`);
  });
}

getList(`seattle`);
single(5937014951);
module.exports = getList;
