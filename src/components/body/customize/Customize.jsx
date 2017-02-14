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

export default class Customize extends React.Component {
  constructor(props) {
    super(props);
  }

  filterListings() {
    this.props.filterListings();
  }

  render() {
    const bedrooms = this.props.bedrooms;
    const rent = this.props.rent;
    const housing = this.props.housing;
    const laundry = this.props.laundry;
    const parking = this.props.parking;
    const bath = this.props.bath;
    const privateRoom = this.props.privateRoom;
    const cats = this.props.cats;
    const dog = this.props.dog;
    const furnished = this.props.furnished;
    const smoking = this.props.smoking;
    const wheelchair = this.props.wheelchair;

    return(
      <div style={{height: '88vh', overflowY: 'scroll'}}>
        <div>
          {/* <div className={dataviews.scratch}>
            <p>For numeric ranges, create sloping line graph</p>
            <p>For categoric graphs, use bars</p>
            <p>When user changes parameter, original graph should turn 'inactive' color</p>
            <p>New graph will have active color</p>
            <p>On numeric ranges, user should be able to click and drag to limit range</p>
            <p>On categoric ranges, user should be able to click bars themselves</p>
            <p> Tasks </p>
            <p> Get data for each </p>
          </div> */}
          <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>Bedrooms</p>
            <p>bedroomsRange</p>
            <p>minBedrooms</p>
            <p>maxBedrooms</p>
            <p>importance</p>
            <p>required</p>
            <div className={dataviews.scratch}>
              <p>Min bedrooms: {bedrooms.options.minBedrooms}</p>
              <p>Max bedrooms: {bedrooms.options.maxBedrooms}</p>
              <p>Importance: {bedrooms.prefs.importance}</p>
              <p>Required: {JSON.stringify(bedrooms.prefs.required)}</p>
              <p>Function to count bedrooms in listings</p>
            </div>

          </div>
          {/* <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>rentRange</p>
            <p>minRent </p>
            <p>maxRent</p>
            <p>importance</p>
            <p>required</p>
            </div>
            <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>'housing'</p>
            <p>apartment: true, </p>
            <p>condo: true, </p>
            <p>house: true, </p>
            <p>townhouse: true, </p>
            <p>duplex: true, </p>
            <p>land: true, </p>
            <p>'in-law': true, </p>
            <p>cottage: true, </p>
            <p>cabin: true, </p>
            <p>importance</p>
            <p>required</p>
            </div>
            <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>'laundry'</p>
            <p>'laundry on site': true, </p>
            <p>'w/d in unit': true, </p>
            <p>'laundry in bldg': true,</p>
            <p>importance</p>
            <p>required</p>
            </div>
            <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>'parking'</p>
            <p>'off-street parking': true,</p>
            <p>'detached garage': true,</p>
            <p>'attached garage': true,</p>
            <p>'valet parking': true,</p>
            <p>'street parking': true,</p>
            <p>'carport': true,</p>
            <p>'no parking': true,</p>
            <p>importance</p>
            <p>required</p>
            </div>
            <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>'bath'</p>
            <p>'private bath': true,</p>
            <p>'no private bath': true,</p>
            <p>importance</p>
            <p>required</p>
            </div>
            <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>'private_room'</p>
            <p>'private room': true,</p>
            <p>'room not private': true,</p>
            <p>importance</p>
            <p>required</p>
            </div>
            <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>'cat'</p>
            <p>'cats are OK - purrr': true,</p>
            <p>importance</p>
            <p>required</p>
            </div>
            <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>'dog'</p>
            <p>'dogs are OK - wooof': true,</p>
            <p>importance</p>
            <p>required</p>
            </div>
            <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>'furnished'</p>
            <p>'furnished': true,</p>
            <p>importance</p>
            <p>required</p>
            </div>
            <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>'smoking'</p>
            <p>'no smoking': true,</p>
            <p>importance</p>
            <p>required</p>
            </div>
            <div className={dataviews.scratch}>
            <p>Graph</p>
            <p>'wheelchair'</p>
            <p>'wheelchair accessible': true,</p>
            <p>importance</p>
            <p>required</p>
          </div> */}
          <div className={dataviews.scratch}>
            {/*<p>{JSON.stringify(this.props.searchParams)}</p>*/}
          </div>
        </div>
    </div>
    )
  }
}
