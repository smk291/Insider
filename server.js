// eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const app = express();
const knex = require('knex');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const compiler = webpack(config);

app.use(cookieParser());
app.use(bodyParser());

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT || 3000;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/dist', express.static('dist'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening on port: ' + port);
});


// module.exports = app;

// //
// //
// // app.use((err, _req, res, _next) => {
// //   if (err.output && err.output.statusCode) {
// //     return res
// //       .status(err.output.statusCode)
// //       .set('Content-Type', 'text/plain')
// //       .send(err.message);
// //   }
// //
// //   // eslint-disable-next-line no-console
// //   console.error(JSON.stringify(err, null, 2));
// //
// //   if (err.status) {
// //     return res
// //     .status(err.status)
// //     .set('Content-Type', 'text/plain')
// //     .send(err);
// //   }
// //
// //   // eslint-disable-next-line no-console
// //   console.error(err.stack);
// //   res.sendStatus(500);
// // });
// //
// // const port = process.env.PORT || 3000;
// //
// // app.listen(port, () => {
// //   if (app.get('env') !== 'test') {
// //     //eslint-disable-next-line no console
// //     console.log('Listening on port', port);
// //   }
// // });
//
// module.exports = app;
// //
// //
// //
// // // eslint-disable-next-line new-cap
// // 'use strict';
// //
// // const express = require('express');
// // const app = express();
// // const knex = require('knex');
// // const bodyParser = require('body-parser');
// // const cookieParser = require('cookie-parser');
// // const path = require('path');
// // const webpack = require('webpack');
// // const config = require('./webpack.config.dev');
// // const compiler = webpack(config);
// //
// // app.use(cookieParser());
// // app.use(bodyParser());
// //
// // if (process.env.NODE_ENV !== 'production') {
// //   require('dotenv').config();
// // }
// //
// // const port = process.env.PORT || 3000;
// //
// // app.use(require('webpack-dev-middleware')(compiler, {
// //   noInfo: true,
// //   publicPath: config.output.publicPath
// // }));
// //
// // app.use(require('webpack-hot-middleware')(compiler));
// //
// // app.use('/dist', express.static('dist'));
// //
// // app.get('*', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'index.html'));
// // });
// //
// // app.listen(port, err => {
// //   if (err) {
// //     console.log(err);
// //     return;
// //   }
// //
// //   console.log('Listening on port: ' + port);
// // });
