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
      bedroomsImportRequired: false,
      rentImportRequired: false,
      housingImportRequired: false,
      laundryImportRequired: false,
      parkingImportRequired: false,
      bathImportRequired: false,
      roomImportRequired: false,
      catImportRequired: false,
      dogImportRequired: false,
      furnishedImportRequired: false,
      smokingImportRequired: false,
      wheelchairImportRequired: false,
      minRent: '',
      maxRent: '',
      minBedrooms: '',
      maxBedrooms: '',
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
      'wheelchair accessible': true,
      rentAvg: '',
      rent0brAvg: '',
      rent1brAvg: '',
      rent2brAvg: '',
      rent3brAvg: '',
      rent4brAvg: '',
      adToView: {},
      start: 0,
      stop: 9,
      startFiltered: 0,
      stopFiltered: 9,
      strictMode: false,
      filteredList: [],
      filteredOptions: [],
      maxScore: [],
      types: ['bedroomsRange', 'rentRange', 'housing_type', 'laundry_types', 'parking_types', 'bath_types', 'private_room_types', 'cat_types', 'dog_types', 'furnished_types', 'smoking_types', 'wheelchair_types'],
      importTypes: ['bedroomsImport', 'rentImport', 'housingImport', 'laundryImport', 'parkingImport', 'bathImport', 'roomImport', 'catImport', 'dogImport', 'furnishedImport', 'smokingImport', 'wheelchairImport'],
      optionArrays: [
        ['minBedrooms', 'maxBedrooms'],
        ['minRent', 'maxRent'],
        ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage', 'cabin'],
        ['laundry on site', 'w/d in unit', 'laundry in bldg'],
        ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking'],
        ['private bath', 'no private bath'],
        ['private room', 'room not private'],
        ['cats are OK - purrr'],
        ['dogs are OK - wooof'],
        ['furnished'],
        ['no smoking'],
        ['wheelchair accessible']
      ],
      requiredTypes: [
        'bedroomsImportRequired',
        'rentImportRequired',
        'housingImportRequired',
        'laundryImportRequired',
        'parkingImportRequired',
        'bathImportRequired',
        'roomImportRequired',
        'catImportRequired',
        'dogImportRequired',
        'furnishedImportRequired',
        'smokingImportRequired',
        'wheelchairImportRequired'
      ],
      typesAndPrefs: [
        ['bedroomsRange', 'bedroomsImport', ['minBedrooms', 'maxBedrooms']],
        ['rentRange', 'rentImport', ['minRent', 'maxRent']],
        ['housing_type', 'housingImport', ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage', 'cabin']],
        ['laundry_types', 'laundryImport', ['laundry on site', 'w/d in unit', 'laundry in bldg']],
        ['parking_types', 'parkingImport', ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking']],
        ['bath_types', 'bathImport', ['private bath', 'no private bath']],
        ['private_room_types', 'roomImport', ['private room', 'room not private']],
        ['cat_types', 'catImport', ['cats are OK - purrr']],
        ['dog_types', 'dogImport', ['dogs are OK - wooof']],
        ['furnished_types', 'furnishedImport', ['furnished']],
        ['smoking_types', 'smokingImport', ['no smoking']],
        ['wheelchair_types', 'wheelchairImport', ['wheelchair accessible']],
      ]

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
    this.increment = this.increment.bind(this)
    this.decrement = this.decrement.bind(this)
    this.incrementFiltered = this.incrementFiltered.bind(this)
    this.decrementFiltered = this.decrementFiltered.bind(this)
    this.filterListings = this.filterListings.bind(this)
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
      }).catch((err) => {
      });
  }

  scrapeList(e) {
    e.preventDefault();

    axios({
      method: 'get',
      url: '/scrape_list/seattle'
    }).then((res) => {
      this.setState({list: res.data});
    }).catch((err) => {
      // notify.show(err.response.data.errors[0].messages[0], 'error', 3000);
    });
  }

  scrapeRows(e) {
    let details = [];

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
  }

  getListings(){
    axios({
      method: 'get',
      url: `/listings`
    }).then((res) => {
      let listings = res.data;
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
      // console.log(this.state.listings);
    }).catch((err) => {
      // console.log(err);
    })
  }

  decrement(e){
    let start = this.state.start;
    let stop = this.state.stop;
    console.log(start);
    console.log(stop);
    if (start < 10){
      start = 0;
      stop = 9;
    } else {
      start -= 10;
      stop -= 10;
    }
    console.log(start);
    console.log(stop);
    this.setState({start: start, stop: stop});
  }

  increment(e){
    let start = this.state.start;
    let stop = this.state.stop;
    console.log(start);
    console.log(stop);
    if (this.state.listings.length - stop < 10){
      stop = this.state.listings.length - 1;
      start = this.state.listings.length - 10;
    } else {
      start += 10;
      stop += 10;
    }
    console.log(start);
    console.log(stop);
    this.setState({start: start, stop: stop});
  }

  decrementFiltered(e){
    let start = this.state.startFiltered;
    let stop = this.state.stopFiltered;

    if (start < 10){
      start = 0;
      stop = 9;
    } else {
      start -= 10;
      stop -= 10;
    }

    this.setState({startFiltered: start, stopFiltered: stop});
  }

  incrementFiltered(e){
    let start = this.state.startFiltered;
    let stop = this.state.stopFiltered;
    console.log(start);
    console.log(stop);
    if (this.state.filteredList.length - stop < 10){
      stop = this.state.filteredList.length - 1;
      start = this.state.fileredList.length - 10;
    } else {
      start += 10;
      stop += 10;
    }
    console.log(start);
    console.log(stop);
    this.setState({startFiltered: start, stopFiltered: stop});
  }

  filterListings(){
    let maxScore = 0;

    maxScore = this.state.importTypes.reduce((acc, pref, idx) => {
      return acc + this.props[pref];
    }, 0);

    this.setState({maxScore})

    let filteredOptions = [];

    filteredOptions = this.state.optionArrays.map((type) => {
      return type.filter((option) => {
        return this.state[option]
      })
    });

    this.setState({filteredOptions})

    // 2. Loop through listings
    let filteredList = [];

    filteredList = this.state.listings.filter((el, idx) => {
      el.score = 0;

      if(el.bedrooms){
        let minBed = Number(this.state.minBedrooms);
        let maxBed = Number(this.state.maxBedrooms);
        let brs = Number(el.bedrooms.slice(0, el.bedrooms.indexOf('BR')));

        if (brs >= minBed && brs <= maxBed){
          el.score += Number(this.state.bedroomsImport);
        } else if (this.state.bedroomsImportRequired){
          return false;
        }
      } else if (this.state.bedroomsImportRequired) {
        return false;
      }

      if (el.price){
        let minRent = Number(this.state.minRent);
        let maxRent = Number(this.state.maxRent);
        let rent = Number(el.price);

        if (rent >= minRent && rent <= maxRent){
          el.score += Number(this.state.rentImport);
        } else if (this.state.rentImportRequired){
          return false;
        }
      } else if (this.state.rentImportRequired) {
        return false;
      }

      for (let i = 2; i < this.state.types.length; i++){
        let value = el[this.state.types[i]];
        let filteredTypeOptions = filteredOptions[i];
        let importance = this.state[this.state.importTypes[i]]
        let requiredBool = this.state[this.state.requiredTypes[i]]
        if (value !== null){
          if (filteredTypeOptions.indexOf(value) !== -1){
            el.score += Number(importance);
          } else if (requiredBool){
            return false
          }
        } else if (requiredBool){
          return false
        }

      }

      return true
    });

    this.setState({filteredList})
  }

  // if (el.housing_type){
  //   let housingArr = filteredOptions[2];
  //   let listingType = el['housing_type'];
  //
  //   if (housingArr.indexOf(listingType) !== -1){
  //     el.score += this.state.housingImport;
  //   } else if (this.state.housingImportRequired){
  //     return false
  //   }
  // } else if (this.state.housingImportRequired){
  //   return false
  // }
  //

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