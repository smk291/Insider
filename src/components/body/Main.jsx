import { Match, Miss } from 'react-router'
import NotFound from '../planets/NotFound'
import React, { Component } from 'react'
import SignUp from './SignUp'
import Login from './Login'
import Main2 from './Main2'
import MapPage from './MapPage'
import Tables from  './Tables'
import Search from './Search'
import Listings from './Listings'

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
        <Match pattern="/" exactly render={() => <Main2
          {...this.props}
        />} />
        <Match pattern="/search" render={() => <Search
          {...this.props}
        />} />
        <Match pattern="/list" render={() => <Listings
          {...this.props}
          getListings = {this.props.getListings}
        />} />
        <Match pattern="/map" render={() => <MapPage
          {...this.props}
        />} />
        <Match pattern="/tables" render={() => <Tables
          {...this.props}
        />} />
        <Miss component={NotFound} />
      </main>
    )
  }
};