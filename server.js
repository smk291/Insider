const express = require('express');
const morgan = require('morgan');
const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const http = require('http')
const request = require('request')
const fs = require('fs');

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

function scrapeHousing() {
  const scrapeSeattleHousing = new Promise((resolve, reject) => {
    request.get(`http://localhost:3000/scrape/seattle/apt`, {timeout: 120000}, (err, response, body) => {
      if (err) {
        reject(err);
      }

      resolve(body);
    })
  });

  scrapeSeattleHousing.then((results) => {
    fs.appendFile('server.log', "\n\nAll housing scraped at " + Date(Date.now()), (err) => {
      if (err) throw err;
      console.log("\n\nall housing scraped at " + Date(Date.now()));
    });

    fs.appendFile('server.log', "\n\n\n" + results, (err) => {
      if (err) throw err;
      console.log('\nHousing data was appended to server.log');
    });
  })
  .catch(err => console.log(err));
}

function scrapeSublets() {
  const scrapeSeattleHousing = new Promise((resolve, reject) => {
    request.get(`http://localhost:3000/scrape/seattle/sub`, {timeout: 120000}, (err, response, body) => {
      if (err) {
        reject(err);
      }

      resolve(body);
    })
  });

  scrapeSeattleHousing.then((results) => {
    fs.appendFile('server.log', "\n\nSublets scraped at " + Date(Date.now()), (err) => {
      if (err) throw err;
      console.log("\n\nSublets scraped at " + Date(Date.now()));
    });
    fs.appendFile('server.log', "\n\n\n" + results, (err) => {
      if (err) throw err;
      console.log('\nSublet data data was appended to server.log');
    });
  })
  .catch(err => console.log(err));
}

setInterval(() => {
  scrapeHousing();
}, 3600000);

setInterval(() => {
  scrapeSublets();
}, 3650000);

scrapeHousing();

scrapeSublets();

app.listen(port, err => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`\nPlease hold while the webpack does its thing and the database is populated with current active listings`)
  console.log(`\nListening on port: ${port}`);
});

module.exports = app;
