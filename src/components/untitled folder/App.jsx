import React, {Component} from 'react';
import {BrowserRouter} from 'react-router';
import Router from './Router';
import Nav_bar from './Navbar';
require('../../node_modules/bootstrap/dist/css/bootstrap.css');
var Button = require('react-bootstrap').Button



export default class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Nav_bar />
          <p>Hello!</p>
          <Button>Default</Button>
          ​ {/* Provides extra visual weight and identifies the primary action in a set of buttons */}
          <Button bsStyle="primary">Primary</Button>
          ​ {/* Indicates a successful or positive action */}
          <Button bsStyle="success">Success</Button>
          ​ {/* Contextual button for informational alert messages */}
          <Button bsStyle="info">Info</Button>
          ​ {/* Indicates caution should be taken with this action */}
          <Button bsStyle="warning">Warning</Button>
          ​ {/* Indicates a dangerous or potentially negative action */}
          <Button bsStyle="danger">Danger</Button>
          ​ {/* Deemphasize a button by making it look like a link while maintaining button behavior */}
          <Button bsStyle="link">Link</Button>
          <Router/>
        </div>
      </BrowserRouter>
    )
  }
}
