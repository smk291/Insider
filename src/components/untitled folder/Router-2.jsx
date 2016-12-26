import React, { Component } from 'react';
import { Match, Miss } from 'react-router';
import Main from './Main';
import axios from 'axios';
import { notify } from 'react-notify-toast';

export default class Router extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      loggedIn: ''
    };
    this.logOut = this.logOut.bind(this);
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  changeState() {
    const bool = this.state.loggedIn;
    if (bool) {
      this.setState({ loggedIn: false });
    } else {
      this.setState({ loggedIn: true });
    }
  }

  logOut() {
    axios({
      method: 'delete',
      url: '/token',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(`Logged Out`);
      // notify.show('Logged Out!', 'success', 3000);
    }).catch(err => {
      // notify.show('error', 3000);
    });
    this.changeState();
  }

  signUp(e) {
    e.preventDefault();

    axios({
      method: 'post',
      url: '/users',
      data: {
        lastName: this.state.lastName,
        firstName: this.state.firstName,
        email: this.state.email,
        password: this.state.password
      }
    }).then((res) => {
      this.setState({firstName: '', lastName: ''});
      this.logIn(e);
      console.log(`success!`);
    }).catch((err) => {
      // notify.show(err.response.data.errors[0].messages[0], 'error', 3000);
    });
  }

  logIn(e) {
    e.preventDefault();
    axios({
      method: 'post',
      url: '/token',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: this.state.email,
        password: this.state.password
      }
    }).then((res) => {
      console.log('success!');
      this.setState({email: '', password: ''});
      this.changeState();
      // notify.show('Logged In!', 'success', 3000);
    }).catch((err) => {
      console.log(err.response.data);
      // notify.show(err.response.data, 'error', 3000);
    });
  }

  handleChange(e) {
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  }

  render() {
    return (
      <div>
        <Match exactly pattern="/" render={() => (
          <Main
            logIn={this.logIn}
            logOut={this.logOut}
            handleChange={this.handleChange}
            signUp={this.signUp}
            email={this.state.email}
            password={this.state.password}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            changeState={this.changeState}
            loggedIn={this.state.loggedIn}
          />
        )} />
      </div>
    )
  }
}