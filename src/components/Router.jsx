import React, { Component } from 'react';
import { Match, Miss } from 'react-router';
import Main from './Main';
import Login from './Login';

export default class Router extends Component {
  render() {
    return (
      <div>
        <Match pattern="/" exactly component={Main} />
        <Match pattern='/login' exactly component={Login} />
      </div>
    )
  }
}
