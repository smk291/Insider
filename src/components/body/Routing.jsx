import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import { Match, Miss } from 'react-router'
import NotFound from './NotFound'
import React, { Component } from 'react'
import Login from './auth/Login'
import Home from './Home'
import MapPage from './MapPage'
import Compare from  './Compare'
import ViewAndFilter from './ViewAndFilter'

export default class Main extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const routes = [
      {path: '/login',
      exact: true,


      }
    ]

    return (
      <Router className="page-wrap">
        <div>
          {/* <Match pattern="/login" render={() => <Login {...this.props}/>} /> */}
          <Route pattern="/home" exact render={() => <Home {...this.props}/>} />
          <Route pattern="/viewandfilter" exact render={() => <ViewAndFilter {...this.props}/>} />
          <Route pattern="/map" render={() => <MapPage {...this.props} />} />
          <Route pattern="/compare" render={() => <Compare {...this.props} />} />
          {/*<Miss component={NotFound} />*/}
        </div>
      </Router>
    )
  }
};