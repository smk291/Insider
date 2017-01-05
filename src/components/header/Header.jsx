import {Link} from 'react-router'
// import {IndexLink} from 'react-router'
// import { LinkContainer } from 'react-router-bootstrap'
// import { IndexLinkContainer } from 'react-router-bootstrap'
import React from 'react'
import Navbar from 'react-bootstrap/lib/Navbar'
import {Tooltip, OverlayTrigger} from 'react-bootstrap'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'
// import InlineLogin from './InlineLogin'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Login from '../body/Login'
import header from './header.css'
import InlineSVG from 'svg-inline-react'
import MdHome from 'react-icons/lib/md/home'
import MdHelp from 'react-icons/lib/md/help'
import MdSearch from 'react-icons/lib/md/search'
import MdViewList from 'react-icons/lib/md/view-list'
import MdMap from 'react-icons/lib/md/map'
import MdCompare from 'react-icons/lib/md/compare'

export default class Header extends React.Component {
  constructor(props){
    super(props);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.logOut = this.logOut.bind(this);
    this.showTips = this.showTips.bind(this);
    // this.showToolTips = this.showToolTips.bind(this);
  }

  open(e) {
    this.props.open(e);
  }

  close(e) {
    this.props.close(e);
  }

  logOut(e) {
    this.props.logOut(e);
  }

  showTips(e) {
    this.props.showTips(e)
  }

  // showTooltips(e){
  //   this.props.showTooltips(e);
  // }

  render() {
    const tooltip = (
      <Tooltip id="tooltip"><strong>Click here to see helpful tips as you navigate Insider!</strong></Tooltip>
  );

    return (
      <header>
        <Navbar className={header.navbar} fluid style={{height: '50px'}}>
          <Nav pullLeft>
            <Link activeOnlyWhenExact className={header.navButton} activeClassName={header.active} to='/'><MdHome /></Link>
            <Link className={header.navButton} activeClassName={header.active} to='/search'><MdSearch /> search</Link>
            <Link className={header.navButton} activeClassName={header.active} to='/list'><MdViewList /> view listings</Link>
            <Link className={header.navButton} activeClassName={header.active} to='/map'><MdMap /> view map</Link>
            <Link className={header.navButton} activeClassName={header.active} to='/tables'><MdCompare /> compare saved listings</Link>
          </Nav>
          <Nav pullRight>
            {!this.props.loggedIn ? (
              <Link className={header.navButton} activeClassName={header.active} to='/login'>Sign Up / Log in</Link>) : (<Link className={header.navButton} to='/main' onClick={this.logOut}>Log out</Link>)}
              {/* <Link className={header.navButton} onClick={this.showTips} to='/main'>Show helpful tips? </Link> */}
              {/* Show help tooltips */}
          </Nav>
        </Navbar>
      </header>
    )
  }
};