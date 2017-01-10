// <editor-fold
import React from 'react'
import { Button, Grid, Row, Col, Tooltip, Accordion, Panel, ListGroup, ListGroupItem, Table, Pager } from 'react-bootstrap'
import primary from '../primary.css'
import humanize from 'underscore.string/humanize'
import titleize from 'underscore.string/titleize'
import { BootstrapTable, TableHeaderColumn, TableBody, TableHeader, PaginationList, Pagination } from 'react-bootstrap-table'
import dataviews from '../dataviews.css'
import InlineSVG from 'svg-inline-react'
import MdDateRange from 'react-icons/lib/md/date-range'
import FaBed from 'react-icons/lib/fa/bed'
import MdInsertLink from 'react-icons/lib/md/insert-link'
import MdAttachMoney from 'react-icons/lib/md/attach-money'
import MdLocationCity from 'react-icons/lib/md/location-city'
import MdSave from 'react-icons/lib/md/save'
import MdStar from 'react-icons/lib/md/star'
import browseListingsStyles from '../viewlistings/browseListingsStyles'

// </editor-fold>

export default class Listing1 extends React.Component {
  constructor(props){
    super(props)
    this.pageBack = this.pageBack.bind(this)
    this.pageForward = this.pageForward.bind(this)
  }

  pageForward(){
    console.log(this.pageForward);
    console.log(this.props.userFavoritesForDisplay.length);
    console.log(this.props.activePage1);
    console.log(this.props.comparison1);
    if (this.props.activePage1 < this.props.userFavoritesForDisplay.length - 1){
      this.props.pageChange('activePage1', this.props.activePage1 + 1, 'comparison1');
    }
  }

  pageBack(){
    console.log(this.pageBack);
    console.log(this.props.userFavoritesForDisplay.length);
    console.log(this.props.activePage1);
    console.log(this.props.comparison1);
    if (this.props.activePage1 >= 0){
      this.props.pageChange('activePage1', this.props.activePage1 - 1, 'comparison1');
    }
  }

  render(){
    const listing1 = this.props.comparison1;

    class DescrStreetAndWheelchairAcc extends React.Component {
      constructor(props) {
        super(props)
      }

      render(){
        return(
          <div>
            <Table striped bordered condensed hover>
              <tbody>
                <tr>
                  <td>Description:</td>
                  <td>{humanize(listing1.descr)}</td>
                </tr>
                <tr>
                  <td>Street address?</td>
                  <td>{listing1.street_address? humanize(listing1.street_address): <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>Wheelchair accessible?</td>
                  <td>{listing1.wheelchair_accessible ? humanize(listing1.wheelchair_accessible): <span className={dataviews.blank}>Blank</span>}</td>
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
                <td>{listing1.housing_types
                    ? humanize(listing1.housing_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Square feet:</td>
                <td>{listing1.sqft
                    ? <span>{humanize(listing1.sqft)}ft<sup>2</sup></span>
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Private room?</td>
                <td>{listing1.private_room_types
                    ? humanize(listing1.private_room_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Private bath?</td>
                <td>{listing1.bath_types
                    ? humanize(listing1.bath_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Furnished?</td>
                <td>{listing1.furnished_type
                    ? humanize(listing1.furnished_type)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Laundry?</td>
                <td>{listing1.laundry_types
                    ? humanize(listing1.laundry_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Parking?</td>
                <td>{listing1.parking_types
                    ? humanize(listing1.parking_types)
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
                <td>{listing1.photos && Object.keys(listing1.photos).length > 0
                    ? Object.keys(listing1.photos.photos).length
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
            <p>{listing1.cat_types
                ? humanize(listing1.cat_types)
                : ''}</p>
            <p>{listing1.dog_types
                ? humanize(listing1.dog_types)
                : ''}</p>
            <p>{listing1.smoking_types
                ? humanize(listing1.smoking_types)
                : ''}</p>
            <p>{!listing1.cat_types && !listing1.dog_types ? 'No information about whether cats or dogs are allowed' : ''}</p>
          </div>
        )
      }
    }

    return(
      <div>
        <div className = 'panel panel-default'>
          <div style={{border: '1px solid black', margin: '0px 20px', padding: '20px 20px', overflowY: 'scroll'}} className='panel-body'>
            <Table striped bordered condensed hover fluid>
              <thead>
                <tr>
                  <th>
                    <h2 style={{margin: '20px', height: '2em'}}>{titleize(listing1.title)}</h2>
                  </th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </Table>
                  <TableDetails
                    listing1 = {listing1}
                  />
                  <DogsCatsAndSmoking
                    listing1 = {listing1}
                  />
                    <TablePhotos
                      listing1 = {listing1}
                    />
                  <DescrStreetAndWheelchairAcc
                    listing1 = {listing1}
                  />
        <div style={{textAlign: 'right', bottom: '0px', margin: '20px', position: 'relative'}}>
          <a style={{fontWeight: '400', fontSize: '20px'}} href={`http://seattle.craigslist.org${listing1.url}`} target="_blank" >Open the ad on craigslist <MdInsertLink style={{}} width="42" fill="hsl(200, 50%, 50%)" height="48"/></a>
          <Pager style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            {this.props.activePage1 > 0 ? <Pager.Item previous href="#" onSelect={this.pageBack}>&larr; Previous Page</Pager.Item>: <Pager.Item previous href="#" disabled>&larr; Previous Page</Pager.Item>}
            <p>Viewing {this.props.activePage1 + 1} out of {this.props.userFavoritesForDisplay.length}</p>
            {this.props.activePage1 < this.props.userFavoritesForDisplay.length ? <Pager.Item next onSelect={this.pageForward} href="#">Next Page &rarr;</Pager.Item> : <Pager.Item next onSelect={this.pageForward} href="#" disabled>Next Page &rarr;</Pager.Item>}
          </Pager>
        </div>
      </div>
    </div>
  </div>
    )
  }
}