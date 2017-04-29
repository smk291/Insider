import React, { Component } from "react";
import { Link } from "react-router";
import {
  FormGroup,
  FormControl,
  controlId,
  ControlLabel,
  FieldGroup,
  Button,
  Row,
  Col,
  Grid,
  Jumbotron,
  Popover,
  Tooltip,
  Modal
} from "react-bootstrap";
import login from "./login.css";
import InlineSVG from "svg-inline-react";
import MdSearch from "react-icons/lib/md/search";
import MdCompare from "react-icons/lib/md/compare";
import MdMap from "react-icons/lib/md/map";
import Seattlejpg from "./Seattle.jpg";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.authSwitch = this.authSwitch.bind(this);
    this.processAuth = this.processAuth.bind(this);
  }

  handleChange(e) {
    this.props.handleChange(e);
  }

  authSwitch(e) {
    this.props.authSwitch();
  }

  processAuth(e) {
    this.props.processAuth(e);
  }

  render() {
    const inOrUp = this.props.signingUp ? "up": "in";
    const submitText = !this.props.signingUp ? "Need to sign up?": "Need to sign in?";

    return (
      <div id={login.bodyContainer}>
        <div className={login.container}>
          <Grid
            className={login.verticalCenter}
            style={{
              backgroundImage: `url(${Seattlejpg})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              minWidth: "800px"
            }}
            fluid
          >
            <Row id={login.loginFlexC} className="show-grid">
              <Col>
                <div id={login.login}>
                  <form>
                    {!this.props.signingUp 
                      ? <h1 style={{ fontWeight: "300" }}>Please sign in.</h1>
                      : <div>
                          <h1>Sign Up</h1>
                          <div>
                            <p>First name:</p>
                            <FormControl
                              id="firstName"
                              placeholder="firstName"
                              name="signUpFirstName"
                              onChange={this.handleChange}
                              value={this.props.value}
                            />
                          </div>
                          <div>
                            <p>Last name:</p>
                            <FormControl
                              id="lastName"
                              placeholder="lastName"
                              name="signUpLastName"
                              onChange={this.handleChange}
                              value={this.props.value}
                            />
                          </div>
                        </div>
                    }
                    <div>
                      <p style={{ margin: "0px 0px" }}>Email address:</p>
                      <FormControl
                        id="email"
                        type="email"
                        placeholder="email"
                        name="email"
                        onChange={this.handleChange}
                        value={this.props.value}
                      />
                    </div>
                    <div>
                      <p style={{ margin: "0px 0px" }}>Password:</p>
                      <FormControl
                        id="password"
                        type="password"
                        placeholder="password"
                        name="password"
                        onChange={this.handleChange}
                        value={this.props.value}
                      />
                    </div>
                    <div />
                  </form>
                </div>
                <Button
                  className={login.formButton}
                  bsStyle="primary"
                  bsStyle="primary"
                  style={{
                    position: "relative",
                    zIndex: "10000",
                    width: "100px"
                  }}
                  placeholder="Submit"
                  onClick={this.processAuth}
                >
                  Sign {inOrUp}
                </Button>
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    backgroundColor: "hsla(0, 0%, 100%, .55)"
                  }}
                >
                  <a href="#" id={login.authSwitch} onClick={this.authSwitch}>
                    {submitText}
                  </a>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}
