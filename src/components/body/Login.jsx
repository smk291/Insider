import React, {Component} from 'react'
import {Link} from 'react-router'
import { FormGroup, FormControl, controlId, ControlLabel, FieldGroup, Button, Row, Col, Grid, Jumbotron, Popover, Tooltip, Modal } from 'react-bootstrap';
import login from './login.css'
import primary from './primary.css'
import InlineSVG from 'svg-inline-react'
import MdSearch from 'react-icons/lib/md/search'
import MdCompare from 'react-icons/lib/md/compare'
import MdMap from 'react-icons/lib/md/map'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.authSwitch = this.authSwitch.bind(this);
    this.processAuth = this.processAuth.bind(this);
  }

  logIn(e) {
    this.props.logIn(e);
  }

  handleChange(e) {
    this.props.handleChange(e);
  }

  signUp(e) {
    this.props.signUp(e);
  }

  authSwitch(e) {
    this.props.authSwitch();
  }

  processAuth(e) {
    this.props.processAuth(e);
  }

  render() {
    return (
      <div className={login.verticalCenter}>
        <Grid className={login.fuckingCenterGodFuckingDamnIt} fluid>
          <Row className="show-grid">
            <a href="#" onClick={this.authSwitch}>Need to sign up?</a>
            <Col md={2} mdOffset={5}>
            <div className="align-middle">
            {!this.props.signingUp?
                <form>
                  <h1>Please Log In.</h1>
                  <div>
                    <p>Email address:</p>
                    <FormControl id="email" type="email" placeholder="email" name="email" onChange={this.handleChange} value={this.props.value}/>
                  </div>
                  <div>
                    <p>Password:</p>
                    <FormControl id="password" type="password" placeholder="password" name="password" onChange={this.handleChange} value={this.props.value}/>
                  </div>
                  <div>
                  </div>
                </form>:
                <form>
                  <h1>Sign Up</h1>
                  <div>
                    <p>First name:</p>
                    <FormControl id="firstName" placeholder="firstName" name="signUpFirstName" onChange={this.handleChange} value={this.props.value}/>
                  </div>
                  <div>
                    <p>Last name:</p>
                    <FormControl id="lastName" placeholder="lastName" name="signUpLastName" onChange={this.handleChange} value={this.props.value}/>
                  </div>
                  <div>
                    <p>Email address:</p>
                    <FormControl id="email" placeholder="email" name="signUpEmail" onChange={this.handleChange} value={this.props.value}/>
                  </div>
                  <div>
                    <p>Password:</p>
                    <FormControl id="password" type="password" name="signUpPassword" onChange={this.handleChange} value={this.props.value}/>
                  </div>
                  <div>
                    {/* <Link to="/">Back to Home</Link> */}
                  </div>
                </form>}
                </div>
              <Button className={login.formButton} bsStyle="primary" bsStyle='primary' style={{position: 'relative', zIndex: '10000', width: '100px'}} placeholder="Submit" onClick={this.processAuth}>Sign in</Button>
            </Col>
            <Col md={3} sm={2}/>
          </Row>
        </Grid>
      </div>
    );
  }
}