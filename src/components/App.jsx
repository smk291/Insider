import React, { PropTypes } from 'react'
import { browserHistory } from 'react-router'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import {Button, Grid, Jumbotron, Row, Col, Popover, Tooltip, Modal} from 'react-bootstrap';
import 'bootstrap/less/bootstrap.less'
import axios from 'axios';
import Header from './header/Header';
import globalCSS from '../../globalCSS.css'
import request from 'request'
import titleize from 'underscore.string/titleize'
import humanize from 'underscore.string/humanize'

import Login from './body/Login'
import Home from './body/Home'
import ViewAndFilter from './body/ViewAndFilter'
import Compare from './body/Compare'
import MapPage from './body/MapPage'

class AbstractedRouting extends React.Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }

  logOut(){
    this.props.logOut();
  }

  render(){
    return (
      <ul>
        <div><li><Link to="/">Home</Link></li>
        <li><Link to="/ViewAndFilter">ViewAndFilter</Link></li>
        <li><Link to="/compare">Compare</Link></li>
        <li><a href="#" onClick={this.logOut}>Log Out</a></li></div>
      </ul>
    )
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      signingUp: false,
      searchParams: {
        bedrooms: {
          data: {},
          options: {
            minBedrooms: '',
            maxBedrooms: '',
          },
          prefs: {
            importance: '',
            required: false,
          }
        },
        rent: {
          data: {},
          options: {
            minRent: '',
            maxRent: '',
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
        housing: {
          data: {},
          options: {
            apartment: true,
            condo: true,
            house: true,
            townhouse: true,
            duplex: true,
            land: true,
            'in-law': true,
            cottage: true,
            cabin: true,
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
        laundry: {
          data: {},
          options: {
            'laundry on site': true,
            'w/d in unit': true,
            'laundry in bldg': true,
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
        parking: {
          data: {},
          options: {
            'off-street parking': true,
            'detached garage': true,
            'attached garage': true,
            'valet parking': true,
            'street parking': true,
            'carport': true,
            'no parking': true,
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
        bath: {
          data: {},
          options: {
            'private bath': true,
            'no private bath': true,
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
        private: {
          data: {},
          options: {
            'private room': true,
            'room not private': true,
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
        cat: {
          data: {},
          options: {
            'cats are OK - purrr': true,
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
        dog: {
          data: {},
          options: {
            'dogs are OK - wooof': true,
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
        furnished: {
          data: {},
          options: {
            'furnished': true,
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
        smoking: {
          data: {},
          options: {
            'no smoking': true,
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
        wheelchair: {
          data: {},
          options: {
            'wheelchair accessible': true,
          },
          prefs: {
            importance: '',
            required: false,
          },
        },
      },
      listings: [],
      markers: [],
      filteredList: [],
      filteredOptions: [],
      filteredListingsToDisplay: [],
      displayAd: {},
      displayAdFromFiltered: {},
      comparison1: {},
      comparison2: {},
      userFavorites: [],
      activePage1: 0,
      activePage2: 1,
      maxScore: [],
      addedFavorite: false,
    }
    //Auth
    this.changeState = this.changeState.bind(this);
    this.getLoggedIn = this.getLoggedIn.bind(this)
    this.authSwitch = this.authSwitch.bind(this);
    this.processAuth = this.processAuth.bind(this);
    this.logOut = this.logOut.bind(this);
    //Scraping
    this.scrape = this.scrape.bind(this);
    //Handle changes
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleChbox = this.handleChbox.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    //Listings
    this.getListings = this.getListings.bind(this);
    this.filterListings = this.filterListings.bind(this)
    //Favorites
    this.getFavorites = this.getFavorites.bind(this)
    this.checkForAddedFavorite = this.checkForAddedFavorite.bind(this)
    this.saveToFavorites = this.saveToFavorites.bind(this)
    this.saveToFavoritesFiltered = this.saveToFavoritesFiltered.bind(this)
    this.isInFavorites = this.isInFavorites.bind(this)
    //Change views
    this.changeComparisonView = this.changeComparisonView.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.changeView = this.changeView.bind(this);
    this.changeViewFiltered = this.changeViewFiltered.bind(this);
  }

  //Auth
  logOut() {
    axios({
      method: 'delete',
      url: '/token',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      this.changeState('loggedIn');
      this.setState({listings: {}});
      // notify.show('Logged Out!', 'success', 3000);
    }).catch(err => {
      // notify.show(err.response.data, 'error', 3000);
    });
  }

  changeState(standIn) {
    let change = {};
    change[standIn] = !this.state[standIn];

    if (this.state[standIn]) {
      this.setState(change);
    } else {
      this.setState(change);
    }
  }

  getLoggedIn() {
    axios({
      method: 'get',
      url: '/token',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
      let loggedIn = res.data;
      this.setState({loggedIn});
      this.getListings();
    }).catch((err) => {
      // console.log(err);
    })
  }

  authSwitch() {
    this.changeState('signingUp');
  }

  processAuth(e) {
    e.preventDefault();

    const logIn = () => {
      axios({
        method: 'post',
        url: '/token',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          email: this.state.email,
          password: this.state.password,
        },
      }).then((res) => {
        this.setState({email: '', password: ''});
        this.changeState('loggedIn');
        this.getListings()
        // this.convertListings();
      }).catch((err) => {
        // notify.show(err.response.data, 'error', 3000);
      });
    }

    const signUp = () => {
      axios({
        method: 'post',
        url: '/users',
        data: {
          email: this.state.email,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        logIn()
      }).catch((err) => {
        // Well..?
      });
    }

    const logOut = () => {
      axios({
        method: 'delete',
        url: '/token',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        this.changeState('loggedIn');
        this.setState({listings: {}});
        // notify.show('Logged Out!', 'success', 3000);
      }).catch(err => {
        // notify.show(err.response.data, 'error', 3000);
      });
    }

    if (this.state.loggedIn){
      logOut();
    } else if (this.state.signingUp) {
      signUp();
      logIn();
      // this.getListings();
      // this.createFavoritesForDisplay();
    } else {
      logIn();
      // this.getListings();
      // this.convertListings();
      // this.createFavoritesForDisplay();
    }
  }

  //Scraping
  scrape() {
    axios({
      method: 'get',
      url: `/scrape/Seattle`
    }).then((res) => {
      let data = res.data

      // console.log(data);
    }).catch((err) => {
      // console.log(err);
    })
  }
  //Handle changes
  handleChange(e) {
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  }

  handleCheckbox(e) {
    let change = {}
    change[e.target.name] = e.target.checked;
    this.setState({change})
  }

  handleChbox(field, e) {
    var nextState = {}
    nextState[field] = e.target.checked
    this.setState(nextState)
  }

  handleSlider(field, e) {
    var nextState = {}
    nextState[field] = e.value
    this.setState(nextState)
  }

  //Listings
  getListings() {
    axios({
      method: 'get',
      url: '/users_listings',
    }).then((res) => {
      let userFavorites = res.data,
          listings = [],
          ids = [];

      ids = userFavorites.map((el, idx) => {
        return el.listingsId;
      });

      axios({method: 'get', url: `/listings`}).then((res) => {
        let markers = [];

        listings = res.data.filter((listing) => listing.void !== true);
        markers = listings.map((el) => {
          if (el.lat !== null && el.lon !== null) {
            return {
              id: el.id,
              lat: el.lat,
              lon: el.lon
            };
          }
        });

        let comparison1 = {},
            comparison2 = {},
            activePage1,
            activePage2;

        if (userFavorites.length > 1){
          comparison1 = userFavorites[0];
          comparison2 = userFavorites[1];
          activePage1 = 0,
          activePage2 = 1;
        } else if (userFavorites.length === 1) {
          comparison1 = userFavorites[0];
          comparison2 = userFavorites[0];
          activePage1 = 0;
          activePage2 = 0;
        }

        this.setState({
          listings,
          markers,
          userFavorites,
          comparison1,
          comparison2,
          activePage1,
          activePage2
        });
      }).then(() => {
        this.setState({displayAd: this.state.listings[0]});
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  filterListings() {
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

      if (el.bedrooms) {
        let minBed = Number(this.state.minBedrooms);
        let maxBed = Number(this.state.maxBedrooms);

        if (brs >= minBed && brs <= maxBed) {
          el.score += Number(this.state.bedroomsImport);
        } else if (this.state.bedroomsImportRequired) {
          return false;
        }
      } else if (this.state.bedroomsImportRequired) {
        return false;
      }

      if (el.price) {
        let minRent = Number(this.state.minRent);
        let maxRent = Number(this.state.maxRent);

        if (rent >= minRent && rent <= maxRent) {
          el.score += Number(this.state.rentImport);
        } else if (this.state.rentImportRequired) {
          return false;
        }
      } else if (this.state.rentImportRequired) {
        return false;
      }

      for (let i = 2; i < this.state.typesAndPrefs[0].length; i++) {
        let value = el[this.state.types[i]];
        let filteredTypeOptions = filteredOptions[i];
        let importance = this.state[this.state.importTypes[i]]
        let requiredBool = this.state[this.state.requiredTypes[i]]

        if (value !== null) {
          if (filteredTypeOptions.indexOf(value) !== -1) {
            el.score += Number(importance);
          } else if (requiredBool) {
            return false
          }
        } else if (requiredBool) {
          return false
        }
      }

      return true
    });

    this.setState({filteredList})

    filteredListingsToDisplay = filteredList.map((el) => {
      return this.formatListing(el);
    });

    filteredListingsToDisplay = filteredListingsToDisplay.sort((a, b) => {
      return b['urlnum'] - a['urlnum'];
    })

    filteredListingsToDisplay = filteredListingsToDisplay.sort((a, b) => {
      return b['score'] - a['score'];
    })

    this.setState({filteredListingsToDisplay});
  }

  //Favorites
  getFavorites() {
    axios({
      method: 'get',
      url: '/users_listings',
    }).then((res) => {
      let userFavorites = res.data;

      this.setState({
        userFavorites,
        comparison1: userFavorites[0],
        comparison2: userFavorites[0]
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  checkForAddedFavorite() {
    if (this.state.addedFavorite) {
      this.getFavorites();
      this.setState({addedFavorite: false});
    }
  }

  saveToFavorites() {
    axios({
      method: 'post',
      url: `/users_listings/`,
      data: {
        listingsId: this.state.displayAd.id
      }
    }).then((res) => {
      this.setState({addedFavorite: true})
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }

  saveToFavoritesFiltered() {
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

  isInFavorites(row) {
    axios({method: 'get', url: `/users_listings/${row.id}`}).then((res) => {
      if (res.data.length > 0) {
        return true
      } else {
        return false
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  //Change view
  changeComparisonView(element) {
    this.setState(element);
  }

  pageChange(activePageName, activePageNumber, comparisonPageName) {
    let change = {}
    let change1 = {}
    change[activePageName] = activePageNumber;

    change1[comparisonPageName] = this.state.userFavorites[activePageNumber]

    this.setState(change);
    this.setState(change1);
  }

  changeView(row) {
    axios({method: 'get', url: `/listings_individual/${row.id}`}).then((res) => {
      this.setState({displayAd: res.data})
    }).catch((err) => {
      //
    });
  }

  changeViewFiltered(row) {
    axios({method: 'get', url: `/listings/${row.id}`}).then((res) => {
      let displayAdFromFiltered = res.data;
      displayAdFromFiltered.score = row.score;
      this.setState({displayAdFromFiltered})
    }).catch((err) => {
      //
    });
  }

  componentWillMount() {
    this.getLoggedIn();
  }

  render() {

    if (!this.state.loggedIn) {
      return (
        <div>
          <Login 
            handleChange={this.handleChange} 
            processAuth={this.processAuth} 
            authSwitch={this.authSwitch} 
            loggedIn={this.state.loggedIn} 
            signingUp={this.state.signingUp} 
            email={this.state.email} 
            password={this.state.password} 
            firstName={this.state.firstName} 
            lastName={this.state.lastName}
          />
        </div>
      )
    }

    return (
      <Router>
        <div>
          <AbstractedRouting {...this.state} logOut={this.logOut}/>

          <hr/>

          <Route exact path="/" render={()=> <Home {...this.state}/>}/>
          <Route path="/ViewAndFilter" render={()=> <ViewAndFilter  
            searchParams={this.state.searchParams}
            changeView={this.changeView}
            displayAd={this.state.displayAd}
            listings={this.state.listings}
            saveToFavorites={this.saveToFavorites}
            filterListings={this.filterListings}
            loggedin={this.state.loggedIn}
            changeViewFiltered={this.changeViewFiltered}
            displayAdFromFiltered={this.displayAdFromFiltered}
            filteredListingsToDisplay={this.filteredListingsToDisplay}
            saveToFavoritesFiltered={this.saveToFavoritesFiltered}
            pageChange={this.pageChange}
            />}
          />
          <Route path="/compare" render={()=> <Compare 
            checkForAddedFavorite={this.checkForAddedFavorite}
            userFavorites={this.state.userFavorites}
            pageChange={this.pageChange}
            comparison1={this.state.comparison1}
            comparison2={this.state.comparison2}
            activePage1={this.state.activePage1}
            activePage2={this.state.activePage2 }
            />}
          />
        </div>
      </Router>
    )
  }
}
