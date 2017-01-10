import { Match, Miss } from 'react-router'
import NotFound from './NotFound'
import React, { Component } from 'react'
import Login from './auth/Login'
import Home from './Home'
import MapPage from './mapping/MapPage'
import Compare from  './Compare'
import ViewAndFilter from './ViewAndFilter'

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
          createFavoritesForDisplay={this.props.createFavoritesForDisplay}
          {...this.props}
        />} />
        <Match pattern="/data" render={() => <ViewAndFilter
          {...this.props}
        />} />
        <Match pattern="/map" render={() => <MapPage
          {...this.props}
        />} />
        <Match pattern="/compare" render={() => <Compare
          handleSelect1={this.props.handleSelect1}
          handleSelect2={this.props.handleSelect2}
          {...this.props}
        />} />
        <Miss component={NotFound} />
      </main>
    )
  }
};