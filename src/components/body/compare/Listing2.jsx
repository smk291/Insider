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

export default class Listing2 extends React.Component {
  constructor(props){
    super(props)
    this.pageBack = this.pageBack.bind(this)
    this.pageForward = this.pageForward.bind(this)
  }

  pageForward(){
    console.log(this.pageForward);
    console.log(this.props.userFavoritesForDisplay.length);
    console.log(this.props.activePage2);
    console.log(this.props.comparison2);
    if (this.props.activePage2 < this.props.userFavoritesForDisplay.length - 1){
      this.props.pageChange('activePage2', this.props.activePage2 + 1, 'comparison2');
    }
  }

  pageBack(){
    console.log(this.pageBack);
    console.log(this.props.userFavoritesForDisplay.length);
    console.log(this.props.activePage2);
    console.log(this.props.comparison2);
    if (this.props.activePage2 >= 0){
      this.props.pageChange('activePage2', this.props.activePage2 - 1, 'comparison2');
    }
  }

  render(){
    const listing2 = this.props.comparison2;

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
                  <td>{humanize(listing2.descr)}</td>
                </tr>
                <tr>
                  <td>Street address?</td>
                  <td>{listing2.street_address? humanize(listing2.street_address): <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>Wheelchair accessible?</td>
                  <td>{listing2.wheelchair_accessible ? humanize(listing2.wheelchair_accessible): <span className={dataviews.blank}>Blank</span>}</td>
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
                <td>{listing2.housing_types
                    ? humanize(listing2.housing_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Square feet:</td>
                <td>{listing2.sqft
                    ? <span>{humanize(listing2.sqft)}ft<sup>2</sup></span>
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Private room?</td>
                <td>{listing2.private_room_types
                    ? humanize(listing2.private_room_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Private bath?</td>
                <td>{listing2.bath_types
                    ? humanize(listing2.bath_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Furnished?</td>
                <td>{listing2.furnished_type
                    ? humanize(listing2.furnished_type)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Laundry?</td>
                <td>{listing2.laundry_types
                    ? humanize(listing2.laundry_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
              </tr>
              <tr>
                <td>Parking?</td>
                <td>{listing2.parking_types
                    ? humanize(listing2.parking_types)
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
                <td>{listing2.photos && Object.keys(listing2.photos).length > 0
                    ? Object.keys(listing2.photos.photos).length
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
            <p>{listing2.cat_types
                ? humanize(listing2.cat_types)
                : ''}</p>
            <p>{listing2.dog_types
                ? humanize(listing2.dog_types)
                : ''}</p>
            <p>{listing2.smoking_types
                ? humanize(listing2.smoking_types)
                : ''}</p>
            <p>{!listing2.cat_types && !listing2.dog_types ? 'No information about whether cats or dogs are allowed' : ''}</p>
          </div>
        )
      }
    }

    return(
      <div>
        <div className = 'panel panel-default'>
          <div style={{border: '1px solid black', margin: '0px 20px', padding: '20px 20px', overflowY: 'scroll'}} className='panel-body'>
            <h2 style={{margin: '20px', height: '2em'}}>{titleize(listing2.title)}</h2>
            <Grid fluid>
              <Row>
                <Col md={5} sm={5}>
                  <TableDetails
                    listing2 = {listing2}
                  />
                </Col>
                <div style={{position: 'relative', bottom: '0'}} >
                <Col md={7} sm={7}>
                  <DogsCatsAndSmoking
                    listing2 = {listing2}
                  />
                </Col>
                </div>
                <div>
                  <Col md={7} sm={7}>
                    <TablePhotos
                      listing2 = {listing2}
                    />
                  </Col>
                </div>
              </Row>
            </Grid>
            <Grid fluid style={{margin: '14px'}}>
              <Row>
                <Col>
                  <DescrStreetAndWheelchairAcc
                    listing2 = {listing2}
                  />
                </Col>
              </Row>
            </Grid>
        </div>
        <div style={{textAlign: 'right', bottom: '0px', margin: '20px', position: 'relative'}}>
          <a style={{fontWeight: '400', fontSize: '20px'}} href={`http://seattle.craigslist.org${listing2.url}`} target="_blank" >Open the ad on craigslist <MdInsertLink style={{}} width="42" fill="hsl(200, 50%, 50%)" height="48"/></a>
          <Pager style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <Pager.Item previous href="#" onSelect={this.pageBack} disabled={this.props.activePage2 === 0}>&larr; Previous Page</Pager.Item>
            <p>Viewing {this.props.activePage2 + 1} out of {this.props.userFavoritesForDisplay.length}</p>
            <Pager.Item next onSelect={this.pageForward} disabled={this.props.activePage2 === this.props.userFavoritesForDisplay.length} href="#">Next Page &rarr;</Pager.Item>
          </Pager>
        </div>
      </div>
    </div>
    )
  }
}