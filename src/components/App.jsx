//<editor-fold import
import React, {Component} from 'react';
import {BrowserRouter, Route, browserHistory} from 'react-router';
import {Button, Grid, Jumbotron, Row, Col, Popover, Tooltip, Modal} from 'react-bootstrap';
import Footer from './footer/Footer';
import Routing from './body/Routing';
import 'bootstrap/less/bootstrap.less'
import axios from 'axios';
import Header from './header/Header';
import notify from 'react-notify-toast';
import globalCSS from '../../globalCSS.css'
import request from 'request'
import titleize from 'underscore.string/titleize'
import ReactToastr from 'react-toastr'
import ToastContainer from 'react-toastr'

//</editor-fold>

export default class App extends Component {
  // <editor-fold> props and state used
  constructor(props) {
    super(props);
    this.state = {
      // <editor-fold> Auth
      email: '',
      password: '',
      //For sign up
      firstName: '',
      lastName: '',
      loggedIn: '',
      signUpPassword: '',
      signUpEmail: '',
      // </editor-fold>
      // <editor-fold> State for determining boolean preferences
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
      // </editor-fold>
      // <editor-fold> State for weighting
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
      // </editor-fold>
      // <editor-fold> State for removing null values if user specifies strict mode
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
      // </editor-fold>
      // <editor-fold> unnecessarily stored data
      rentAvg: '',
      rent0brAvg: '',
      rent1brAvg: '',
      rent2brAvg: '',
      rent3brAvg: '',
      rent4brAvg: '',
      strictMode: false,
      maxScore: [],
      // </editor-fold>
      // <editor-fold> State of listings
      listings: [],
      markers: [],
      filteredList: [],
      filteredOptions: [],
      listingsToDisplay: [],
      filteredListingsToDisplay: [],
      // </editor-fold>
      // <editor-fold> State for filtering listings
      types : [
        'bedroomsRange',
        'rentRange',
        'housing_type',
        'laundry_types',
        'parking_types',
        'bath_types',
        'private_room_types',
        'cat_types',
        'dog_types',
        'furnished_types',
        'smoking_types',
        'wheelchair_types'
      ],
      importTypes : [
        'bedroomsImport',
        'rentImport',
        'housingImport',
        'laundryImport',
        'parkingImport',
        'bathImport',
        'roomImport',
        'catImport',
        'dogImport',
        'furnishedImport',
        'smokingImport',
        'wheelchairImport'
      ],
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
      ],
      // </editor-fold>
      displayAd: {},
      displayAdFromFiltered: {},
      userId: 0,
      // <editor-fold> Comparison
      comparison1: {},
      comparison2: {},
      userFavoritesRaw: [],
      userFavoritesForDisplay: [],
      activePage1: 0,
      activePage2: 0,
      // </editor-fold>
    }
    //<editor-fold> Unused
    // Unused -- modal controls
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.showTips = this.showTips.bind(this);
    //</editor-fold>
    //<editor-fold> Auth
    // Authentication
    this.logOut = this.logOut.bind(this);
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
    //</editor-fold>
    //<editor-fold> HTTP
    // HTTP requests
    this.scrapeList = this.scrapeList.bind(this);
    this.scrapeRows = this.scrapeRows.bind(this);
    this.scrapeNull = this.scrapeNull.bind(this);
    this.getListings = this.getListings.bind(this);
    //</editor-fold>
    //<editor-fold> Listing functions
    this.filterListings = this.filterListings.bind(this)
    //</editor-fold>
    //<editor-fold> Handle changes
    // Handle changes, set state
    this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeState = this.changeState.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleChbox = this.handleChbox.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    // </editor-fold>
  // </editor-fold>
    this.changeView = this.changeView.bind(this);
    this.changeViewFiltered = this.changeViewFiltered.bind(this);
    this.isInFavorites = this.isInFavorites.bind(this)
    this.saveToFavorites = this.saveToFavorites.bind(this)
    this.saveToFavoritesFiltered = this.saveToFavoritesFiltered.bind(this)
    this.createFavoritesForDisplay = this.createFavoritesForDisplay.bind(this)
    this.changeComparisonView = this.changeComparisonView.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.getLoggedIn = this.getLoggedIn.bind(this)
    this.fetchAndFormatFavorites = this.fetchAndFormatFavorites.bind(this)
  }

  // <editor-fold> Unused
  close(){
    this.setState({ showModal: false });
  }

  open(){
    this.setState({ showModal: true });
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

  //</editor-fold>

  // <editor-fold> Auth
  getLoggedIn(){
    axios({
      method: 'get',
      url: '/token',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      this.changeState();

      let userFavoritesRaw = []

      axios({
        method: 'get',
        url: '/users_listings_complete',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        userFavoritesRaw = res.data

        let listings = this.state.listings;

        // let isInFavorites = this.isInFavorites.bind(this);

        let listingsToDisplay = [];

        listingsToDisplay = listings.map((el) => {
          if (el.title.length > 55 && !el.title.indexOf('…')) {
            el.title = humanize(el.title.slice(0, 55) + '…');
          }

          if (el.price && el.price[0] !== '$'){
            el.price = '$' + el.price;
          }

          if (el.title.indexOf(' ') === -1 || (el.title.split(' ').length < 1  && el.title.length > 30)) {
            el.title = el.title.slice(0, 40);
          }

          if (el.neighborhood[0] === '(' && el.neighborhood[el.neighborhood.length - 1] === ')'){
            el.neighborhood = el.neighborhood.slice(1)
            el.neighborhood = el.neighborhood.slice(0, -1)
          }

          el.neighborhood = el.neighborhood.toLowerCase();
          el.neighborhood = titleize(el.neighborhood)
          if (el.neighborhood.length > 14){
            el.neighborhood = el.neighborhood.slice(0, 14) + '…';
          }

          // el.inFavorites = this.isInFavorites(el) //-----------------------------------------------------FIX THIS
          // console.log(el.inFavorites);

          return el;
        });

        let ids                     = [],
            userFavoritesForDisplay = [],
            rawFavorites            = userFavoritesRaw;

        ids = rawFavorites.map((el, idx) => {
          return el.listingsId;
        });

        userFavoritesForDisplay = listingsToDisplay.filter((el) => {
          return ids.indexOf(el.id) !== -1;
        })

        this.setState({listingsToDisplay, userFavoritesRaw, userFavoritesForDisplay, comparison1: userFavoritesForDisplay[0], comparison2: userFavoritesForDisplay[0]});
      }).catch((err) => {
        console.log(err);
      });

    }).catch(err => {
      console.log(err);
      // notify.show(err.response.data, 'error', 3000);
    });

  }

  logOut (e) {
    e.preventDefault();

    axios({
      method: 'delete',
      url: '/token',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
      // notify.show('Logged Out!', 'success', 3000);
    }).catch(err => {
      console.log(err);
      // notify.show(err.response.data, 'error', 3000);
    });
    this.changeState();
  }

  changeState() {
    const bool = this.state.loggedIn;
    if (bool) {
      this.setState({ loggedIn: false });
    } else {
      this.setState({ loggedIn: true });
    }
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
    }).then((res) => {
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
      }).then((res) => {
        this.setState({signUpEmail: '', signUpPassword: ''});
        this.changeState();
        console.log('Logged In!', 'success', 3000);
      }).catch((err) => {
        console.log(err);
      });
      console.log('Logged In!', 'success', 3000);
      console.log(`success!`);
    }).catch((err) => {
      console.log(err);
    });
  }

  logIn(e) {
    e.preventDefault();

    let userFavoritesRaw = [];

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
      this.changeState();

      axios({
        method: 'get',
        url: '/users_listings_complete',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        userFavoritesRaw = res.data

        let listings = this.state.listings;

        // let isInFavorites = this.isInFavorites.bind(this);

        let listingsToDisplay = [];

        listingsToDisplay = listings.map((el) => {
          if (el.title.length > 55 && !el.title.indexOf('…')) {
            el.title = humanize(el.title.slice(0, 55) + '…');
          }

          if (el.price && el.price[0] !== '$'){
            el.price = '$' + el.price;
          }

          if (el.title.indexOf(' ') === -1 || (el.title.split(' ').length < 1  && el.title.length > 30)) {
            el.title = el.title.slice(0, 40);
          }

          if (el.neighborhood[0] === '(' && el.neighborhood[el.neighborhood.length - 1] === ')'){
            el.neighborhood = el.neighborhood.slice(1)
            el.neighborhood = el.neighborhood.slice(0, -1)
          }

          el.neighborhood = el.neighborhood.toLowerCase();
          el.neighborhood = titleize(el.neighborhood)
          if (el.neighborhood.length > 14){
            el.neighborhood = el.neighborhood.slice(0, 14) + '…';
          }

          return el;
        });

        let ids                     = [],
            userFavoritesForDisplay = [],
            rawFavorites            = userFavoritesRaw;

        console.log(rawFavorites);

        ids = rawFavorites.map((el, idx) => {
          return el.listingsId;
        });

        console.log(ids);

        userFavoritesForDisplay = listingsToDisplay.filter((el) => {
          return ids.indexOf(el.id) !== -1;
        })

        console.log(userFavoritesForDisplay);
        console.log(listingsToDisplay);
        console.log(userFavoritesRaw);
        console.log(userFavoritesForDisplay[0]);
        console.log(userFavoritesForDisplay[0]);
        this.setState({listingsToDisplay, userFavoritesRaw, userFavoritesForDisplay, comparison1: userFavoritesForDisplay[0], comparison2: userFavoritesForDisplay[0], email: '', password: ''});
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
      // notify.show(err.response.data, 'error', 3000);
    });
  }
  //</editor-fold>

  // <editor-fold> handle changes
  handleSlider (field, e) {
    var nextState = {}
    nextState[field] = e.value
    this.setState(nextState)
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

  handleChange(e) {
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  }

  //</editor-fold>

  // <editor-fold> HTTP
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
      let markers = [];

      markers = listings.filter((el) => {
        return el.lat && el.lon;
      });


      this.setState({listings, markers});
    }).then(() => {
    }).catch((err) => {
      // console.log(err);
    })
  }

  changeView(row) {
    axios({
      method: 'get',
      url: `/listings/${row.id}`
    }).then((res) => {
      this.setState({displayAd: res.data})
    }).catch((err) => {
      //
    });
  }

  changeViewFiltered(row) {
    axios({
      method: 'get',
      url: `/listings/${row.id}`
    }).then((res) => {
      this.setState({displayAdFromFiltered: res.data})
    }).catch((err) => {
      //
    });
  }

  saveToFavorites(){
    axios({
      method: 'post',
      url: `/users_listings/`,
      data: {
        listingsId: this.state.displayAd.id
      }
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }

  saveToFavoritesFiltered(){
    axios({
      method: 'post',
      url: `/users_listings/`,
      data: {
        listingsId: this.state.displayAdFromFiltered.id
      }
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }
  // </editor-fold>

  // <editor-fold> Listing functions
  filterListings(){
    let maxScore = 0;
    let filteredOptions = [];
    let filteredList = [];
    let filteredListingsToDisplay = [];

    maxScore = this.state.importTypes.reduce((acc, pref, idx) => {
      return acc + this.props[pref];
    }, 0);

    filteredOptions = this.state.optionArrays.map((type) => {
      return type.filter((option) => {
        return this.state[option]
      })
    });

    this.setState({maxScore})
    this.setState({filteredOptions})

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
        let rent = el.price.slice(1);

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


    filteredListingsToDisplay = filteredList.map((el) => {
      if (el.title.length > 55 && !el.title.indexOf('…')) {
        el.title = humanize(el.title.slice(0, 55) + '…');
      }

      if (el.price && el.price[0] !== '$'){
        el.price = '$' + el.price;
      }

      if (el.title.indexOf(' ') === -1 || (el.title.split(' ').length < 1  && el.title.length > 30)) {
        el.title = el.title.slice(0, 40);
      }

      if (el.neighborhood[0] === '(' && el.neighborhood[el.neighborhood.length - 1] === ')'){
        el.neighborhood = el.neighborhood.slice(1)
        el.neighborhood = el.neighborhood.slice(0, -1)
      }

      el.neighborhood = el.neighborhood.toLowerCase();
      el.neighborhood = titleize(el.neighborhood)
      if (el.neighborhood.length > 14){
        el.neighborhood = el.neighborhood.slice(0, 14) + '…';
      }

      // el.inFavorites = this.isInFavorites(el) ----------------------------------------------------------FIX

      return el;
    });

    this.setState({filteredListingsToDisplay});
  }
  // </editor-fold>

  isInFavorites(row){
    axios({
      method: 'get',
      url: `/users_listings/${row.id}`
    }).then((res) => {
      if (res.data.length > 0){
        return true
      } else {
        return false
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  createFavoritesForDisplay(){
    let ids                     = [],
        userFavoritesForDisplay = [],
        ld                      = this.state.listingsToDisplay,
        rawFavorites            = this.state.userFavoritesRaw;

    console.log(rawFavorites);

    ids = rawFavorites.map((el, idx) => {
      return el.listingsId;
    });

    console.log(ids);

    userFavoritesForDisplay = ld.filter((el) => {
      return ids.indexOf(el.id) !== -1;
    })

    console.log(userFavoritesForDisplay);

    this.setState({userFavoritesForDisplay, comparison1: userFavoritesForDisplay[0], comparison2: userFavoritesForDisplay[0]});
  }

  changeComparisonView(element){
    this.setState(element);
  }

  // handleSelect1(eventKey){
  //   this.setState({activePage1: eventKey, comparison1: this.state.userFavoritesForDisplay[eventKey]});
  // }
  //
  // handleSelect2(eventKey){
  //   this.setState({activePage2: eventKey, comparison2: this.state.userFavoritesForDisplay[eventKey]});
  // }

  pageChange(activePageName, activePageNumber, comparisonPageName){
    let change = {}
    let change1 = {}
    change[activePageName] = activePageNumber;

    change1[comparisonPageName] = this.state.userFavoritesForDisplay[activePageNumber]

    console.log(change);
    console.log(change1);
    this.setState(change);
    this.setState(change1);
  }

  fetchAndFormatFavorites(){
    axios({
      method: 'get',
      url: '/users_listings_complete',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      userFavoritesRaw = res.data

      let listings = this.props.listings;

      // let isInFavorites = this.isInFavorites.bind(this);

      let listingsToDisplay = [];

      listingsToDisplay = listings.map((el) => {
        if (el.title.length > 55 && !el.title.indexOf('…')) {
          el.title = humanize(el.title.slice(0, 55) + '…');
        }

        if (el.price && el.price[0] !== '$'){
          el.price = '$' + el.price;
        }

        if (el.title.indexOf(' ') === -1 || (el.title.split(' ').length < 1  && el.title.length > 30)) {
          el.title = el.title.slice(0, 40);
        }

        if (el.neighborhood[0] === '(' && el.neighborhood[el.neighborhood.length - 1] === ')'){
          el.neighborhood = el.neighborhood.slice(1)
          el.neighborhood = el.neighborhood.slice(0, -1)
        }

        el.neighborhood = el.neighborhood.toLowerCase();
        el.neighborhood = titleize(el.neighborhood)
        if (el.neighborhood.length > 14){
          el.neighborhood = el.neighborhood.slice(0, 14) + '…';
        }

        return el;
      });

      let userFavoritesForDisplay = [];
      let ids                     = [],
          rawFavorites            = userFavoritesRaw;

      console.log(rawFavorites);

      ids = rawFavorites.map((el, idx) => {
        return el.listingsId;
      });

      console.log(ids);

      userFavoritesForDisplay = listingsToDisplay.filter((el) => {
        return ids.indexOf(el.id) !== -1;
      })

      console.log(userFavoritesForDisplay);
      console.log(listingsToDisplay);
      console.log(userFavoritesRaw);
      console.log(userFavoritesForDisplay[0]);
      console.log(userFavoritesForDisplay[0]);
      this.setState({listingsToDisplay, userFavoritesRaw, userFavoritesForDisplay, comparison1: userFavoritesForDisplay[0], comparison2: userFavoritesForDisplay[0]});
    }).catch((err) => {
      console.log(err);
    });
  }

  componentWillMount(){
    this.getListings();
    this.getLoggedIn();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Grid fluid style={{minWidth: '1000px'}}>
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
                <Routing
                  createFavoritesForDisplay={this.createFavoritesForDisplay}
                  getListings={this.getListings}
                  {...this.props}
                  {...this.state}
                  {...this}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </BrowserRouter>
    )
  }
};