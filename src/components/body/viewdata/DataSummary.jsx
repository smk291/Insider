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

export default class DataSummary extends React.Component {
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

  avgs(){
    this.props.avgs();
  }

  render(){
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


    return(
      <div>

      <Grid className={dataviews.dashboard} fluid>
        <Row>
          <Col sm={12} md={12}>
            <div className={dataviews.dashboardHeader}>
              <h2></h2>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4}>
            <div className={dataviews.leftInfo}>
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
            <div className={dataviews.charts}>
              CHARTS
              <p>rent (x), no. of apts -- lump?</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12}>
            <div className={dataviews.dashboardFooter}>
              <h2>Housing data at a glance</h2>
            </div>
          </Col>
        </Row>
      </Grid>
    </div>
    )
  }
}

/* <div>
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
wheelchair_types = ['wheelchair accessible']; */
// </div>
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
