import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';
import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
// import InlineLogin from './InlineLogin';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Login from '../body/Login';
import header from './header.css';

export default class Header extends React.Component {
  constructor(props){
    super(props);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.logOut = this.logOut.bind(this);
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

  // showTooltips(e){
  //   this.props.showTooltips(e);
  // }

  render() {
    return (
      <header>
        <Navbar className={header.navbar} style={{position: 'relative'}}>
          <Nav pullLeft>
            <Link className={header.navButton} activeClassName={header.active} to='/main'>Home</Link>
            <Link className={header.navButton} activeClassName={header.active} to='/map'>map</Link>
            <Link className={header.navButton} activeClassName={header.active} to='/tables'>tables</Link>
          </Nav>
          <Nav pullRight>
            {this.props.loggedIn ? (<div>
              <Link className={header.navButton} activeClassName={header.active} to='/showhelptips'>Show help tooltips</Link>
              <Link className={header.navButton} activeClassName={header.active} to='/logIn'>Sign Up / Log in</Link>
            </div>) : (<Link className={header.navButton} activeClassName={header.active} to='/main' onClick={this.logOut}>Log out</Link>)}
          </Nav>
        </Navbar>
          <div>
            <p>Logged in!</p> : <p> Not logged in </p>}
          </div>
        <hr />
      </header>
    )
  }
};

{/* <li><Link to='/'>Earth 🌏</Link></li>
<li><Link to='/moon'>Moon 🌕</Link></li>
<li><Link to='/mars'>Mars 🔴</Link></li> */}
