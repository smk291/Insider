import React from 'react';
import {Link} from 'react-router';
import {
  FormGroup,
  FormControl,
  controlId,
  ControlLabel,
  FieldGroup,
  Button
} from 'react-bootstrap';

export default class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.logIn = this.logIn.bind(this);
  }

  logIn(e) {
    this.props.logIn(e);
  }

  handleChange(e) {
    this.props.handleChange(e);
  }

  render() {
    return (
      <form onSubmit={this.logIn}>
        <div>
          <ControlLabel htmlFor="email">
            Your Email
          </ControlLabel>
          <FormControl id="email" type="email" placeholder="email" name="email" onChange={this.handleChange} value={this.props.email}/>
        </div>
        <div>
          <ControlLabel htmlFor="password">Password</ControlLabel>
          <FormControl id="password" type="password" placeholder="youreawizard" name="password" onChange={this.props.handleChange} value={this.props.password}/>
        </div>
        <div>
          {/* <Link to="/">Back to Home</Link> */}
          <Button bsStyle="primary" type="submit" placeholder="Submit">Sign in</Button>
        </div>
      </form>
    );
  }
}
