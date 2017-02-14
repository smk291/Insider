import React, {Component} from 'react'
import {Link} from 'react-router'
import { FormGroup, FormControl, controlId, ControlLabel, FieldGroup, Button, Row, Col, Grid, Jumbotron, Popover, Tooltip, Modal } from 'react-bootstrap';
import login from './login.css'
import primary from '../primary.css'
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

  render() {
    return (
      <div>
        <Grid fluid>
          <Row className="show-grid">
            <Col md={3} sm={2}/>
            <Col md={3} sm={4}>
              <form>
                <h1>Log In</h1>
                <div>
                  <p>Email address:</p>
                  <FormControl id="email" type="email" placeholder="email" name="email" onChange={this.handleChange} value={this.props.value}/>
                </div>
                <div>
                  <p>Password:</p>
                  <FormControl id="password" type="password" placeholder="password" name="password" onChange={this.props.handleChange} value={this.props.value}/>
                </div>
                <div>
                  {/* <Link to="/">Back to Home</Link> */}
                  <Button className={login.formButton} bsStyle="primary" placeholder="Submit" onClick={this.logIn} bsStyle='primary' style={{position: 'relative', zIndex: '10000', width: '100px'}}>Sign in</Button>
                </div>
              </form>
            </Col>

            <Col md={3} sm={4}>
              <form>
                <h1>Sign Up</h1>
                <div>
                  <p>First name:</p>
                  <FormControl id="firstName" type="firstName" placeholder="firstName" name="firstName" onChange={this.handleChange} value={this.props.value}/>
                </div>
                <div>
                  <p>Last name:</p>
                  <FormControl id="lastName" type="lastName" placeholder="lastName" name="lastName" onChange={this.handleChange} value={this.props.value}/>
                </div>
                <div>
                  <p>Email address:</p>
                  <FormControl id="email" type="email" placeholder="email" name="signUpEmail" onChange={this.handleChange} value={this.props.value}/>
                </div>
                <div>
                  <p>Password:</p>
                  <FormControl id="password" type="password" placeholder="password" name="signUpPassword" onChange={this.props.handleChange} value={this.props.value}/>
                </div>
                <div>
                  {/* <Link to="/">Back to Home</Link> */}
                  <Button className={login.formButton} bsStyle="primary" bsStyle='primary' style={{position: 'relative', zIndex: '10000', width: '100px'}} placeholder="Submit" onClick={this.signUp}>Sign in</Button>
                </div>
              </form>
            </Col>
            <Col md={3} sm={2}/>
          </Row>
        </Grid>
        <Jumbotron style={{backgroundColor: '#DCE1DE'}}>
          <Grid>
            <h1 style={{color: '#216869', fontWeight: '300'}}>Welcome to <span className={primary.insider}>Insider</span></h1>
            <p className={primary.points}>craigslist is indispensable.</p>
            <p>Where else would you look if you were on a budget and needed a sublet or an apartment in a major US city?</p>
            <p className={primary.points}>It's also awful.</p>
            <p>I mean, it's awful in a lot of ways, but the website itself is particularly bad. It's ugly, dated and user-hostile. The search is limited and can sort by just two parameters (recency and price). The mapping is helpful only when there's one marker: unless you already know exactly what listings the map is displaying and where they are, you have no way of knowing what each marker represents until you click on it. </p>
            <p className={primary.points}>It doesn't need to be this way.</p>
            <p>Insider shows how easy it would be to make craigslist more functional, useful and usable.</p>
            <div>
              <Button onClick={this.scrapeNull}>get null</Button>
              <Button onClick={this.scrapeList}>get list</Button>
              <Button onClick={this.scrapeRows}>get row scrapes</Button>
              <Button onClick={this.checkFor404}>check for 404</Button>
              {/* <Button onClick={this.getListings}>get listings</Button> */}
              {/* <Button onClick={this.filterListings}>filter listings</Button> */}
              {/* <Button onClick={this.createFavoritesForDisplay}>Favorites for listing</Button> */}
            </div>
          </Grid>

        </Jumbotron>
        <Grid className={primary.thirdsGrid}>
          <Row style={{display: 'flex'}}>
            <Col className={primary.thirds} md={4}>
              <h2><MdSearch />   Search better.</h2>
              <p className={primary.thirdsP}>Set priorities and Insider will rank listings accordingly.</p>

            </Col>
            <Col className={primary.thirds} md={4}>
            </Col>
            <Col className={primary.thirds} md={4}>
              <h2><MdCompare />   Compare.</h2>
              <p className={primary.thirdsP}>Comparing listings side-by-side. </p>

            </Col>
            {/* <Col className={primary.thirds} md={4}>
              <h2><MdMap />   Use maps.</h2>
              <p className={primary.thirdsP}>Did you know that it's possible to style map markers? Did you know that it's possible to display information about a listing visually via its map marker? Amazing, right?</p>
              <p>
                <Button>Make mapping useful»</Button>
              </p>
            </Col> */}
          </Row>
        </Grid>
      </div>
        );
        }
        }

















