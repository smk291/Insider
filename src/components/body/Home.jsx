// <editor-fold import
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  NavLink, 
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import { Navbar, Nav, Button, Grid, Jumbotron, Row, Col, Popover, Tooltip, Modal } from 'react-bootstrap'
import primary from './primary.css'
import InlineSVG from 'svg-inline-react'
import MdSearch from 'react-icons/lib/md/search'
import MdCompare from 'react-icons/lib/md/compare'
import MdMap from 'react-icons/lib/md/map'
import Login from './Login'
import Header from '../header/Header'
import header from '../header/header.css';
import MdHome from 'react-icons/lib/md/home'
import MdHelp from 'react-icons/lib/md/help'
import MdViewList from 'react-icons/lib/md/view-list'

// </editor-fold>

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.scrape = this.scrape.bind(this);
    this.checkFor404 = this.checkFor404.bind(this);
  }

  //<editor-fold HTTP and list
  scrape() {
    this.props.scrape();
  }

  checkFor404() {
    this.props.checkFor404();
  }

  render() {
    return (
      <div>
        <p>hi - Home</p>
        <p>{JSON.stringify(this.props)}</p>
      </div>
    );
  }
}