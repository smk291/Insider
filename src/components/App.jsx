import React, { Component } from 'react';
import { BrowserRouter } from 'react-router';

import Router from './Router';

export default class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <p>Hello!</p>
          <Router />
        </div>
      </BrowserRouter>
    )
  }
}
