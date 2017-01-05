import React from 'react'
import ReactDOM from 'react-dom';
import ReactSimpleRange from 'react-simple-range';
import {Button, HelpBlock, ButtonGroup, FormGroup, ControlLabel, FormControl, Grid, Jumbotron, Row, Col, Ppover, Tooltip, Modal, Checkbox, Panel, ListGroup, ListGroupItem, Accordion, PanelGroup} from 'react-bootstrap'
import main2 from './main2.css'
import ListingsView from './ListingsView'
import humanize from 'underscore.string/humanize'
import searchstyle from './searchstyle'
import Bedrooms from './parameters/Bedrooms'
import Rent from './parameters/Rent'
import Housing from './parameters/Housing'
import Laundry from './parameters/Laundry'
import Bathroom from './parameters/Bathroom'
import Room from './parameters/Room'
import InlineSVG from 'svg-inline-react'
import MdBackup from 'react-icons/lib/md/backup'


export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.handleChbox = this.handleChbox.bind(this)
    this.housingSlider = this.housingSlider.bind(this)
    this.rentSlider = this.rentSlider.bind(this)
    this.bedroomSlider = this.bedroomSlider.bind(this)
    this.roomSlider = this.roomSlider.bind(this)
    this.bathSlider = this.bathSlider.bind(this)
    this.parkingSlider = this.parkingSlider.bind(this)
    this.laundrySlider = this.laundrySlider.bind(this)
    this.furnishedSlider = this.furnishedSlider.bind(this)
    this.catSlider = this.catSlider.bind(this)
    this.dogSlider = this.dogSlider.bind(this)
    this.smokingSlider = this.smokingSlider.bind(this)
    this.wheelchairSlider = this.wheelchairSlider.bind(this)
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

  housingSlider(e){
    this.props.housingSlider(e);
  }

  rentSlider(e){
    this.props.rentSlider(e);
  }

  bedroomSlider(e){
    this.props.bedroomSlider(e);
  }

  roomSlider(e){
    this.props.roomSlider(e);
  }

  bathSlider(e){
    this.props.bathSlider(e);
  }

  parkingSlider(e){
    this.props.parkingSlider(e);
  }

  laundrySlider(e){
    this.props.laundrySlider(e);
  }

  furnishedSlider(e){
    this.props.furnishedSlider(e);
  }

  catSlider(e){
    this.props.catSlider(e);
  }

  dogSlider(e){
    this.props.dogSlider(e);
  }

  smokingSlider(e){
    this.props.smokingSlider(e);
  }

  wheelchairSlider(e){
    this.props.wheelchairSlider(e);
  }

  render() {
    return (
      <div style={{height: '85vh'}}>

      <div style={{position: 'fixed', height: '85vh', borderRight: '1px solid #eee'}}>
        <div style={{height: '75vh', overflowY: 'scroll'}}>
          <div className={searchstyle.listDiv}>
            <Panel collapsible defaultExpanded header='Housing type ▾'>
              <ListGroup fill>
                <ListGroupItem style={{padding: '4px 10px'}}>
                  <ReactSimpleRange
                    max={10}
                    min={0}
                    label
                    name='housingImport'
                    onChange={this.housingSlider}
                    value={this.props.housingImport}
                  />
                </ListGroupItem>
                {this.props.housing_types.map((type, idx) => {
                  return <ListGroupItem key={idx} style={{padding: '4px 10px'}}>
                  <div>
                    <Checkbox inline key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
                  </div>
                  </ListGroupItem>
                })}
              </ListGroup>
            </Panel>
          </div>
          <div className={searchstyle.listDiv}>
            <Panel collapsible defaultExpanded={false} header='Rent ▾'>
              <ListGroup fill>
                <ListGroupItem style={{padding: '4px 10px'}}>
                  <FormControl style={{width: '70px', padding: '4px 10px', display: 'inline-block'}} name="minRent" type="number" placeholder="min" min="0" step={50} value={this.props.minRent} onChange={this.handleChange}/>
                  <FormControl style={{width: '70px', padding: '4px 10px', display: 'inline-block', marginLeft: '17px'}} name="maxRent" type="number" placeholder="max" min={this.props.minRent} step={50} value={this.props.maxRent} onChange={this.handleChange}/>
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='rentImport'
                    onChange={this.rentSlider}
                    value={this.props.rentImport}
                  />
                </ListGroupItem>
              </ListGroup>
            </Panel>
          </div>
          <div className={searchstyle.listDiv}>
            <Panel collapsible defaultExpanded={false} header='Bedrooms ▾'>
              <ListGroup fill>
                <ListGroupItem style={{padding: '4px 10px'}}>
                  <FormControl style={{width: '70px', padding: '4px 10px', display: 'inline-block'}} name="minBedrooms" type="number" placeholder="min" min="0" value={this.props.minBedrooms} onChange={this.handleChange}/>
                  <FormControl style={{width: '70px', padding: '4px 10px', display: 'inline-block', marginLeft: '17px'}} name="maxBedrooms" type="number" placeholder="max" min={this.props.minBedrooms} value={this.props.maxBedrooms} onChange={this.handleChange}/>
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='bedroomsImport'
                    onChange={this.bedroomSlider}
                    value={this.props.bedroomsImport}
                  />
                </ListGroupItem>
              </ListGroup>
            </Panel>
          </div>
          <div className={searchstyle.listDiv}>
            <Panel collapsible defaultExpanded={false} header='Private room ▾'>
              <ListGroup fill>
                <ListGroupItem style={{padding: '4px 10px'}}>
                  {this.props.private_room_types.map((type, idx) => {
                    return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='roomImport'
                    onChange={this.roomSlider}
                    value={this.props.roomImport}
                  />
                </ListGroupItem>
              </ListGroup>
            </Panel>
          </div>
          <div className={searchstyle.listDiv}>
            <Panel collapsible defaultExpanded={false} header='Private bath ▾'>
              <ListGroup fill>
                <ListGroupItem style={{padding: '4px 10px'}}>
                  {this.props.bath_types.map((type, idx) => {
                    return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='bathImport'
                    onChange={this.bathSlider}
                    value={this.props.bathImport}
                  />
                </ListGroupItem>
              </ListGroup>
            </Panel>
          </div>
          <div className={searchstyle.listDiv}>
            <Panel collapsible defaultExpanded={false} header="Parking ▾">
              <ListGroup fill>
                <ListGroupItem style={{padding: '4px 10px'}}>>
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='parkingImport'
                    onChange={this.parkingSlider}
                    value={this.props.parkingImport}
                  />
                </ListGroupItem>
                {this.props.parking_types.map((type, idx) => {
                  return <ListGroupItem key={idx} style={{padding: '4px 10px'}}>
                  <div>
                    <Checkbox inline key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
                  </div>
                </ListGroupItem>
              })}
              </ListGroup>
            </Panel>
          </div>
          <div className={searchstyle.listDiv}>
            <Panel collapsible defaultExpanded={false} header="Laundry ▾">
              <ListGroup fill>
                <ListGroupItem style={{padding: '4px 10px'}}>
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='laundryImport'
                    onChange={this.laundrySlider}
                    value={this.props.laundryImport}
                  />
                </ListGroupItem>
                {this.props.laundry_types.map((type, idx) => {
                  return <ListGroupItem key={idx} style={{padding: '4px 10px'}}>
                    <div>
                      <Checkbox inline key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
                    </div>
                  </ListGroupItem>
                })}
              </ListGroup>
            </Panel>
          </div>
          <div className={searchstyle.listDiv}>
            <Panel collapsible defaultExpanded={false} header='Misc ▾'>
              <ListGroup fill>
                <ListGroupItem style={{padding: '4px 10px'}}>
                  {this.props.furnished_types.map((type, idx) => {
                    return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='furnishedImport'
                    onChange={this.furnishedSlider}
                    value={this.props.furnishedImport}
                  />
                </ListGroupItem>
                <ListGroupItem  style={{padding: '4px 10px'}}>
                  {this.props.cat_types.map((type, idx) => {
                    return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='catImport'
                    onChange={this.catSlider}
                    value={this.props.catImport}
                  />
                </ListGroupItem>
                <ListGroupItem  style={{padding: '4px 10px'}}>
                  {this.props.dog_types.map((type, idx) => {
                    return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='dogImport'
                    onChange={this.dogSlider}
                    value={this.props.dogImport}
                  />
                </ListGroupItem>
                <ListGroupItem  style={{padding: '4px 10px'}}>
                  {this.props.smoking_types.map((type, idx) => {
                    return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='smokingImport'
                    onChange={this.smokingSlider}
                    value={this.props.smokingImport}
                  />
                </ListGroupItem>
                <ListGroupItem  style={{padding: '4px 10px'}}>
                </ListGroupItem>
                <ListGroupItem  style={{padding: '4px 10px'}}>
                  {this.props.wheelchair_types.map((type, idx) => {
                    return <Checkbox type="checkbox" key={idx} checked={this.props[type]} onChange={this.handleChbox.bind(this.type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='wheelchairImport'
                    onChange={this.wheelchairSlider}
                    value={this.props.wheelchairImport}
                  />
                </ListGroupItem>
              </ListGroup>
            </Panel>
          </div>
        </div>
        <div style={{borderTop: '1px #eee solid'}}>
          <div style={{height: '20px', backgroundColor: 'white'}}>
          </div>
          <div className={searchstyle.listDiv} style={{width: '180px', padding: '5px', display: 'inline-block', display: 'inline-flex', flexDirection: 'row', backgroundColor: '#28363d'}}
          >
            <MdBackup style={{alignSelf: 'flex-end', margin: '0px 5px', padding: '0px 0px 12px 0px'}} width="48" fill="hsl(200, 50%, 50%)" height="48"
            />
            <div style={{display: 'inline-block', margin: '10px 0px 0px 2px', color: 'hsl(200, 50%, 50%)'}}>
              <p style={{fontWeight: '500'}}>Save these settings to your account</p>
            </div>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
    );
  }
}