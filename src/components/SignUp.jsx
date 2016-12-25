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

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  signUp(e) {
    this.props.signUp(e);
  }

  handleChange(e) {
    this.props.handleChange(e);
  }

  render() {
    return (
      <form onSubmit={this.signUp}>
        <div>
          <ControlLabel htmlFor="firstName">First Name</ControlLabel>
          <FormControl id="firstName" type="text" placeholder="John" name="firstName" onChange={this.handleChange} value={this.props.value}/>
        </div>

        <div>
          <ControlLabel htmlFor="lastName">Last Name</ControlLabel>
          <FormControl id="lastName" type="text" placeholder="Doe" name="lastName" onChange={this.handleChange} value={this.props.value}/>
        </div>
        <div>
          <ControlLabel htmlFor="email">Your Email</ControlLabel>
          <FormControl id="email" type="email" placeholder="johndoe@mail.com" name="email" onChange={this.handleChange} value={this.props.value}/>
        </div>
        <div>
          <ControlLabel htmlFor="password">Password</ControlLabel>
          <FormControl id="password" type="password" placeholder="qweqweqwe" name="password" onChange={this.handleChange} value={this.props.value}/>
        </div>
        <div>
          <Button bsStyle="primary" type="submit" placeholder="Submit">Sign up</Button>
        </div>
      </form>
    );
  }
}