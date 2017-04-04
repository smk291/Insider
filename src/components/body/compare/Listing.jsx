import React from 'react'
import { Button, Grid, Row, Col, Tooltip, Accordion, Panel, ListGroup, ListGroupItem, Table, Pager } from 'react-bootstrap'
import primary from '../primary.css'
import humanize from 'underscore.string/humanize'
import titleize from 'underscore.string/titleize'
import capitalize from 'underscore.string/capitalize'
import { BootstrapTable, TableHeaderColumn, TableBody, TableHeader, PaginationList, Pagination } from 'react-bootstrap-table'
import dataviews from '../dataviews.css'
import InlineSVG from 'svg-inline-react'
import MdDateRange from 'react-icons/lib/md/date-range'
import MdInsertLink from 'react-icons/lib/md/insert-link'
import MdAttachMoney from 'react-icons/lib/md/attach-money'
import MdLocationCity from 'react-icons/lib/md/location-city'
import MdSave from 'react-icons/lib/md/save'
import MdStar from 'react-icons/lib/md/star'
import FaBed from 'react-icons/lib/fa/bed'
import browseListingsStyles from '../viewlistings/browseListingsStyles'
import comp from './comparison'


class Blank extends React.Component {
  render() {
    return (
      <div>
        <span className={dataviews.blank}>Blank</span>
      </div>
    );
  }
}

class CondensedPager extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Pager.Item direction={this.props.direction} onSelect={this.props.pageFn} href="#" disabled={!this.props.ternFn}>
          {this.props.direction === 'previous'? <span>&larr; {capitalize(this.props.direction)} Page</span>:<span>Next Page &rarr;</span>}
        </Pager.Item>
      </div>
    )
  }
}

export default class Listing extends React.Component {
  constructor(props){
    super(props)
    this.pageBack = this.pageBack.bind(this)
    this.pageForward = this.pageForward.bind(this)
  }

  pageForward(){
    if (this.props.activePage < this.props.userFavorites.length - 1 && this.props.activePage + 1 !== this.props.otherPage) {
      this.props.pageChange(this.props.activePageNum, this.props.activePage + 1, this.props.comparisonPage);
    } else if (this.props.activePage + 2 < this.props.userFavorites.length && this.props.activePage + 1 === this.props.otherPage) {
      this.props.pageChange(this.props.activePageNum, this.props.activePage + 2, this.props.comparisonPage);
    }
  }
  pageBack(){
    if (this.props.activePage >= 0 &&  this.props.activePage - 1 !== this.props.otherPage){
      this.props.pageChange(this.props.activePageNum, this.props.activePage - 1, this.props.comparisonPage);
    } else if (this.props.activePage - 2 >= 0 && this.props.activePage - 1 === this.props.otherPage) {
      this.props.pageChange(this.props.activePageNum, this.props.activePage - 2, this.props.comparisonPage);
    }
  }

  render(){
    const listing = this.props.listing,
          fieldsBlock1 = [
            'housing',
            'price',
            'bedrooms',
            'sqft',
            'private_room',
            'bath',
            'furnished',
            'laundry',
            'parking'
          ],
          fieldsBlock2 = [
            'cat',
            'dog',
            'smoking',
            'wheelchair_accessible',
            'street_address'
          ];

    if (listing.title.length > 50){
      listing.title = listing.title.slice(0,50) + '…'
    }

    let pageBackCheck = true,
        pageForwardCheck = true;

    if (this.props.activePage === 1) {
      pageBackCheck = !(this.props.otherPage === 0);
    }

    if (this.props.activePage === this.props.userFavorites.length - 2) {
      pageForwardCheck = !(this.props.otherPage === this.props.userFavorites.length - 1)
    }
    return(

      <div>
        <div className='panel panel-default'>
          <div style={{
            margin: '0px 20px',
            padding: '20px 0px'
          }} className='panel-body'>
            <Pager style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}>
              <CondensedPager ternFn={this.props.activePage > 0 && pageBackCheck} direction='previous' pageFn={this.pageBack}/>
              <p>Viewing {this.props.activePage + 1} out of {this.props.userFavorites.length}</p>
              <CondensedPager ternFn={this.props.activePage < this.props.userFavorites.length - 1 && pageForwardCheck} direction='next' pageFn={this.pageForward}/>
            </Pager>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>
                    <h2 style={{
                      margin: '20px',
                      height: '2em'
                    }}>{titleize(listing.title)}</h2>
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </Table>
            <Table>
              <tbody style={{
                textAlign: this.props.alignment
              }}>
                {fieldsBlock1.map((field) => <tr>
                  <td>{listing[field]
                      ? humanize(listing[field])
                      : <Blank/>}</td>
                </tr>)}
                <tr>
                  <td>{listing.photos && Object.keys(listing.photos).length > 0
                      ? Object.keys(listing.photos.photos).length
                      : <Blank/>}</td>
                </tr>
                {fieldsBlock2.map((field) => <tr>
                  <td>{listing[field]
                      ? humanize(listing[field])
                      : <Blank/>}</td>
                </tr>)}
                <tr>
                  <td style={{
                    textAlign: 'left',
                    height: '120px',
                    overflowY: 'scroll'
                  }}>{humanize(listing.descr)}</td>
                </tr>
              </tbody>
            </Table>
            <div style={{
              textAlign: 'right',
              bottom: '0px',
              margin: '20px',
              position: 'relative'
            }}>
              <a style={{
                fontWeight: '400',
                fontSize: '20px'
              }} href={`http://seattle.craigslist.org${listing.url}`} target="_blank">Open the ad on craigslist
                <MdInsertLink style={{}} width="42" fill="hsl(200, 50%, 50%)" height="48"/></a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}