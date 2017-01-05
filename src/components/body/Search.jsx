import React from 'react'
import {Button, HelpBlock, ButtonGroup, FormGroup, ControlLabel, FormControl, Grid, Jumbotron, Row, Col, Ppover, Tooltip, Modal, Checkbox, Panel, ListGroup, ListGroupItem} from 'react-bootstrap'
import main2 from './main2.css'
import InlineSVG from 'svg-inline-react'
import ListingsView from './ListingsView'
import humanize from 'underscore.string/humanize'
import searchstyle from './searchstyle'
import Bedrooms from './parameters/Bedrooms'
import Rent from './parameters/Rent'
import Housing from './parameters/Housing'
import Laundry from './parameters/Laundry'
import Bathroom from './parameters/Bathroom'
import Room from './parameters/Room'

export default class Search extends React.Component {
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
        <div className={searchstyle.listDiv}>
          <Panel collapsible defaultExpanded header="Types of housing">
            Some default panel content here.
            <ListGroup fill>
              <ListGroupItem>Item 1</ListGroupItem>
              <ListGroupItem>Item 2</ListGroupItem>
              <ListGroupItem>&hellip;</ListGroupItem>
            </ListGroup>
            Some more panel content here.
          </Panel>
          <p ></p>
          <FormGroup style={{
            width: '20%',
            padding: '0px 10px'
          }}>
            {this.props.housing_types.map((type, idx) => {
              return <div style={{
                width: '100px',
                display: 'inline-block'
              }}>
                <Checkbox inline key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
              </div>
            })}
          </FormGroup>
        </div>
        <div className={searchstyle.listDiv}>
          <p className={searchstyle.listHeader}>Laundry</p>
          <FormGroup style={{
            width: '20%',
            padding: '0px 10px'
          }}>
            {this.props.laundry_types.map((type, idx) => {
              return <div style={{
                width: '100px',
                display: 'inline-block'
              }}>
                <Checkbox inline key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
              </div>
            })}
          </FormGroup>
        </div>
        <div className={searchstyle.listDiv}>
          <p className={searchstyle.listHeader}>Parking</p>
          <FormGroup style={{
            width: '20%',
            padding: '0px 10px'
          }}>
            {this.props.parking_types.map((type, idx) => {
              return <div style={{
                width: '100px',
                display: 'inline-block'
              }}>
                <Checkbox inline key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
              </div>
            })}
          </FormGroup>
        </div>
        <div className={searchstyle.listDiv}>
          <p className={searchstyle.listHeader}>No. of Bedroom</p>
          <FormGroup style={{
            padding: '0px 5px'
          }}>
            <FormControl style={{width: '64px', display: 'inline', margin: '0px 5px'}} name="minBedrooms" type="number" placeholder="min" min="0" value={this.props.minBedrooms} onChange={this.handleChange}/>
            <FormControl style={{width: '64px', display: 'inline'}}
            name="maxBedrooms" type="number" placeholder="max" min={this.props.minBedrooms} value={this.props.maxBedrooms} onChange={this.handleChange}/>

            {this.props.furnished_types.map((type, idx) => {
              return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
            })}
          </FormGroup>
        </div>
        <div className={searchstyle.listDiv}>
          <p className={searchstyle.listHeader}>Rent</p>
          <FormGroup style={{
            padding: '0px 5px'
          }}>
            <FormControl style={{width: '64px', display: 'inline', margin: '0px 5px'}} name="minRent" type="number" placeholder="min" min="0" step={50} value={this.props.minRent} onChange={this.handleChange}/>
            <FormControl style={{width: '64px', display: 'inline'}} name="maxRent" type="number" placeholder="max" min={this.props.minRent} step={50} value={this.props.maxRent} onChange={this.handleChange}/>

          </FormGroup>
        </div>
        <div className={searchstyle.listDiv}>
          <p className={searchstyle.listHeader}>Private room?</p>
          <FormGroup>
            {this.props.private_room_types.map((type, idx) => {
              return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
            })}
          </FormGroup>
        </div>
        <div className={searchstyle.listDiv}>
          <p className={searchstyle.listHeader}> Misc. </p>
          <FormGroup>
            {this.props.cat_types.map((type, idx) => {
              return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
            })}
          </FormGroup>
        </div>
        <div className={searchstyle.listDiv}>
          <FormGroup>
            {this.props.dog_types.map((type, idx) => {
              return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
            })}
          </FormGroup>
        </div>
        <div className={searchstyle.listDiv}>
        </div>
        <div className={searchstyle.listDiv}>
          <FormGroup>
            {this.props.smoking_types.map((type, idx) => {
              return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
            })}
          </FormGroup>
        </div>
        <div className={searchstyle.listDiv}>
          <FormGroup>
            {this.props.wheelchair_types.map((type, idx) => {
              return <Checkbox type="checkbox" key={idx} checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
            })}
          </FormGroup>
        </div>
      </div>
    );
  }
}

    table.enu('parking_types', ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking', null]).defaultTo(null);
    table.enu('bath_types', ['private bath', 'no private bath', null]).defaultTo(null);
    table.enu('private_room_types', ['private room', 'room not private', null]).defaultTo(null);
    table.enu('cat_types', ['cats are OK - purrr', null]).defaultTo(null);
    table.enu('dog_types', ['dogs are OK - wooof', null]).defaultTo(null);
    table.enu('furnished_types', ['furnished', null]).defaultTo(null);
    table.enu('smoking_types', ['no smoking', null]).defaultTo(null);
    table.enu('wheelchair_types', ['wheelchair accessible', null]).defaultTo(null);
    table.enu('sub_or_apt', ['sub', 'apt']);
    table.timestamp('last_checked').defaultTo(knex.fn.now());
    table.timestamps(true, true);


/* <Bedrooms
  {...this.props}
/> */
/* <Rent
  {...this.props}
/> */

/* <Laundry
  {...this.props}
/> */

/* <Bathroom
  {...this.props}
/> */

/* <Room
  {...this.props}
/> */