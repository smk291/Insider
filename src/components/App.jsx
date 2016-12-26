import React, {Component} from 'react';
import {BrowserRouter, Route, browserHistory} from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Popover from 'react-bootstrap/lib/Popover';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Modal from 'react-bootstrap/lib/Modal';
// import LearnMore from './LearnMore';
import Body from './Body';
import HeaderNavigation from './HeaderNavigation';
import Footer from './Footer';
import Login from './Login';
import Main from './Main';
import 'bootstrap/less/bootstrap.less'
import axios from 'axios';

import Router from './Router';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      loggedIn: ''
    }
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.logOut = this.logOut.bind(this);
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  close(){
    this.setState({ showModal: false });
  }

  open(){
    this.setState({ showModal: true });
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
      <BrowserRouter history={browserHistory}>
        <div>
          <HeaderNavigation
            loggedIn={this.state.loggedIn}
            logOut={this.logOut}
            logIn={this.logIn}
            open={this.open}
            close={this.close}
            changeState={this.changeState}
            handleChange={this.handleChange}
            showModal={this.state.showModal}
            email={this.state.email}
            password={this.state.password}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
          />
          <Main
            loggedIn={this.state.loggedIn}
            logOut={this.logOut}
            logIn={this.logIn}
            open={this.open}
            close={this.close}
            changeState={this.changeState}
            handleChange={this.handleChange}
            showModal={this.state.showModal}
            email={this.state.email}
            password={this.state.password}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            />
          <Footer />
        </div>
      </BrowserRouter>
    )
  }
}
