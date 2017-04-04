const express = require('express');
const morgan = require('morgan');
const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const http = require('http')

const compiler = webpack(config);

const app = express();

app.disable('x-powered-by');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

  default:
}

app.use(require('webpack-dev-middleware')(compiler, {
  // noInfo: true,
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/dist', express.static('dist'));

// CSRF Protection
// app.use((req, res, next) => {
//   if (/json/.test(req.get('Accept'))) {
//     return next();
//   }
//
//   res.sendStatus(406);
// });

const users = require('./routes/users');
const token = require('./routes/token');
const listings = require('./routes/listings');
const scrape = require('./routes/scrape');
// eslint-disable-next-line camelcase
const users_listings = require('./routes/users_listings');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(users);
app.use(token);
app.use(listings);
app.use(scrape);
app.use(users_listings);

// eslint-disable-next-line no-unused-vars, consistent-return
app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error(JSON.stringify(err, null, 2));

  if (err.status) {
    return res
    .status(err.status)
    .set('Content-Type', 'text/plain')
    .send(err);
  }

  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const port = process.env.PORT || 3000;

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, err => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${port}`);
});

module.exports = app;
