import React from 'react'
import {Button, HelpBlock, ButtonGroup, FormGroup, ControlLabel, FormControl, Grid, Jumbotron, Row, Col, Poover, Tooltip, Modal, Checkbox} from 'react-bootstrap'
import main2 from '../main2.css'
import InlineSVG from 'svg-inline-react'
import humanize from 'underscore.string/humanize'
import searchstyle from '../searchstyle'

export default class Rent extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.handleChbox = this.handleChbox.bind(this)
  }

  handleChange(e) {
    this.props.handleChange(e);
  }

  handleCheckbox(e) {
    this.props.handleCheckbox(e)
  }

  handleChbox(e, field) {
    this.props.handleChbox(e, field);
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={2} sm={2}>
            <FormGroup>
              <ControlLabel>Rent</ControlLabel>
              <Row>
                <Col style={{padding: '0px', margin: '5px', width: '64px'}}  md={6} sm={12}>
                    <FormControl
                      id="rentMin"
                      type="number"
                      label="Min. rent"
                      placeholder="min"
                      min={0}
                      step={100}
                      name="minRent"
                      value={this.props.minRent}
                      onChange={this.handleChange}
                    />
                  </Col>
                  <Col style={{padding: '0px', margin: '5px', width: '64px'}} md={6} sm={12}>
                    <FormControl
                      id="rentMax"
                      type="number"
                      label="Max. rent"
                      placeholder="max"
                      step={100}
                      min={this.props.minRent}
                      name="maxRent"
                      value={this.props.maxRent}
                      onChange={this.handleChange}
                    />
                </Col>
              </Row>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}