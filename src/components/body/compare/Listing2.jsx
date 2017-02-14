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
    if (this.props.activePage2 < this.props.userFavoritesForDisplay.length - 1){
      this.props.pageChange('activePage2', this.props.activePage2 + 1, 'comparison2');
    }
  }

  pageBack(){
    if (this.props.activePage2 >= 0){
      this.props.pageChange('activePage2', this.props.activePage2 - 1, 'comparison2');
    }
  }

  render(){
    console.log(this.props.comparions2);
    const listing2 = this.props.comparison2;

    if (listing2.title.length > 50){
      listing2.title = listing2.title.slice(0,50) + '…'
    }

    return(
      <div>
        <div className = 'panel panel-default'>
          <div style={{margin: '0px 20px', padding: '20px 0px'}} className='panel-body'>
            <Pager style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
              {this.props.activePage2 > 0 ? <Pager.Item previous href="#" onSelect={this.pageBack}>&larr; Previous Page</Pager.Item>: <Pager.Item previous href="#" disabled>&larr; Previous Page</Pager.Item>}
              <p>Viewing {this.props.activePage2 + 1} out of {this.props.userFavoritesForDisplay.length}</p>
              {this.props.activePage2 < this.props.userFavoritesForDisplay.length ? <Pager.Item next onSelect={this.pageForward} href="#">Next Page &rarr;</Pager.Item> : <Pager.Item next onSelect={this.pageForward} href="#" disabled>Next Page &rarr;</Pager.Item>}
            </Pager>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>
                    <h2 style={{margin: '20px', height: '2em'}}>{titleize(listing2.title)}</h2>
                  </th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </Table>
            <Table>
              <tbody style={{textAlign: 'left'}}>
                <tr>
                  <td>{listing2.housing
                    ? humanize(listing2.housing)
                    : <span className={dataviews.blank}>Blank</span>}</td>
                  </tr>
                <tr>
                  <td>{listing2.price
                      ? humanize(listing2.price)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing2.bedrooms
                      ? humanize(listing2.bedrooms)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing2.sqft
                      ? <span>{humanize(listing2.sqft)}ft<sup>2</sup></span>
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing2.private_room
                      ? humanize(listing2.private_room)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing2.bath
                      ? humanize(listing2.bath)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing2.furnished
                      ? humanize(listing2.furnished)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing2.laundry
                      ? humanize(listing2.laundry)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing2.parking
                      ? humanize(listing2.parking)
                      : <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing2.photos && Object.keys(listing2.photos).length > 0
                      ? Object.keys(listing2.photos.photos).length
                      : <span className={dataviews.blank}>None</span>}</td>
                </tr>
                <tr>
                  <td>{listing2.cat? humanize(listing2.cat): <span className={dataviews.blank}>Blank</span>}</td></tr>
                <tr>
                  <td>{listing2.dog? humanize(listing2.dog): <span className={dataviews.blank}>Blank</span>}</td></tr>
                <tr><td>{listing2.smoking? humanize(listing2.smoking): <span className={dataviews.blank}>Blank</span>}</td></tr>
                <tr>
                  <td>{listing2.wheelchair_accessible ? humanize(listing2.wheelchair_accessible): <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td>{listing2.street_address? humanize(listing2.street_address): <span className={dataviews.blank}>Blank</span>}</td>
                </tr>
                <tr>
                  <td style={{textAlign: 'left', height: '120px', overflowY: 'scroll'}}>{humanize(listing2.descr)}</td>
                </tr>
              </tbody>
            </Table>
        <div style={{textAlign: 'right', bottom: '0px', margin: '20px', position: 'relative'}}>
          <a style={{fontWeight: '400', fontSize: '20px'}} href={`http://seattle.craigslist.org${listing2.url}`} target="_blank" >Open the ad on craigslist <MdInsertLink style={{}} width="42" fill="hsl(200, 50%, 50%)" height="48"/></a>
        </div>
      </div>
    </div>
  </div>
    )
  }
}