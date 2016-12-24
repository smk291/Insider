import React, { Component } from 'react';
import { BrowserRouter } from 'react-router';
import AuthService from './AuthService';

export default class Login extends Component {
  render() {
    return (
      <div>
        <AuthService />
      </div>
    )
  }
}
