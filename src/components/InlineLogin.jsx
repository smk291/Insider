import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';

export default class InlineLogin extends React.Component {
  constructor() {
    super();

    this.onEmailChange = this.onEmailChange.bind(this);
    this.state = {};
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('Clicked');
  }

  onEmailChange(e) {
    const value = this.refs.email.getValue();

    if (/.+@.+\.com/.test(value)) {
      this.setState({emailValid: 'success'});
    } else {
      this.setState({emailValid: 'error'});
    }
  }

  render() {
    return (
      <form className={this.props.className} onSubmit={this.onSubmit} action="">
        <FormControl
          ref='email'
          type='text'
          bsStyle={this.state.emailValid}
          placeholder='Email'
          onChange={this.onEmailChange}
        />{' '}
        <FormControl type='text' placeholder='Password' />{' '}
        <Button bsStyle='success' type='submit'>Sign in</Button>
      </form>
    );
  }
}