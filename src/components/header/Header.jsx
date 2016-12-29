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

export default class Header extends React.Component {
  constructor(props){
    super(props);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.logOut = this.logOut.bind(this);
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

  render() {
    return (
      <header>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Insider</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="/main">Home</NavItem>
              <NavItem eventKey={2} href="/login">Login</NavItem>
              <NavItem eventKey={3} href="/signUp">Search</NavItem>
              <NavItem eventKey={4} href="#">Search</NavItem>
              <NavDropdown eventKey={5} title="Dropdown" id="basic-nav-dropdown">
                <MenuItem eventKey={5.1}>Action</MenuItem>
                <MenuItem eventKey={5.2}>Another action</MenuItem>
                <MenuItem eventKey={5.3}>Something else here</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={6.3}>Separated link</MenuItem>
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              {this.props.loggedIn ? <NavItem eventKey={2} href="#">View saved listings</NavItem> :

              <NavDropdown eventKey={7} title="Dropdown" id="basic-nav-dropdown">
                <MenuItem eventKey={7.1}>Action</MenuItem>
                <MenuItem eventKey={7.2}>Another action</MenuItem>
                <MenuItem eventKey={7.3}>Something else here</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={7.3}>Separated link</MenuItem>
              </NavDropdown>}


              {this.props.loggedIn ? <NavItem eventKey={8}  to="/" onClick={this.logOut} href="#">Logout</NavItem> : <NavItem eventKey={9} href="#" onClick={this.open}>Sign in / Sign up</NavItem>}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <nav>
          <ul>
            <li><Link to='/'>Earth 🌏</Link></li>
            <li><Link to='/moon'>Moon 🌕</Link></li>
            <li><Link to='/mars'>Mars 🔴</Link></li>
            <li><Link to='/signUp'>Sign Up</Link></li>
            <li><Link to='/login'>Log in</Link></li>
            <li><Link to='/map'>map</Link></li>
            <li><Link to='/tables'>tables</Link></li>
            {this.props.loggedIn ? <p>Logged in!</p> : <p> Not logged in </p>}
          </ul>
        </nav>
        <hr />
      </header>
    )
  }
};