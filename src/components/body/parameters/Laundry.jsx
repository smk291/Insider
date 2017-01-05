import React from 'react'
import {Button, HelpBlock, ButtonGroup, FormGroup, ControlLabel, FormControl, Grid, Jumbotron, Row, Col, Poover, Tooltip, Modal, Checkbox} from 'react-bootstrap'
import main2 from '../main2.css'
import InlineSVG from 'svg-inline-react'
import humanize from 'underscore.string/humanize'
import searchstyle from '../searchstyle'

export default class Laundry extends React.Component {
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
          <Col md={4} sm={4}>
            <FormGroup>
              <ControlLabel>Laundry</ControlLabel>
              <Row>
                <Col style={{padding: '0px', margin: '5px', width: '64px'}}  md={6} sm={12}>
                  {this.props.laundry_types.map((type, idx) => {
                    return <Checkbox
                      key={idx}
                      type="checkbox"
                      checked={this.props[type]}
                      onChange={this.handleChbox.bind(this.type)}
                      >{humanize(type)}</Checkbox>
                  })}
                </Col>
              </Row>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}