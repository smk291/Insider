import React, {Component} from 'react'
import {Link} from 'react-router'
import {
  FormGroup,
  FormControl,
  controlId,
  ControlLabel,
  FieldGroup,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import login from './login.css'

export default class LogIn extends React.Component {
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
      <section>
        <Row className="show-grid">
          <Col md={3} sm={2}/>
          <Col md={3} sm={4}>
            <form>
              <h1>Log In</h1>
              <div>
                <p>Email address:</p>
                <FormControl id="email" type="email" placeholder="email" name="email" onChange={this.handleChange} value={this.props.email}/>
              </div>
              <div>
                <p>Password:</p>
                <FormControl id="password" type="password" placeholder="youreawizard" name="password" onChange={this.props.handleChange} value={this.props.password}/>
              </div>
              <div>
                {/* <Link to="/">Back to Home</Link> */}
                <Button className={login.formButton} bsStyle="primary" placeholder="Submit" onClick={this.logIn}>Sign in</Button>
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
                <FormControl id="password" type="password" placeholder="youreawizard" name="signUpPassword" onChange={this.props.handleChange} value={this.props.value}/>
              </div>
              <div>
                {/* <Link to="/">Back to Home</Link> */}
                <Button className={login.formButton} bsStyle="primary" placeholder="Submit" onClick={this.signUp}>Sign in</Button>
              </div>
            </form>
          </Col>
          <Col md={3} sm={2}/>
        </Row>
      </section>
    );
  }
}
