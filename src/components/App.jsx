//<editor-fold import
import React, {Component} from 'react';
import {BrowserRouter, Route, browserHistory} from 'react-router';
import {
  Button,
  Grid,
  Jumbotron,
  Row,
  Col,
  Popover,
  Tooltip,
  Modal
} from 'react-bootstrap';
// import Footer from './footer/Footer'
import Routing from './body/Routing'
import Login from './body/auth/Login'
import 'bootstrap/less/bootstrap.less'
import axios from 'axios';
import Header from './header/Header';
import globalCSS from '../../globalCSS.css'
import request from 'request'
import titleize from 'underscore.string/titleize'
import humanize from 'underscore.string/humanize'
//</editor-fold>

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // <editor-fold> Auth
      loggedIn: false,
      signingUp: false,
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      // </editor-fold>
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
      // </editor-fold>
      // <editor-fold> State of listings
      listings: [],
      markers: [],
      filteredList: [],
      filteredOptions: [],
      listingsToDisplay: [],
      filteredListingsToDisplay: [],
      displayAd: {},
      displayAdFromFiltered: {},
      userId: 0,
      // </editor-fold>
      // <editor-fold> Comparison
      comparison1: {},
      comparison2: {},
      userFavoritesRaw: [],
      userFavoritesForDisplay: [],
      activePage1: 0,
      activePage2: 0,
      score: '',
      rentAvg: '',
      rent0brAvg: '',
      rent1brAvg: '',
      rent2brAvg: '',
      rent3brAvg: '',
      rent4brAvg: '',
      strictMode: false,
      maxScore: [],
      // </editor-fold>
    }
    //<editor-fold> Unused
    // Unused -- modal controls
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.showTips = this.showTips.bind(this);
    //</editor-fold>
    //<editor-fold> Auth
    this.getLoggedIn = this.getLoggedIn.bind(this)
    this.authSwitch = this.authSwitch.bind(this);
    this.processAuth = this.processAuth.bind(this);
    //</editor-fold>
    //<editor-fold> HTTP
    this.scrapeList = this.scrapeList.bind(this);
    this.scrapeRows = this.scrapeRows.bind(this);
    this.scrapeNull = this.scrapeNull.bind(this);
    this.getListings = this.getListings.bind(this);
    this.checkFor404 = this.checkFor404.bind(this)
    this.fetchAndFormatFavorites = this.fetchAndFormatFavorites.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.saveToFavorites = this.saveToFavorites.bind(this)
    this.saveToFavoritesFiltered = this.saveToFavoritesFiltered.bind(this)
    this.changeView = this.changeView.bind(this);
    this.changeViewFiltered = this.changeViewFiltered.bind(this);
    this.isInFavorites = this.isInFavorites.bind(this)
    //</editor-fold>
    //<editor-fold> Listing functions
    this.filterListings = this.filterListings.bind(this)
    this.convertListings = this.convertListings.bind(this);
    this.formatListing = this.formatListing.bind(this);
    this.createFavoritesForDisplay = this.createFavoritesForDisplay.bind(this)
    //</editor-fold>
    //<editor-fold> Handle changes
    // Handle changes, set state
    this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeState = this.changeState.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleChbox = this.handleChbox.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.changeComparisonView = this.changeComparisonView.bind(this)
    // </editor-fold>
  }

  // <editor-fold> Unused
  close() {
    this.setState({showModal: false});
  }

  open() {
    this.setState({showModal: true});
  }

  showTips(e) {
    e.preventDefault();

    const bool = this.state.activeTips;
    if (bool) {
      this.setState({loggedIn: true});
    } else {
      this.setState({loggedIn: false});
    }
  }

  //</editor-fold>

  formatListing(rawListing) {
    const fL = rawListing;

    if (fL.title.length > 50) {
      fL.title = humanize(fL.title.slice(0, 50) + '…');
    } else {
      fL.title = humanize(fL.title);
    }

    if (fL.price && fL.price[0] !== '$') {
      fL.price = '$' + fL.price;
    }

    if (fL.title.indexOf(' ') === -1 || (fL.title.split(' ').length < 4 && fL.title.length > 30)) {
      fL.title = fL.title.slice(0, 40);
    }

    if (fL.neighborhood[0] === '(' && fL.neighborhood[fL.neighborhood.length - 1] === ')') {
      fL.neighborhood = fL.neighborhood.slice(1)
      fL.neighborhood = fL.neighborhood.slice(0, -1)
    }

    fL.neighborhood = fL.neighborhood.toLowerCase();
    fL.neighborhood = titleize(fL.neighborhood)

    if (fL.neighborhood.length > 14) {
      fL.neighborhood = fL.neighborhood.slice(0, 14) + '…';
    }

    return fL;
  }

  convertListings() {
    axios({
      method: 'get',
      url: '/users_listings_complete',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      let userFavoritesRaw = res.data;
      let listings = this.state.listings;

      // let isInFavorites = this.isInFavorites.bind(this);

      let listingsToDisplay = [];

      listingsToDisplay = listings.map((el) => {
        return this.formatListing(el);
      });

      let ids = [],
        userFavoritesForDisplay = [],
        rawFavorites = userFavoritesRaw;

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
  }

  // <editor-fold> Auth
  getLoggedIn() {
    axios({
      method: 'get',
      url: '/token',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      let loggedIn = res.data;

      this.setState({auth: loggedIn})

      // axios({method: 'get', url: `/listings`}).then((res) => {
      //   let listings = res.data;
      //   let markers = [];
      //
      //   listings = listings.filter((listing) => {
      //     return listing.void !== true;
      //   })
      //
      //   markers = listings.filter((el) => {
      //     return el.lat && el.lon;
      //   });
      //
      //   this.setState({listings, markers});
      //   this.convertListings();
      // }).then(() => {
      //   this.setState({loggedIn});
      // }).catch(err => {
      //   console.log(err);
        // notify.show(err.response.data, 'error', 3000);
      // });
    }).catch((err) => {
      // console.log(err);
    })
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
        this.convertListings();
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
        }
      }).then((res) => {
        logIn(email, password)
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
      this.getListings();
    } else {
      logIn();
      this.getListings();
    }
  }
  //</editor-fold>

  // <editor-fold> handle changes
  handleSlider(field, e) {
    var nextState = {}
    nextState[field] = e.value
    this.setState(nextState)
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

  handleChange(e) {
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  }

  handleChangeLogin(e) {
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState({auth: {login: change}});
  }

  changeComparisonView(element) {
    this.setState(element);
  }
  //</editor-fold>

  // <editor-fold> HTTP
  scrapeNull(e) {
    e.preventDefault();

    axios({method: 'get', url: '/scrape_null'}).then((res) => {}).catch((err) => {});
  }

  scrapeList(e) {
    e.preventDefault();

    axios({method: 'get', url: '/scrape_list/seattle'}).then((res) => {
      this.setState({list: res.data});
    }).catch((err) => {
      // notify.show(err.response.data.errors[0].messages[0], 'error', 3000);
    });
  }

  scrapeRows(e) {
    let details = [];

    this.state.list.map((el) => {
      if (el.urlnum) {
        axios({method: 'get', url: `/scrape_details/${el.urlnum}`}).then((res) => {
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

  checkFor404(){
    axios({method: 'get', url: `/listings_check_for_404`}).then((res) => {
      // console.log(res.data);
      let listings = res.data

      axios({
        method: 'post',
        url: `/scrape_check_for_404`,
        data: {
          listings: listings
        },
        'Content-Type': 'applicaton/json'
      }).then((res) => {
        // console.log(res);
      }).catch((err) => {
        console.log(`Err here: ${err}`);
      });
    }).catch((err) => {
      console.log(err);
    })
  }

  getListings() {
    axios({method: 'get', url: `/listings`}).then((res) => {
      let listings = res.data;
      let markers = [];

      listings = listings.filter((listing) => {
        return listing.void !== true;
      })

      console.log(listings);

      markers = listings.filter((el) => {
        return el.lat && el.lon;
      });

      this.setState({listings, markers});
    }).then(() => {}).catch((err) => {
      // console.log(err);
    })
  }

  changeView(row) {
    axios({method: 'get', url: `/listings/${row.id}`}).then((res) => {
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

  saveToFavorites() {
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
  // </editor-fold>

  // <editor-fold> Listing and filtering functions

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
        let brs = Number(el.bedrooms.slice(0, el.bedrooms.indexOf('BR')));

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
        let rent = el.price.slice(1);

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

  createFavoritesForDisplay() {
    let ids = [],
    userFavoritesForDisplay = [],
    ld = this.state.listingsToDisplay,
    rawFavorites = this.state.userFavoritesRaw;

    ids = rawFavorites.map((el, idx) => {
      return el.listingsId;
    });

    userFavoritesForDisplay = ld.filter((el) => {
      return ids.indexOf(el.id) !== -1;
    })

    this.setState({userFavoritesForDisplay, comparison1: userFavoritesForDisplay[0], comparison2: userFavoritesForDisplay[0]});
  }

  pageChange(activePageName, activePageNumber, comparisonPageName) {
    let change = {}
    let change1 = {}
    change[activePageName] = activePageNumber;

    change1[comparisonPageName] = this.state.userFavoritesForDisplay[activePageNumber]

    this.setState(change);
    this.setState(change1);
  }

  fetchAndFormatFavorites() {
    this.convertListings();
  }

  // </editor-fold>

  componentWillMount() {
    this.getLoggedIn();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Grid fluid style={{
            minWidth: '1000px'
          }}>
            <Row style={{
              minWidth: '1000px'
            }}>
              <Col>
                <Header style={{
                  height: '50px'
                }} {...this.props} {...this.state} {...this}/>
              </Col>
            </Row>
            <Row style={{
              minWidth: '1000px'
            }}>
              <Col>
                {!this.state.loggedIn ?
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
                  />:
                  <Routing
                    {...this.props}
                    {...this.state}
                    {...this}
                  />}
              </Col>
            </Row>
          </Grid>
        </div>
      </BrowserRouter>
    )
  }
};