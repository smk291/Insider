import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
// import InlineLogin from './InlineLogin';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Login from './Login';

export default class HeaderNavigation extends React.Component {
  constructor(props){
    super(props);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open () {
    this.props.open();
  }

  close () {
    this.props.close();
  }

  render() {
    let brand = <a href='#'>Project Name</a>;
    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Insider</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">Search</NavItem>
            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            {this.props.loggedIn ? <NavItem eventKey={2} href="#">View saved listings</NavItem> :

            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>}


            {this.props.loggedIn ? <NavItem eventKey={2}  to="/" onClick={this.props.logOut.bind(this)} href="#">Logout</NavItem> : <NavItem eventKey={1} href="#" onClick={this.open}>Sign in / Sign up</NavItem>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}