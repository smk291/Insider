import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Popover from 'react-bootstrap/lib/Popover';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Modal from 'react-bootstrap/lib/Modal';
// import LearnMore from './LearnMore';
import Body from './Body';
import HeaderNavigation from './HeaderNavigation';
import Footer from './Footer';
import Login from './Login';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.state = {
      showModal: false
    }
  }

  close(){
    this.setState({ showModal: false });
  }

  open(){
    this.setState({ showModal: true });
  }

  render() {
    return (
      <div>
        <HeaderNavigation
          loggedIn={this.props.loggedIn}
          logOut={this.props.logOut}
          logIn={this.props.logIn}
          email={this.props.email}
          password={this.props.password}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
          changeState={this.props.changeState}
          handleChange={this.props.handleChange}
          open={this.open}
          close={this.close}
          showModal={this.state.showModal}
        />
        <Body
          logIn={this.props.logIn}
          logOut={this.props.logOut}
          handleChange={this.props.handleChange}
          signUp={this.props.signUp}
          email={this.props.email}
          password={this.props.password}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
          loggedIn={this.props.loggedIn}
          changeState={this.props.changeState}
          open={this.open}
          close={this.close}
          showModal={this.state.showModal}
        />
        <Footer />
      </div>
    );
  }
}