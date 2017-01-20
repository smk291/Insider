// <editor-fold
import React from 'react'
import {Button, Grid, Row, Col, Tooltip, Accordion, Panel, ListGroup, ListGroupItem, Table, Pager} from 'react-bootstrap'
import primary from '../primary.css'
import ListingHeader from './ListingHeader'
import humanize from 'underscore.string/humanize'
import titleize from 'underscore.string/titleize'
import { BootstrapTable, TableHeaderColumn, TableBody, TableHeader } from 'react-bootstrap-table'
import dataviews from '../dataviews.css'
import InlineSVG from 'svg-inline-react'
import MdDateRange from 'react-icons/lib/md/date-range'
import FaBed from 'react-icons/lib/fa/bed'
import MdInsertLink from 'react-icons/lib/md/insert-link'
import MdAttachMoney from 'react-icons/lib/md/attach-money'
import MdLocationCity from 'react-icons/lib/md/location-city'
import axios from 'axios'
import DisplayedAd from './DisplayedAd'
import MdSave from 'react-icons/lib/md/save'
// </editor-fold>

export default class DisplayAd extends React.Component {
  constructor(props){
    super(props)
    this.saveToFavorites = this.saveToFavorites.bind(this);
  }

  saveToFavorites(e){
    this.props.saveToFavorites(e);
  }

  render(){
    const el = this.props.displayAd;

    class DescrStreetAndWheelchairAcc extends React.Component {
      constructor(props) {
        super(props)
      }

      render(){
        return(
          <div >
            <Table striped bordered condensed hover>
              <tbody>
                <tr>
                  <td>Description:</td>
                  <td>{humanize(el.descr)}</td>
                </tr>
                <tr>
                  <td>Street address?</td>
                  <td>{el.street_address? humanize(el.street_address): <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>Wheelchair accessible?</td>
                  <td>{el.wheelchair_accessible ? humanize(el.wheelchair_accessible): <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        )
      }
    }

    class TableDetails extends React.Component {
      constructor(props) {
        super(props)
      }

      render(){
        return (
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <td>Type of housing:</td>
                <td>{el.housing_types
                    ? humanize(el.housing_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Square feet:</td>
                <td>{el.sqft
                    ? <span>{humanize(el.sqft)}ft<sup>2</sup></span>
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Private room?</td>
                <td>{el.private_room_types
                    ? humanize(el.private_room_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Private bath?</td>
                <td>{el.bath_types
                    ? humanize(el.bath_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Furnished?</td>
                <td>{el.furnished_type
                    ? humanize(el.furnished_type)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Laundry?</td>
                <td>{el.laundry_types
                    ? humanize(el.laundry_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Parking?</td>
                <td>{el.parking_types
                    ? humanize(el.parking_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
            </tbody>
          </Table>
        )
      }
    }

    class TablePhotos extends React.Component {
      constructor(props) {
        super(props)
      }

      render(){
        return (
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <td>How many photos?</td>
                <td>{el.photos && Object.keys(el.photos).length > 0
                    ? Object.keys(el.photos.photos).length
                    : <span className={dataviews.blank}>None</span>}</td>
              </tr>
            </tbody>
          </Table>
        )
      }
    }

    class DogsCatsAndSmoking extends React.Component {
      constructor(props){
        super(props)
      }

      render(){
        return(
          <div>
            <p>{el.cat_types
                ? humanize(el.cat_types)
                : ''}</p>
            <p>{el.dog_types
                ? humanize(el.dog_types)
                : ''}</p>
            <p>{el.smoking_types
                ? humanize(el.smoking_types)
                : ''}</p>
            <p>{!el.cat_types && !el.dog_types ? 'No information about whether cats or dogs are allowed' : ''}</p>
          </div>
        )
      }
    }

    let title = titleize(el.title);

    if (el.title.length > 55){
      title = titleize(el.title.slice(0,55) + `…`)
    };

    return(
      <div>
        <div style={{height: '722px'}} className = 'panel panel-default'>
          <div style={{margin: '0px 20px', padding: '20px 20px', height: '640px', overflowY: 'auto'}} className='panel-body'>
            <h2 style={{margin: '20px', height: '2em'}}>{title} (${el.price}, {el.bedrooms})</h2>
            <Grid fluid>
              <Row>
                <Col md={5} sm={5}>
                  <TableDetails
                    el = {el}
                  />
                </Col>
                <div style={{position: 'relative', bottom: '0'}} >
                <Col md={7} sm={7}>
                  <DogsCatsAndSmoking
                    el = {el}
                  />
                </Col>
                </div>
                <div>
                  <Col md={7} sm={7}>
                    <TablePhotos
                      el = {el}
                    />
                  </Col>
                </div>
              </Row>
            </Grid>
            <Grid fluid style={{margin: '14px'}}>
              <Row>
                <Col>
                  <DescrStreetAndWheelchairAcc
                    el={el}
                  />
                </Col>
              </Row>
            </Grid>
        </div>
        <div style={{textAlign: 'left', float: 'left', bottom: '0px'}}>
          <div style={{margin: '20px'}}><Button bsStyle='primary' style={{position: 'relative', zIndex: '10000'}} onClick={this.saveToFavorites}>Save this listing to your account <MdSave style={{}} width="24" fill="hsl(200, 50%, 50%)" height="24"/></Button></div>
        </div>
        <div style={{textAlign: 'right', bottom: '0px', margin: '20px', position: 'relative'}}>
          <a style={{fontWeight: '400', fontSize: '20px'}} href={`http://seattle.craigslist.org${el.url}`} target="_blank" >Open the ad on craigslist <MdInsertLink style={{}} width="42" fill="hsl(200, 50%, 50%)" height="48"/></a>
        </div>
      </div>
    </div>
    )
  }
}