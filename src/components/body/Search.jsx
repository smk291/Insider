import React from 'react'
import ReactDOM from 'react-dom';
import {render} from 'react-dom'
import ReactSimpleRange from 'react-simple-range';
import {Button, HelpBlock, ButtonGroup, FormGroup, ControlLabel, FormControl, Grid, Tooltip, Row, Col, Tab, Checkbox, Panel, ListGroup, ListGroupItem, Accordion, PanelGroup, Tabs} from 'react-bootstrap'
import main2 from './main2.css'
import ListingsView from './ListingsView'
import humanize from 'underscore.string/humanize'
import searchstyle from './searchstyle'
import InlineSVG from 'svg-inline-react'
import MdBackup from 'react-icons/lib/md/backup'
import {Chart} from 'react-google-charts'
import ViewAd from './ViewAd'
import ListingsViewFiltered from './ListingsViewFiltered'

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
    //
    // const typesAndPrefs = [
    //   ['bedroomsRange', 'bedroomsImport', ['minBedrooms', 'maxBedrooms']],
    //   ['rentRange', 'rentImport', ['minRent', 'maxRent']],
    //   ['housing_types', 'housingImport', ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage', 'cabin']],
    //   ['laundry_types', 'laundryImport', ['laundry on site', 'w/d in unit', 'laundry in bldg']],
    //   ['parking_types', 'parkingImport', ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking']],
    //   ['bath_types', 'bathImport', ['private bath', 'no private bath']],
    //   ['private_room_types', 'roomImport', ['private room', 'room not private']],
    //   ['cat_types', 'catImport', ['cats are OK - purrr']],
    //   ['dog_types', 'dogImport', ['dogs are OK - wooof']],
    //   ['furnished_types', 'furnishedImport', ['furnished']],
    //   ['smoking_types', 'smokingImport', ['no smoking']],
    //   ['wheelchair_types', 'wheelchairImport', ['wheelchair accessible']],
    // ]


    // 1. Before looping through the listings,
      // Store listings in a new variable

      // Loop through the values of each importance category
      // let maxScore = 0
      // maxScore = typesAndPrefs.reduce((acc, pref, idx) => {
      //   return acc + this.props[pref[1]]
      // }, 0);
        // sum them
        // store that value in state(?)
    // 2. Loop through every option and remove those whose state is false

    // 2. Loop through listings
    // let filteredList = [];
    // //
    // filteredList = listings.filter((el) => {
    //   el.score = 0;
    //
    //   if(el.bedrooms){
    //     let minBed = Number(this.props.minBedrooms);
    //     let maxBed = Number(this.props.maxBedrooms);
    //     let brs = Number(el.bedrooms.slice(0, el.bedrooms.indexOf('BR')));
    //
    //     if (brs >= minBed && brs <= maxBed){
    //       el.score += this.props.bedroomsImport;
    //     } else if (this.props.bedroomsImport === 10){
    //       return false;
    //     }
    //   } else if (this.props.strictMode === true) {
    //     return false;
    //   }
    // //
    //   if (el.price){
    //     let minRent = Number(this.props.minRent);
    //     let maxRent = Number(this.props.maxRent);
    //     let rent = Number(el.price);
    //
    //     if (rent >= minRent && rent <= maxRent){
    //       el.score += this.props.rentImport;
    //     } else if (this.props.rentImport === 10){
    //       return false;
    //     }
    //   } else if (this.props.strictMode === true) {
    //     return false;
    //   }
    //
    //   // for (let i = 2; i < filteredOptions.length; i++) {
    //   //   let listingValue = el[filteredOptions[i][0]];
    //   //   let acceptableValues = filteredOptions[i][2];
    //   //   let importValue = this.props[filteredOptions[i][1]];
    //   //
    //   //   if (listingValue && acceptableValues.indexOf(listingValue)){
    //   //     el.score += importValue;
    //   //   } else if (importValue === 10){
    //   //     return false;
    //   //   }
    //   // }

    //   return true;
    // });
    //
    // this.setState({filteredList})
    // console.log(this.props.listings);
    // console.log(this.props.filteredList);


    // console.log(filteredList);

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
    function DropdownGroup({header, name, onChange, value, items}){
        return(
          <Panel
            className={searchstyle.listDiv}
            collapsible
            header={header}>
              <ListGroup
                fill>
                <ListGroupItem
                  className={searchstyle.listGroupItem}>
                  <ReactSimpleRange
                    max={10}
                    min={0}
                    label
                    name={name}
                    onChange={onChange}
                    value={value}
                  />
                </ListGroupItem>
                <MappedOptions
                  items={items}/>
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

    return (
      <div style={{height: '85vh'}}>
        <div>
          <div>
            <Grid fluid>
              <Row>
                <Col sm={1} md={2}>
                  <Grid fluid>
                    <Row>
                      <Col className={searchstyle.sideMenu}>
                        <Grid fluid>
                          <Row>
                            <Col className={searchstyle.dropdowns}>
                              {/* {drowndowns} */}
                              <DropdownGroup
                                header='Housing type ▾'
                                name='housingImport'
                                onChange={this.housingSlider}
                                value={this.props.housingImport}
                                items={this.props.housing_types}
                              />

                                    <Panel style={{marginRight: '10px'}} className={searchstyle.listDiv} collapsible defaultExpanded={false} header='Rent ▾'>
                                      <Checkbox inline type="checkbox" checked={this.props.rentImportRequired} onChange={this.handleChbox.bind(this, 'rentImportRequired')}>Required?</Checkbox>
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
                                    <Panel style={{marginRight: '10px'}} className={searchstyle.listDiv} collapsible defaultExpanded={false} header='Bedrooms ▾'>
                                      <Checkbox inline type="checkbox" checked={this.props.bedroomsImportRequired} onChange={this.handleChbox.bind(this, 'bedroomsImportRequired')}>Required?</Checkbox>
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
                                    <Panel style={{marginRight: '10px'}} className={searchstyle.listDiv} collapsible defaultExpanded={false} header='Private room ▾'>
                                      <Checkbox inline type="checkbox" checked={this.props.roomImportRequired} onChange={this.handleChbox.bind(this, 'roomImportRequired')}>Required?</Checkbox>
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
                                    <Panel style={{marginRight: '10px'}} className={searchstyle.listDiv} collapsible defaultExpanded={false} header='Private bath ▾'>
                                      <Checkbox inline type="checkbox" checked={this.props.bathImportRequired} onChange={this.handleChbox.bind(this, 'bathImportRequired')}>Required?</Checkbox>
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
                                    <Panel style={{marginRight: '10px'}} className={searchstyle.listDiv} collapsible defaultExpanded={false} header="Parking ▾">
                                      <Checkbox inline type="checkbox" checked={this.props.parkingImportRequired} onChange={this.handleChbox.bind(this, 'parkingImportRequired')}>Required?</Checkbox>
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
                                            <Checkbox inline key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
                                        </ListGroupItem>
                                        })}
                                      </ListGroup>
                                    </Panel>
                                    <Panel style={{marginRight: '10px'}} className={searchstyle.listDiv} collapsible defaultExpanded={false} header="Laundry ▾">
                                      <Checkbox inline type="checkbox" checked={this.props.laundryImportRequired} onChange={this.handleChbox.bind(this, 'laundryImportRequired')}>Required?</Checkbox>
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
                                              <Checkbox inline key={idx} type="checkbox" checked={this.props[type]} onChange={this.handleChbox.bind(this, type)}>{humanize(type)}</Checkbox>
                                          </ListGroupItem>
                                        })}
                                      </ListGroup>
                                    </Panel>
                                    <Panel style={{marginRight: '10px'}} className={searchstyle.listDiv} collapsible defaultExpanded={false} header='Misc ▾'>
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
                                          <Checkbox inline type="checkbox" checked={this.props.furnishedImportRequired} onChange={this.handleChbox.bind(this, 'furnishedImportRequired')}>Required?</Checkbox>
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
                                          <Checkbox inline type="checkbox" checked={this.props.catImportRequired} onChange={this.handleChbox.bind(this, 'catImportRequired')}>Required?</Checkbox>
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
                                          <Checkbox inline type="checkbox" checked={this.props.dogImportRequired} onChange={this.handleChbox.bind(this, 'dogImportRequired')}>Required?</Checkbox>
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
                                          <Checkbox inline type="checkbox" checked={this.props.smokingImportRequired} onChange={this.handleChbox.bind(this, 'smokingImportRequired')}>Required?</Checkbox>
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
                                        <Checkbox inline type="checkbox" checked={this.props.wheelchairImportRequired} onChange={this.handleChbox.bind(this, 'wheelchairImportRequired')}>Required?</Checkbox>
                                        </ListGroupItem>
                                      </ListGroup>
                                    </Panel>
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
                  <Tabs style={{fontWeight: '500', fontSize: '16pt'}}  defaultActiveKey={1} id="placeholder1">
                    <Tab eventKey={1} title='Housing data at a glance'>
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
                              <p>Currently you're browsing {listings.length} listings.</p>
                              <p>Average rent for an apartment is ${rentAvg.toFixed(2)}</p>
                              <p>Average rent for a 0BR is ${rent0brAvg.toFixed(2)}</p>
                              <p>Average rent for a 1BR is ${rent1brAvg.toFixed(2)}</p>
                              <p>Average rent for a 2BR is ${rent2brAvg.toFixed(2)}</p>
                              <p>Average rent for a 3BR is ${rent3brAvg.toFixed(2)}</p>
                              <p>Average rent for a 4BR is ${rent4brAvg.toFixed(2)}</p>
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
                    <Tab eventKey={2} title="Browse all listings">
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
                    <Tab eventKey={3} title="Browse filtered / sorted listings">
                      <Grid fluid>
                        <Row>
                          <Col md={12}>
                            <ListingsViewFiltered
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