import Earth from '../planets/Earth'
import Mars from '../planets/Mars'
import { Match, Miss } from 'react-router'
import Moon from '../planets/Moon'
import NotFound from '../planets/NotFound'
import React, { Component } from 'react'
import SignUp from './SignUp'
import Login from './Login'
import Main2 from './Main2'
import GMapEx from './MapPage'
import Tables from  './Tables'

export default class Main extends Component {
  render() {
    return (
      <main>
        <Match pattern="/" exactly component={Earth} />
        <Match pattern="/moon" component={Moon} />
        <Match pattern="/mars" component={Mars} />
        <Match pattern="/login" render={() => <Login
          loggedIn={this.props.loggedIn}
          logOut={this.props.logOut}
          logIn={this.props.logIn}
          open={this.props.open}
          close={this.props.close}
          changeState={this.props.changeState}
          handleChange={this.props.handleChange}
          showModal={this.props.showModal}
          email={this.props.email}
          password={this.props.password}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
        />} />
        <Match pattern="/signUp" render={() => <SignUp
          loggedIn={this.props.loggedIn}
          signUp={this.props.signUp}
          logIn={this.props.logIn}
          open={this.props.open}
          close={this.props.close}
          changeState={this.props.changeState}
          handleChange={this.props.handleChange}
          showModal={this.props.showModal}
          signUpEmail={this.props.signUpEmail}
          signUpPassword={this.props.signUpPassword}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
        />} />
        <Match pattern="/main" render={() => <Main2
          loggedIn={this.props.loggedIn}
          signUp={this.props.signUp}
          logIn={this.props.logIn}
          open={this.props.open}
          close={this.props.close}
          changeState={this.props.changeState}
          handleChange={this.props.handleChange}
          showModal={this.props.showModal}
          signUpEmail={this.props.signUpEmail}
          signUpPassword={this.props.signUpPassword}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
        />} />
        <Match pattern="/map" render={() => <GMapEx
          loggedIn={this.props.loggedIn}
          signUp={this.props.signUp}
          logIn={this.props.logIn}
          open={this.props.open}
          close={this.props.close}
          changeState={this.props.changeState}
          handleChange={this.props.handleChange}
          showModal={this.props.showModal}
          signUpEmail={this.props.signUpEmail}
          signUpPassword={this.props.signUpPassword}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
        />} />
        <Match pattern="/tables" render={() => <Tables
          loggedIn={this.props.loggedIn}
          signUp={this.props.signUp}
          logIn={this.props.logIn}
          open={this.props.open}
          close={this.props.close}
          changeState={this.props.changeState}
          handleChange={this.props.handleChange}
          showModal={this.props.showModal}
          signUpEmail={this.props.signUpEmail}
          signUpPassword={this.props.signUpPassword}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
        />} />
        <Miss component={NotFound} />
      </main>
    )
  }
};