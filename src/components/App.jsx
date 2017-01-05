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
      bedroomsImport: 5,
      rentImport: 5,
      housingImport: 5,
      laundryImport: 5,
      parkingImport: 5,
      bathImport: 5,
      roomImport: 5,
      catImport: 5,
      dogImport: 5,
      furnishedImport: 5,
      smokingImport: 5,
      wheelchairImport: 5,
      minRent: 0,
      maxRent: 0,
      minBedrooms: 0,
      maxBedrooms: 0,
      housing_types: ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage', 'cabin'],
      apartment: true,
      condo: true,
      house: true,
      townhouse: true,
      duplex: true,
      land: true,
      'in-law': true,
      cottage: true,
      cabin: true,
      laundry_types: ['laundry on site', 'w/d in unit', 'laundry in bldg'],
      'laundry on site': true,
      'w/d in unit': true,
      'laundry in bldg': true,
      parking_types: ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking'],
      'off-street parking': true,
      'detached garage': true,
      'attached garage': true,
      'valet parking': true,
      'street parking': true,
      'carport': true,
      'no parking': true,
      'bath_types': ['private bath', 'no private bath'],
      'private bath': true,
      'no private bath': true,
      'private_room_types': ['private room', 'room not private'],
      'private room': true,
      'room not private': false,
      'cat_types': ['cats are OK - purrr'],
      'cats are OK - purrr': true,
      'dog_types': ['dogs are OK - wooof'],
      'dogs are OK - wooof': true,
      'furnished_types': ['furnished'],
      'furnished': true,
      'smoking_types': ['no smoking'],
      'no smoking': true,
      'wheelchair_types': ['wheelchair accessible'],
      'wheelchair accessible': true
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
    this.handleChbox = this.handleChbox.bind(this);
    this.housingSlider = this.housingSlider.bind(this);
    this.rentSlider = this.rentSlider.bind(this);
    this.bedroomSlider = this.bedroomSlider.bind(this);
    this.roomSlider = this.roomSlider.bind(this);
    this.bathSlider = this.bathSlider.bind(this);
    this.parkingSlider = this.parkingSlider.bind(this);
    this.laundrySlider = this.laundrySlider.bind(this);
    this.furnishedSlider = this.furnishedSlider.bind(this)
    this.catSlider = this.catSlider.bind(this)
    this.dogSlider = this.dogSlider.bind(this)
    this.smokingSlider = this.smokingSlider.bind(this)
    this.wheelchairSlider = this.wheelchairSlider.bind(this)
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

  handleChbox (field, e) {
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
    console.log(e);
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  }

  housingSlider(e) {
    this.setState({housingImport: e.value});
  }

  rentSlider(e) {
    this.setState({rentImport: e.value});
  }

  bedroomSlider(e) {
    this.setState({bedroomsImport: e.value});
  }

  roomSlider(e) {
    this.setState({roomImport: e.value});
  }

  bathSlider(e) {
    this.setState({bathImport: e.value});
  }

  parkingSlider(e) {
    this.setState({parkingImport: e.value});
  }

  laundrySlider(e) {
    this.setState({laundryImport: e.value});
  }

  furnishedSlider(e) {
    this.setState({furnishedImport: e.value});
  }

  catSlider(e) {
    this.setState({catImport: e.value});
  }

  dogSlider(e) {
    this.setState({dogImport: e.value});
  }

  smokingSlider(e) {
    this.setState({smokingImport: e.value});
  }

  wheelchairSlider(e) {
    this.setState({wheelchairImport: e.value});
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
          <Grid fluid style={{height: '90vh', minWidth: '1000px'}}>
            <Row style={{minWidth: '1000px'}}>
              <Col>
                <Header style={{height: '50px'}}
                  {...this.props}
                  {...this.state}
                  {...this}
                />
              </Col>
            </Row>
            <Row style={{minWidth: '1000px'}}>
              <Col>
                <Main
                  getListings={this.getListings}
                  {...this.props}
                  {...this.state}
                  {...this}
                />
              </Col>
            </Row>
          </Grid>
          <Footer style={{minWidth: '1000px', padding: '0px', margin: '0px'}}/>
        </div>
      </BrowserRouter>
    )
  }
};

App.propTypes = {
  maxBedrooms: React.PropTypes.number,
  minBedrooms: React.PropTypes.number,
  maxRent: React.PropTypes.number,
  minRent: React.PropTypes.number,
};