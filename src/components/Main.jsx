import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
// import LearnMore from './LearnMore';
import Body from './Body';
import HeaderNavigation from './HeaderNavigation';
import Footer from './Footer';

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <HeaderNavigation />
        <Body />
        <Footer />
      </div>
    );
  }
}

// import React, { Component } from 'react';
// import { Match, Miss } from 'react-router';
//
// export default class Main extends Component {
//   constructor() {
//     super();
//   }
//
//   render() {
//     return (
//       <div id="main">
//
//       </div>
//     )
//   }
// }