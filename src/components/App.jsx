import React, {Component} from 'react';
import {BrowserRouter, Route, browserHistory} from 'react-router';
import {Button, Grid, Jumbotron, Row, Col, Popover, Tooltip, Modal} from 'react-bootstrap';
import HeaderNavigation from './header/HeaderNavigation';
import Footer from './footer/Footer';
import Login from './body/Login';
import Main from './body/Main';
import 'bootstrap/less/bootstrap.less'
import axios from 'axios';
import Header from './header/Header';
import notify from 'react-notify-toast';
import globalCSS from '../../globalCSS.css'
import MapPage from './body/MapPage'
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
      details: {},
      activeTips: false,
      listings: [],
      markers: [],
      importance: {
        housing: 3,
        bedrooms: 3,
        rent: 3,
      },
      housingTypes: ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'inLaw', 'cottage', 'cabin'],
      apartment: true,
      condo: true,
      house: true,
      townhouse: true,
      duplex: true,
      land: true,
      inLaw: true,
      cottage: true,
      cabin: true,
      minBedrooms: 'null',
      maxBedrooms: 'null',
      minRent: 'null',
      maxRent: 'null'
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
    this.showTips = this.showTips.bind(this);
    this.setState = this.setState.bind(this);
    this.getListings = this.getListings.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.checkboxHandleChange = this.checkboxHandleChange.bind(this);
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

  handleCheckbox(e) {
    let change = {}
    change[e.target.name] = e.target.checked;
    this.setState({change})
  }

  checkboxHandleChange (field, e) {
    var nextState = {}
    nextState[field] = e.target.checked
    this.setState(nextState)
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

  showTips(e){
    e.preventDefault();

    const bool = this.state.activeTips;
    if (bool) {
      this.setState({ loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
    }
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

  getListings(e){
    e.preventDefault()

    axios({
      method: 'get',
      url: `/listings`
    }).then((res) => {
      let listings = res.data;
      // console.log(res.data);
      // console.log(listings);
      listings = listings.filter((el) => {
        return !el.void && el.checked;
      })

      let Jan = listings.filter((el) => {
        return el.post_date.indexOf('Jan') !== -1;
      })

      Jan.sort((a,b) => {
        return b.post_date.split(' ')[1] - a.post_date.split(' ')[1]
      })

      let Dec = listings.filter((el) => {
        return el.post_date.indexOf('Dec') !== -1;
      })

      Dec.sort((a,b) => {
        return b.post_date.split(' ')[1] - a.post_date.split(' ')[1]
      })

      listings = Jan.concat(Dec);
      let markers = [];

      markers = listings.filter((el) => {
        return el.lat && el.lon;
      });

      markers = markers.map((el) => {
        let position = new google.maps.LatLng(el.lat, el.lon);
        let {urlnum, bedrooms, price, title} = el;

        return {position, urlnum, bedrooms, price, title, showInfo: false}
      });

      this.setState({listings, markers});
    }).catch((err) => {
      // console.log(err);
    })
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Grid fluid>
            <Row>
              <Col sm={12} md={12}>
                <Header
                  {...this.props}
                  {...this.state}
                  {...this}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12}>
                <Main
                  getListings={this.getListings}
                  {...this.props}
                  {...this.state}
                  {...this}
                />
              </Col>
            </Row>
          </Grid>
          <Footer style={{padding: '0px', margin: '0px'}}/>
        </div>
      </BrowserRouter>
    )
  }
};