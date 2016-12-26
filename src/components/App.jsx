import React, {Component} from 'react';
import {BrowserRouter, Route, browserHistory} from 'react-router';
import 'bootstrap/less/bootstrap.less'

import Router from './Router';

export default class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <BrowserRouter history={browserHistory}>
        <div>
          <Router />
        </div>
      </BrowserRouter>
    )
  }
}
