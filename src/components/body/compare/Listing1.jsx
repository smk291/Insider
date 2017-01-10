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
import comp from './comparison'

// </editor-fold>

export default class Listing1 extends React.Component {
  constructor(props){
    super(props)
    this.pageBack = this.pageBack.bind(this)
    this.pageForward = this.pageForward.bind(this)
  }

  pageForward(){
    if (this.props.activePage1 < this.props.userFavoritesForDisplay.length - 1){
      this.props.pageChange('activePage1', this.props.activePage1 + 1, 'comparison1');
    }
  }

  pageBack(){
    if (this.props.activePage1 >= 0){
      this.props.pageChange('activePage1', this.props.activePage1 - 1, 'comparison1');
    }
  }

  render(){
    console.log(this.props.comparison1);
    const listing1 = this.props.comparison1;

    if (listing1.title.length > 50){
      listing1.title = listing1.title.slice(0,50) + '…'
    }

    return(
      <div>
        <div className = 'panel panel-default'>
          <div style={{margin: '0px 20px', padding: '20px 0px'}} className='panel-body'>
            <Pager style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
              {this.props.activePage1 > 0 ? <Pager.Item previous href="#" onSelect={this.pageBack}>&larr; Previous Page</Pager.Item>: <Pager.Item previous href="#" disabled>&larr; Previous Page</Pager.Item>}
              <p>Viewing {this.props.activePage1 + 1} out of {this.props.userFavoritesForDisplay.length}</p>
              {this.props.activePage1 < this.props.userFavoritesForDisplay.length ? <Pager.Item next onSelect={this.pageForward} href="#">Next Page &rarr;</Pager.Item> : <Pager.Item next onSelect={this.pageForward} href="#" disabled>Next Page &rarr;</Pager.Item>}
            </Pager>
            <Table striped bordered condensed hover>
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
            <Table>
              <tbody style={{textAlign: 'right'}}>
                <tr>
                  <td>{listing1.housing_types
                    ? humanize(listing1.housing_types)
                    : <span className={dataviews.blank}>Blank</span>}</td>
                  </tr>
                <tr>
                  <td>{listing1.price
                      ? humanize(listing1.price)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing1.bedrooms
                      ? humanize(listing1.bedrooms)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing1.sqft
                      ? <span>{humanize(listing1.sqft)}ft<sup>2</sup></span>
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing1.private_room_types
                      ? humanize(listing1.private_room_types)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing1.bath_types
                      ? humanize(listing1.bath_types)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing1.furnished_type
                      ? humanize(listing1.furnished_type)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing1.laundry_types
                      ? humanize(listing1.laundry_types)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing1.parking_types
                      ? humanize(listing1.parking_types)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing1.photos && Object.keys(listing1.photos).length > 0
                      ? Object.keys(listing1.photos.photos).length
                      : <span className={dataviews.blank}>None</span>}</td>
                </tr>
                <tr>
                  <td>{listing1.cat_types? humanize(listing1.cat_types): <span className={dataviews.blank}>Blank</span>}</td></tr>
                <tr>
                  <td>{listing1.dog_types? humanize(listing1.dog_types): <span className={dataviews.blank}>Blank</span>}</td></tr>
                <tr><td>{listing1.smoking_types? humanize(listing1.smoking_types): <span className={dataviews.blank}>Blank</span>}</td></tr>
                <tr>
                  <td>{listing1.wheelchair_accessible ? humanize(listing1.wheelchair_accessible): <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing1.street_address? humanize(listing1.street_address): <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td style={{textAlign: 'left', height: '120px', overflowY: 'scroll'}}>{humanize(listing1.descr)}</td>
                </tr>
              </tbody>
            </Table>
        <div style={{textAlign: 'right', bottom: '0px', margin: '20px', position: 'relative'}}>
          <a style={{fontWeight: '400', fontSize: '20px'}} href={`http://seattle.craigslist.org${listing1.url}`} target="_blank" >Open the ad on craigslist <MdInsertLink style={{}} width="42" fill="hsl(200, 50%, 50%)" height="48"/></a>
        </div>
      </div>
    </div>
  </div>
    )
  }
}