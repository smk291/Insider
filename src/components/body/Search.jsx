import React from 'react'
import ReactDOM from 'react-dom';
import {render} from 'react-dom'
import ReactSimpleRange from 'react-simple-range';
import {Button, HelpBlock, ButtonGroup, FormGroup, ControlLabel, FormControl, Grid, Tooltip, Row, Col, Tab, Checkbox, Panel, ListGroup, ListGroupItem, Accordion, PanelGroup, Tabs} from 'react-bootstrap'
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
import {Chart} from 'react-google-charts'
import ViewAd from './ViewAd'


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
    this.scrapeList = this.scrapeList.bind(this);
    this.scrapeRows = this.scrapeRows.bind(this);
    this.scrapeNull = this.scrapeNull.bind(this);
    this.getListings = this.getListings.bind(this);
    this.state={
      options:{
        title: 'Age vs. Weight comparison',
        hAxis: {title: 'Age', minValue: 0, maxValue: 15},
        vAxis: {title: 'Weight', minValue: 0, maxValue: 15},
        legend: 'none'
      },
      data:[
        ['Age', 'Weight'],
        [ 8,      12],
        [ 4,      5.5],
        [ 11,     14],
        [ 4,      5],
        [ 3,      3.5],
        [ 6.5,    7]
      ],
      adToView: {}
    }
  }

  scrapeList(e){
    this.props.scrapeList(e);
  }

  scrapeRows(e){
    this.props.scrapeRows(e);
  }

  scrapeNull(e){
    this.props.scrapeNull(e);
  }

  getListings(e){
    this.props.getListings(e);
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

  avgs(){
    this.props.avgs();
  }

  getListings(e){
    this.props.getListings(e);
  }

  render() {
    const listings = this.props.listings;

    let brSums = {
      'BR0': [],
      'BR1': [],
      'BR2': [],
      'BR3': [],
      'BR4': [],
      'BR5': []
    }

    function avgRent(list){
      let sum = 0;
      let exceptions = 0;
      sum = list.reduce((acc, el) => {
        if (el.price < 6000){
          return acc + el.price;
        }

        exceptions++;
        return acc;
      }, 0)

      return sum / (list.length - exceptions);
    }

    function avgbrs(list, br){
      let accum = [];
      let count = 0;

      accum = list.reduce((acc, el) => {
        if (el.bedrooms === br && el.price < 6000){
          acc[0] += el.price;
          acc[1].count++;
          count++;
          return acc;
        }
        return acc;
      }, [0, {count: 0}])

      brSums[br] = accum;
      return accum[0] / accum[1].count;
    }

    let rentAvg = avgRent(listings);
    let rent0brAvg = avgbrs(listings, '0BR');
    let rent1brAvg = avgbrs(listings, '1BR');
    let rent2brAvg = avgbrs(listings, '2BR');
    let rent3brAvg = avgbrs(listings, '3BR');
    let rent4brAvg = avgbrs(listings, '4BR');

    const prefs = {
      'bedroomsImport': 'bedroomRange',
      'rentImport': 'rentRange',
      'housingImport': 'housing_types',
      'laundryImport': 'laundry_types',
      'parkingImport': 'parking_types',
      'bathImport': 'bath_types',
      'roomImport': 'room_types',
      'catImport': 'cat_types',
      'dogImport': 'dog_types',
      'furnishedImport': 'furnished_types',
      'smokingImport': 'smoking_types',
      'wheelchairImport': 'wheelchair_types',
    }

    const prefsReversed = {
      'bedroomRange': 'bedroomsImport',
      'rentRange': 'rentImport',
      'housing_types': 'housingImport',
      'laundry_types': 'laundryImport',
      'parking_types': 'parkingImport',
      'bath_types': 'bathImport',
      'room_types': 'roomImport',
      'cat_types': 'catImport',
      'dog_types': 'dogImport',
      'furnished_types': 'furnishedImport',
      'smoking_types': 'smokingImport',
      'wheelchair_types': 'wheelchairImport'
    }

    const rentRange = ['minRent', 'maxRent'];
    const bedroomRange = ['minBedrooms', 'maxBedrooms'];
    const housing_types = ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage', 'cabin'];
    const laundry_types = ['laundry on site', 'w/d in unit', 'laundry in bldg'];
    const parking_types = ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking'];
    const bath_types = ['private bath', 'no private bath'];
    const private_room_types = ['private room', 'room not private'];
    const cat_types = ['cats are OK - purrr'];
    const dog_types = ['dogs are OK - wooof'];
    const furnished_types = ['furnished'];
    const smoking_types = ['no smoking'];
    const wheelchair_types = ['wheelchair accessible'];

    // rentRange, bedroomRange,

    let options = [housing_types, laundry_types, parking_types, bath_types, private_room_types, cat_types, dog_types, furnished_types, smoking_types, wheelchair_types]
    let optionsObj = [housing_types, laundry_types, parking_types, bath_types, private_room_types, cat_types, dog_types, furnished_types, smoking_types, wheelchair_types]

    // 1. Before looping through the listings,
      // Store listings in a new variable

      // Loop through the values of each importance category
      let maxScore = 0
      maxScore = Object.keys(prefs).reduce((acc, key, idx) => {
        // console.log(key);
        // console.log(this.props[key]);
        return acc + this.props[key]
      }, 0);
      // console.log(maxScore);
        // sum them
        // store that value in state(?)
    // 2. Loop through every option and remove those whose state is false
      let filteredOptions = [];

      filteredOptions = options.map((type) => {
        return type.filter((option) => {
          return this.props[option]
        })
      });

      console.log(filteredOptions);
    // 2. Loop through listings
    let filteredList = [];

    // filteredList = listings.map((el) => {
      Object.keys(options)
      // .map((el) => {
      //   console.log(el);
      // })
    // });

    console.log(filteredList);

      // Determine whether listing meets criteria
        // Do that as follows

    // 3. If it meets criteria, add its importance value to the listing's import metric
      // 3a. If it doesn't, then
        // 3b If the import value is 10
          // Filter out that listing
    // Repeat steps (loop and check) 2-3 for all criteria
    // Important values: importance, meeting criteria
    // What to do:
      // If meets criteria, add import number to listing's import number


    return (
      <div style={{height: '85vh'}}>
        <div>
          <div>
            <Grid fluid>
              <Row>
                <Col sm={12} md={2}>
                  <Grid fluid>
                    <Row>
                      <Col style={{mimWidth: '170px', height: '83vh', borderRight: '1px solid #eee'}}>
                        <Grid fluid>
                          <Row>
                            <Col style={{height: '70vh', overflowY: 'scroll'}}>
                                  <div>
                                    <Panel style={{marginRight: '10px'}}className={searchstyle.listDiv} collapsible defaultExpanded header='Housing type ▾'>
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
                                  <div>
                                    <Panel style={{marginRight: '10px'}}className={searchstyle.listDiv} collapsible defaultExpanded header='Rent ▾'>
                                      <ListGroup fill>
                                        <ListGroupItem style={{padding: '4px 10px'}}>
                                          <FormControl style={{width: '64px', padding: '4px 10px', display: 'inline-block'}} name="minRent" type="number" placeholder="min" min="0" step={50} value={this.props.minRent} onChange={this.handleChange}/>
                                          <FormControl style={{width: '64px', padding: '4px 10px', display: 'inline-block'}} name="maxRent" type="number" placeholder="max" min={this.props.minRent} step={50} value={this.props.maxRent} onChange={this.handleChange}/>
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
                                  <div>
                                    <Panel style={{marginRight: '10px'}}className={searchstyle.listDiv} collapsible defaultExpanded={false} header='Bedrooms ▾'>
                                      <ListGroup fill>
                                        <ListGroupItem style={{padding: '4px 10px'}}>
                                          <FormControl style={{width: '64px', padding: '4px 10px', display: 'inline-block'}} name="minBedrooms" type="number" placeholder="min" min="0" value={this.props.minBedrooms} onChange={this.handleChange}/>
                                          <FormControl style={{width: '64px', padding: '4px 10px', display: 'inline-block'}} name="maxBedrooms" type="number" placeholder="max" min={this.props.minBedrooms} value={this.props.maxBedrooms} onChange={this.handleChange}/>
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
                                  <div>
                                    <Panel style={{marginRight: '10px'}}className={searchstyle.listDiv} collapsible defaultExpanded={false} header='Private room ▾'>
                                      <ListGroup fill>
                                        <ListGroupItem style={{padding: '4px 10px'}}>
                                          {this.props.private_room_types.map((type, idx) => {
                                            return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
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
                                  <div>
                                    <Panel style={{marginRight: '10px'}}className={searchstyle.listDiv} collapsible defaultExpanded={false} header='Private bath ▾'>
                                      <ListGroup fill>
                                        <ListGroupItem style={{padding: '4px 10px'}}>
                                          {this.props.bath_types.map((type, idx) => {
                                            return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
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
                                  <div>
                                    <Panel style={{marginRight: '10px'}}className={searchstyle.listDiv} collapsible defaultExpanded={false} header="Parking ▾">
                                      <ListGroup fill>
                                        <ListGroupItem style={{padding: '4px 10px'}}>
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
                                  <div>
                                    <Panel style={{marginRight: '10px'}}className={searchstyle.listDiv} collapsible defaultExpanded={false} header="Laundry ▾">
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
                                  <div>
                                    <Panel style={{marginRight: '10px'}}className={searchstyle.listDiv} collapsible defaultExpanded={false} header='Misc ▾'>
                                      <ListGroup fill>
                                        <ListGroupItem style={{padding: '4px 10px'}}>
                                          {this.props.furnished_types.map((type, idx) => {
                                            return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
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
                                            return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
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
                                            return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
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
                                            return <Checkbox key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
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
                                            return <Checkbox type="checkbox" key={idx} checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
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
                            </Col>
                          </Row>
                          <Row>
                            <div className={searchstyle.listDiv} style={{borderTop: '1px #eee solid'}}>
                              <div style={{height: '20px', backgroundColor: 'white'}}>
                              </div>
                              <div className={searchstyle.saveSettings}>
                                <MdBackup style={{alignSelf: 'flex-end', margin: '0px 5px', padding: '0px 0px 12px 0px'}} width="48" fill="hsl(200, 50%, 50%)" height="48"
                                />
                                <div style={{display: 'inline-block', margin: '10px 0px 0px 2px', color: 'hsl(200, 50%, 50%)'}}>
                                  <p style={{fontWeight: '500'}}>Save settings</p>
                                </div>
                              </div>
                              <div style={{height: '20px', backgroundColor: 'white'}}>
                              </div>
                            </div>
                          </Row>
                        </Grid>

                      </Col>
                    </Row>
                  </Grid>

                </Col>
                <Col sm={12} md={10}>
                  <Tabs defaultActiveKey={2} id="placeholder1">
                    <Tab eventKey={1} title="Housing data at a glance">
                      <Grid className={searchstyle.dashboard} fluid>
                        <Row>
                          <Col sm={12} md={12}>
                            <div className={searchstyle.dashboardHeader}>
                              <h2></h2>
                            </div>

                          </Col>
                        </Row>
                        <Row>
                          <Col sm={12} md={4}>
                              <div className={searchstyle.leftInfo}>
                                <p>Info</p>
                                <p>Average rents</p>
                                <p>Averages after filtering</p>
                                <p>Filtering</p>
                                <p>Number of places that specify a particular option or don't</p>
                                <p>Standard deviation</p>
                              </div>

                          </Col>
                          <Col sm={12} md={8}>
                            <div className={searchstyle.charts}>
                              CHARTS
                              <p>rent (x), no. of apts -- lump?</p>
                            </div>

                          </Col>
                        </Row>
                        <Row>
                          <Col sm={12} md={12}>

                            <div className={searchstyle.dashboardFooter}>
                              <h2>Housing data at a glance</h2>
                            </div>
                          </Col>
                        </Row>
                      </Grid>
                    </Tab>
                    <Tab eventKey={2} title="Browse filtered / sorted listings">
                      <Button onClick={this.getListings}>get listings</Button>
                      <Grid fluid>
                        <Row>
                          <Col md={12}>
                            <ListingsView
                              {...this.props}
                            />
                          </Col>
                        </Row>
                      </Grid>
                    </Tab>
                    {/* <Tab eventKey={3} title="Tab 3" disabled>Tab 3 content</Tab> */}
                  </Tabs>
                </Col>
              </Row>
            </Grid>
            </div>
          </div>
            {/* <div>
            <p>stats</p>
            <p>charts</p>
            housing_types = ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage', 'cabin'];
            laundry_types = ['laundry on site', 'w/d in unit', 'laundry in bldg'];
            parking_types = ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking'];
            bath_types = ['private bath', 'no private bath'];
            private_room_types = ['private room', 'room not private'];
            cat_types = ['cats are OK - purrr'];
            dog_types = ['dogs are OK - wooof'];
            furnished_types = ['furnished'];
            smoking_types = ['no smoking'];
            wheelchair_types = ['wheelchair accessible']; */}
          </div>
          /* {this.props.listings.length > 0 ?
            <div>
              <p>Currently you're browsing {listings.length} listings.</p>
              <p>You've filtered out [ ].</p>
              <p>That leaves [ ].</p>
              <p>Average rent for an apartment is ${rentAvg.toFixed(2)}</p>
              <p>Average rent for a 0BR is ${rent0brAvg.toFixed(2)}</p>
              <p>Average rent for a 1BR is ${rent1brAvg.toFixed(2)}</p>
              <p>Average rent for a 2BR is ${rent2brAvg.toFixed(2)}</p>
              <p>Average rent for a 3BR is ${rent3brAvg.toFixed(2)}</p>
              <p>Average rent for a 4BR is ${rent4brAvg.toFixed(2)}</p>
            </div> : <div></div>} */
          // <div>

            /* <Chart
              chartType="ScatterChart"
              data={this.state.data}
              options={this.state.options}
              graph_id="ScatterChart"
              width="100%"
              height="400px"
              legend_toggle
            /> */
          // </div>
    );
  }
}