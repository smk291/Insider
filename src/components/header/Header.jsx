// <editor-fold> import
import { Link, NavLink } from 'react-router-dom'
import React from 'react'
import {Nav, Navbar, Tooltip, OverlayTrigger} from 'react-bootstrap'
import Login from '../body/Login'
import header from './header.css'
import InlineSVG from 'svg-inline-react'
import MdHome from 'react-icons/lib/md/home'
import MdHelp from 'react-icons/lib/md/help'
import MdSearch from 'react-icons/lib/md/search'
import MdViewList from 'react-icons/lib/md/view-list'
import MdMap from 'react-icons/lib/md/map'
import MdCompare from 'react-icons/lib/md/compare'
// </editor-fold>

export default class Header extends React.Component {
  // <editor-fold> constructor/props and functions
  constructor(props) {
    super(props);
    this.processAuth = this.processAuth.bind(this);
  }

  processAuth(e) {
    this.props.processAuth(e);
  }
  // </editor-fold>

  render() {
    return (
      <header>
        <Navbar className={header.navbar} fluid style={{
          height: '50px',
          borderRadius: '0px'
        }}>
          {this.props.loggedIn
            ? (
              <Nav pullLeft>
                <NavLink exact className={header.navButton} activeClassName={header.active} to='/home'> <MdHome/> </NavLink>
                <NavLink exact className={header.navButton} activeClassName={header.active} to='/viewandfilter'><MdSearch/> View and filter housing data</NavLink>
                <NavLink exact className={header.navButton} activeClassName={header.active} to='/map'><MdMap/> Use map</NavLink>
                <NavLink exact className={header.navButton} activeClassName={header.active} to='/compare'><MdCompare/> Compare saved listings</NavLink>
              </Nav>
            )
            : ''}
          <Nav pullRight>
            {!this.props.loggedIn
              ? (<NavLink className={header.navButton} activeClassName={header.active} to='/login'>Sign Up / Log in</NavLink>)
              : (<NavLink className={header.navButton} to='/main' onClick={this.processAuth}>Log out</NavLink>)}
          </Nav>
        </Navbar>
      </header>
    )
  }
};
