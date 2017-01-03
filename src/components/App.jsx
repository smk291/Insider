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
// import Body from './Body';
import HeaderNavigation from './header/HeaderNavigation';
import Footer from './footer/Footer';
import Login from './body/Login';
import Main from './body/Main';
import 'bootstrap/less/bootstrap.less'
import axios from 'axios';
import Header from './header/Header';
import notify from 'react-notify-toast';

// import Router from './Router';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      loggedIn: '',
      signUpPassword: '',
      signUpEmail: '',
      list: [],
      details: {}
    }
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.logOut = this.logOut.bind(this);
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeState = this.changeState.bind(this);
    this.scrapeList = this.scrapeList.bind(this);
    this.scrapeRows = this.scrapeRows.bind(this);
    this.scrapeNull = this.scrapeNull.bind(this);
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

  logOut (e) {
    e.preventDefault();

    axios({
      method: 'delete',
      url: '/token',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log(res);
      // notify.show('Logged Out!', 'success', 3000);
    })
    .catch(err => {
      console.log(err);
      // notify.show(err.response.data, 'error', 3000);
    });
    this.changeState();
  }

  // signUp(e) {
  //   e.preventDefault();
  //
  //   axios({
  //     method: 'post',
  //     url: '/users',
  //     data: {
  //       firstName: this.state.firstName,
  //       lastName: this.state.lastName,
  //       email: this.state.signUpEmail,
  //       password: this.state.signUpPassword
  //     }
  //   }).then((res) => {
  //     this.setState({firstName: '', lastName: ''});
  //     axios({
  //       method: 'post',
  //       url: '/token',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       data: {
  //         email: this.state.signUpEmail,
  //         password: this.state.signUpPassword
  //       }
  //     })
  //     .then((res) => {
  //       this.setState({signUpEmail: '', signUpPassword: ''});
  //       this.props.changeState();
  //       notify.show('Logged In!', 'success', 3000);
  //     })
  //     .catch((err) => {
  //       notify.show(err.response.data, 'error', 3000);
  //     });
  //     notify.show('Logged In!', 'success', 3000);
  //     console.log(`success!`);
  //   }).catch((err) => {
  //     // notify.show(err.response.data.errors[0].messages[0], 'error', 3000);
  //   });
  // }

  signUp(e) {
    e.preventDefault();

    axios({
      method: 'post',
      url: '/users',
      data: {
        lastName: this.state.lastName,
        firstName: this.state.firstName,
        email: this.state.signUpEmail,
        password: this.state.signUpPassword
      }
    })
    .then((res) => {
      console.log(res);
      this.setState({
        firstName: '',
        lastName: '',
      });

      axios({
        method: 'post',
        url: '/token',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          email: this.state.signUpEmail,
          password: this.state.signUpPassword
        }
      })
      .then((res) => {
        this.setState({signUpEmail: '', signUpPassword: ''});
        this.changeState();
        console.log('Logged In!', 'success', 3000);
      })
      .catch((err) => {
        console.log(err);
      });
      console.log('Logged In!', 'success', 3000);
      console.log(`success!`);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // logIn(e) {
  //   e.preventDefault();
  //   axios({
  //     method: 'post',
  //     url: '/token',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     data: {
  //       email: this.state.email,
  //       password: this.state.password
  //     }
  //   }).then((res) => {
  //     console.log('success!');
  //     this.setState({email: '', password: '', loggedIn: true});
  //     this.changeState();
  //     notify.show('Logged In!', 'success', 3000);
  //   }).catch((err) => {
  //     console.log(err.response.data);
  //     // notify.show(err.response.data, 'error', 3000);
  //   });
  // }

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
    })
    .then((res) => {
      this.setState({
        email: '',
        password: ''
      });
      this.changeState();
      console.log(`logged in`);
      console.log(res);
      // notify.show('Logged In!', 'success', 3000);
    })
    .catch((err) => {
      console.log(err);
      // notify.show(err.response.data, 'error', 3000);
    });
  }

  handleChange(e) {
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  }

  scrapeNull(e) {
    // let errBool = false;
    // //
    // while (!errBool){
      e.preventDefault();

      axios({
        method: 'get',
        url: '/scrape_null'
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        // errBool = true;
        console.log(err);
      });
    // }
  }

  scrapeList(e) {
    e.preventDefault();

    axios({
      method: 'get',
      url: '/scrape_list/seattle'
    }).then((res) => {
      console.log(res);
      this.setState({list: res.data});
    }).catch((err) => {
      // notify.show(err.response.data.errors[0].messages[0], 'error', 3000);
    });
  }

  scrapeRows(e) {
    let details = [];
    console.log(this.state.list.data);

    this.state.list.map((el) => {
      if (el.urlnum){
        axios({
          method: 'get',
          url: `/scrape_details/${el.urlnum}`
        }).then((res) => {
          details.push(res.data);
          this.setState({details});
        }).catch((err) => {
          details.push(err);
          this.setState({details});
        });
      } else {
        details.push(null);
        this.setState({details});
      }
    })
    console.log(details);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header
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
            lastName={this.state.lastName}/>
          <Main
            loggedIn={this.state.loggedIn}
            signUp={this.signUp}
            logOut={this.logOut}
            logIn={this.logIn}
            open={this.open}
            close={this.close}
            changeState={this.changeState}
            handleChange={this.handleChange}
            showModal={this.state.showModal}
            email={this.state.email}
            password={this.state.password}
            signUpEmail={this.state.signUpEmail}
            signUpPassword={this.state.signUpPassword}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            scrapeList = {this.scrapeList}
            scrapeRows = {this.scrapeRows}
            scrapeNull = {this.scrapeNull}
            list = {this.state.list}
            details = {this.state.details}
          />
          <Footer />
        </div>
      </BrowserRouter>
    )
  }
};