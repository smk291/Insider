// <editor-fold> import
import React from 'react'
import ReactDOM from 'react-dom';
import {render} from 'react-dom'
import ReactSimpleRange from 'react-simple-range';
import {Button, HelpBlock, ButtonGroup, FormGroup, ControlLabel, FormControl, Grid, Tooltip, Row, Col, Tab, Checkbox, Panel, ListGroup, ListGroupItem, Accordion, PanelGroup, Tabs} from 'react-bootstrap'
import primary from '../primary.css'
import humanize from 'underscore.string/humanize'
import dataviews from '../dataviews'
import InlineSVG from 'svg-inline-react'
import MdBackup from 'react-icons/lib/md/backup'

// </editor-fold>

export default class FilterData extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.handleChbox = this.handleChbox.bind(this)
    this.handleSlider = this.handleSlider.bind(this)
  }

  //<editor-fold> handle changes
  handleSlider(e, field){
    this.props.handleSlider(e, field)
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
  // </editor-fold>

  lineGraphData (){
    let accums = {};

    this.props.listings.map((el) => {
      let rent = el.price
      let roundedValue = 0;

      if (rent){
        roundedValue = Math.round(Number(rent.slice(1)) / 100) * 100;
      }

      if (rent && !accums[roundedValue]){
        accums[roundedValue] = 1;
      } else {
        accums[roundedValue]++;
      }
    })

    console.log(accums);
  }


  render(){
    // <editor-fold> composables
    const DropdownGroup = ({header, name, onChange, value, items, propsRequired, required}) => {
      return(
        <Panel
          collapsible
          className={dataviews.listDiv} header={header}>
          <ListGroup fill>
            <Checkbox inline type="checkbox"
              checked={propsRequired} onChange={this.handleChbox.bind(this, required)}>Required?</Checkbox>
            <ListGroupItem
              className={dataviews.listGroupItem}>
            </ListGroupItem>
            <MappedOptions items={items}/>
          </ListGroup>
        </Panel>
      );
    }

    const MappedOptions = ({items}) => {
      return(
        <div>
          {items.map((type, idx) => {
          return <ListGroupItem
            key={idx}
            style={{padding: '4px 10px'}}>
            <Checkbox
              inline
              key={idx}
              type="checkbox"
              checked={this.props[type]}
              onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
          </ListGroupItem>
        })}
      </div>
      )
    }
    // </editor-fold>

    return(
      <div style={{height: '88vh', overflowY: 'scroll'}}>
        <h3>Set options below</h3>
        <Grid fluid>
        <Row>
          <Col
            className={dataviews.dropdowns}>
            <DropdownGroup
              header='Housing type ▾'
              items={this.props.housing_types}
              propsRequired={this.props.housingImportRequired}
              required='housingImportRequired'
            />
            <ReactSimpleRange style={{padding: '4px 10px'}}
              max={10}
              min={0}
              name='housingImport'
              onChange={this.handleSlider.bind(this, 'housingImport')}
              value={this.props.housingImport}/>
            <Panel
              style={{marginRight: '10px'}}
              className={dataviews.listDiv}
              collapsible
              defaultExpanded={false}
              header='Rent ▾'>
              <Checkbox
                inline
                type="checkbox"
                checked={this.props.rentImportRequired}
                onChange={this.handleChbox.bind(this, 'rentImportRequired')}>Required?</Checkbox>
              <ListGroup fill>
                <ListGroupItem
                  style={{padding: '4px 10px'}}>
                  <FormControl
                    style={{width: '64px', padding: '4px 10px', display: 'inline-block'}}
                    name="minRent"
                    type="number"
                    placeholder="min"
                    min={0}
                    step={50}
                    value={this.props.minRent}
                    onChange={this.handleChange}/>
                  <FormControl
                    style={{width: '64px', padding: '4px 10px', display: 'inline-block'}}
                    name="maxRent"
                    type="number"
                    placeholder="max"
                    min={this.props.minRent}
                    step={50}
                    value={this.props.maxRent}
                    onChange={this.handleChange}/>
                  <ReactSimpleRange
                    style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='rentImport'
                    onChange={this.handleSlider.bind(this, 'rentImport')}
                    value={this.props.rentImport}
                  />
                </ListGroupItem>
              </ListGroup>
            </Panel>
            <Panel
              style={{marginRight: '10px'}}
              className={dataviews.listDiv}
              collapsible
              defaultExpanded={false}
              header='Bedrooms ▾'>
              <Checkbox inline type="checkbox"
                checked={this.props.bedroomsImportRequired} onChange={this.handleChbox.bind(this, 'bedroomsImportRequired')}>Required?</Checkbox>
              <ListGroup fill>
                <ListGroupItem
                  style={{padding: '4px 10px'}}>
                  <FormControl
                    style={{width: '64px', padding: '4px 10px', display: 'inline-block'}}
                    name="minBedrooms"
                    type="number"
                    placeholder="min"
                    min={0}
                    value={this.props.minBedrooms}
                    onChange={this.handleChange}/>
                  <FormControl
                    style={{width: '64px', padding: '4px 10px', display: 'inline-block'}} name="maxBedrooms"
                    type="number"
                    placeholder="max"
                    min={this.props.minBedrooms}
                    value={this.props.maxBedrooms}
                    onChange={this.handleChange}/>
                  <ReactSimpleRange
                    style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='bedroomsImport'
                    onChange={this.handleSlider.bind(this, 'bedroomsImport')}
                    value={this.props.bedroomsImport}
                  />
                </ListGroupItem>
              </ListGroup>
            </Panel>

            <DropdownGroup
              header='Private room ▾'
              items={this.props.private_room_types}
              propsRequired={this.props.roomImportRequired}
              required='roomImportRequired'
              collapsible
              defaultExpanded={false}
            />
            <ReactSimpleRange
              style={{padding: '4px 10px'}}
              max={10}
              min={0}
              name='housingImport'
              onChange={this.handleSlider.bind(this, 'housingImport')}
              value={this.props.roomImport}
              collapsible
              defaultExpanded={false}
            />
            <DropdownGroup
              header='Private bath ▾'
              items={this.props.bath_types}
              propsRequired={this.props.bathImportRequired}
              required='bathImportRequired'
              collapsible
              defaultExpanded={false}
            />
            <ReactSimpleRange
              style={{padding: '4px 10px'}}
              max={10}
              min={0}
              name='bathImport'
              onChange={this.handleSlider.bind(this, 'bathImport')}
              value={this.props.bathImport}
            />

            <DropdownGroup
              header='Parking ▾'
              items={this.props.parking_types}
              propsRequired={this.props.parkingImportRequired}
              required='parkingImportRequired'
              collapsible
              defaultExpanded={false}
            />
            <ReactSimpleRange
              style={{padding: '4px 10px'}}
              max={10}
              min={0}
              name='parkingImport'
              onChange={this.handleSlider.bind(this, 'parkingImport')}
              value={this.props.parkingImport}
            />

            <DropdownGroup
              header='Laundry ▾'
              items={this.props.laundry_types}
              propsRequired={this.props.laundryImportRequired}
              required='laundryImportRequired'
              collapsible
              defaultExpanded={false}
            />
            <ReactSimpleRange
              style={{padding: '4px 10px'}}
              max={10}
              name='laundryImport'
              onChange={this.handleSlider.bind(this, 'laundryImport')}
              value={this.props.laundryImport}
              min={0}
            />

            <Panel
              style={{marginRight: '10px'}}
              className={dataviews.listDiv}
              collapsible
              defaultExpanded={false}
              header='Misc ▾'>
              <ListGroup fill>
                <ListGroupItem
                  style={{padding: '4px 10px'}}>
                  {this.props.furnished_types.map((type, idx) => {
                    return <Checkbox
                      key={idx} type="checkbox"
                      checked={this.props[type]}
                      onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange
                    style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='furnishedImport'
                    onChange={this.handleSlider.bind(this, 'furnishedImport')}
                    value={this.props.furnishedImport}
                  />
                  <Checkbox inline type="checkbox"
                    checked={this.props.furnishedImportRequired}
                    onChange={this.handleChbox.bind(this, 'furnishedImportRequired')}>Required?</Checkbox>
                </ListGroupItem>
                <ListGroupItem
                  style={{padding: '4px 10px'}}>
                  {this.props.cat_types.map((type, idx) => {
                    return <Checkbox
                      key={idx} type="checkbox"
                      checked={this.props[type]}
                      onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange
                    style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='catImport'
                    onChange={this.handleSlider.bind(this, 'catImport')}
                    value={this.props.catImport}
                  />
                  <Checkbox inline type="checkbox"
                    checked={this.props.catImportRequired}
                    onChange={this.handleChbox.bind(this, 'catImportRequired')}>Required?</Checkbox>
                </ListGroupItem>
                <ListGroupItem
                  style={{padding: '4px 10px'}}>
                  {this.props.dog_types.map((type, idx) => {
                    return <Checkbox
                      key={idx} type="checkbox"
                      checked={this.props[type]}
                      onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange
                    style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='dogImport'
                    onChange={this.handleSlider.bind(this, 'dogImport')}
                    value={this.props.dogImport}
                  />
                  <Checkbox inline type="checkbox"
                    checked={this.props.dogImportRequired}
                    onChange={this.handleChbox.bind(this, 'dogImportRequired')}>Required?</Checkbox>
                </ListGroupItem>
                <ListGroupItem
                  style={{padding: '4px 10px'}}>
                  {this.props.smoking_types.map((type, idx) => {
                    return <Checkbox
                      key={idx} type="checkbox"
                      checked={this.props[type]}
                      onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange
                    style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='smokingImport'
                    onChange={this.handleSlider.bind(this, 'smokingImport')}
                    value={this.props.smokingImport}
                  />
                  <Checkbox inline type="checkbox"
                    checked={this.props.smokingImportRequired}
                    onChange={this.handleChbox.bind(this, 'smokingImportRequired')}>Required?</Checkbox>
                </ListGroupItem>
                <ListGroupItem
                  style={{padding: '4px 10px'}}>
                  {this.props.wheelchair_types.map((type, idx) => {
                    return <Checkbox type="checkbox"
                      key={idx} checked={this.props[type]}
                      onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
                  })}
                  <ReactSimpleRange
                    style={{padding: '4px 10px'}}
                    max={10}
                    min={0}
                    label
                    name='wheelchairImport'
                    onChange={this.handleSlider.bind(this, 'wheelchairImport')}
                    value={this.props.wheelchairImport}
                  />
                <Checkbox inline type="checkbox"
                  checked={this.props.wheelchairImportRequired}
                  onChange={this.handleChbox.bind(this, 'wheelchairImportRequired')}>Required?</Checkbox>
                </ListGroupItem>
              </ListGroup>
            </Panel>
          </Col>
        </Row>
        <Row>
          <div
            className={dataviews.listDiv}
            style={{borderTop: '1px #eee solid'}}>
            <div
              style={{height: '20px', backgroundColor: 'white'}}>
            </div>
            {/* <div className={dataviews.saveSettings}>
              <MdBackup
                style={{alignSelf: 'flex-end', margin: '0px 5px', padding: '0px 0px 12px 0px'}} width="48" fill="hsl(200, 50%, 50%)" height="48"
              />
              <div style={{display: 'inline-block', margin: '10px 0px 0px 2px', color: 'hsl(200, 50%, 50%)'}}>
                <p style={{fontWeight: '500'}}>Save settings</p>
              </div>
            </div> */}
            <div
              style={{height: '20px', backgroundColor: 'white'}}>
            </div>
          </div>
        </Row>
      </Grid>
    </div>
    )
  }
}
