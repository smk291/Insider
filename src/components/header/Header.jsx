// <editor-fold> import
import {Link} from 'react-router-dom'
import React from 'react'
import {Nav, Navbar, Tooltip, OverlayTrigger} from 'react-bootstrap'
import Login from '../body/auth/Login'
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
                {< Link className = {
                  header.navButton
                }
                activeClassName = {
                  header.active
                }
                to = '/home' > <MdHome/> < /Link>}
                <Link activeOnlyWhenExact className={header.navButton} activeClassName={header.active} to='/'><MdSearch/>
                  View and filter housing data</Link>
                <Link className={header.navButton} activeClassName={header.active} to='/map'><MdMap/>
                  Use map</Link>
                <Link className={header.navButton} activeClassName={header.active} to='/compare'><MdCompare/>
                  compare saved listings</Link>
              </Nav>
            )
            : ''}
          <Nav pullRight>
            {!this.props.loggedIn
              ? (
                <Link className={header.navButton} activeClassName={header.active} to='/login'>Sign Up / Log in</Link>
              )
              : (
                <Link className={header.navButton} to='/main' onClick={this.processAuth}>Log out</Link>
              )}
            {/* <Link className={header.navButton} onClick={this.showTips} to='/main'>Show helpful tips? </Link> */}
            {/* Show help tooltips */}
          </Nav>
        </Navbar>
      </header>
    )
  }
};
