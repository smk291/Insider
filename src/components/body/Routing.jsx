import { Match, Miss } from 'react-router'
import NotFound from '../planets/NotFound'
import React, { Component } from 'react'
import Login from './auth/Login'
import Home from './Home'
import MapPage from './mapping/MapPage'
import Compare from  './Compare'
import Search from './Search'
// import Listings from './Listings'

export default class Main extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <main className="page-wrap">
        <Match pattern="/login" render={() => <Login
          {...this.props}
        />} />
        <Match pattern="/" exactly render={() => <Home
          {...this.props}
        />} />
        <Match pattern="/search" render={() => <Search
          {...this.props}
        />} />
        <Match pattern="/map" render={() => <MapPage
          {...this.props}
        />} />
        <Match pattern="/tables" render={() => <Compare
          {...this.props}
        />} />
        <Miss component={NotFound} />
      </main>
    )
  }
};