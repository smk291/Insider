import React from 'react'
import {Table, Button, Grid, Jumbotron, Row, Col, Popover, Tooltip, Modal} from 'react-bootstrap'
import { Panel, Pager } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn, TableBody, TableHeader, PaginationList, Pagination } from 'react-bootstrap-table'
import InlineSVG from 'svg-inline-react'
import MdSearch from 'react-icons/lib/md/search'
import MdCompare from 'react-icons/lib/md/compare'
import MdMap from 'react-icons/lib/md/map'
import axios from 'axios'
import humanize from 'underscore.string/humanize'
import titleize from 'underscore.string/titleize'
import capitalize from 'underscore.string/capitalize'
import MdDateRange from 'react-icons/lib/md/date-range'
import MdInsertLink from 'react-icons/lib/md/insert-link'
import MdAttachMoney from 'react-icons/lib/md/attach-money'
import MdLocationCity from 'react-icons/lib/md/location-city'
import MdSave from 'react-icons/lib/md/save'
import MdStar from 'react-icons/lib/md/star'
import FaBed from 'react-icons/lib/fa/bed'
import comp from './compare/comparison'

const monthsShort = {
  0: "Jan.",
  1: "Feb.",
  2: "Mar.",
  3: "Apr.",
  4: "May",
  5: "June",
  6: "July",
  7: "Aug.",
  8: "Sept.",
  9: "Oct.",
  10: "Nov.",
  11: "Dec."
}

function formatDate(date) {
  let fD = new Date (date);
  return <span>fd.getMonth() fd.getDay()</span>


}

class Blank extends React.Component {
  render() {
    return (
        <span>Blank</span>
    );
  }
}

class TableRewritten extends React.Component {
  constructor(props) {
    super(props);
    this.pageBack1 = this.pageBack1.bind(this);
    this.pageForward1 = this.pageForward1.bind(this);
    this.pageBack2 = this.pageBack2.bind(this);
    this.pageForward2 = this.pageForward2.bind(this);
    this.pageForward = this.pageForward.bind(this);
    this.pageBack = this.pageBack.bind(this);
  }

  pageForward(activePage, otherPage, favorites, activePageNum, comparisonPage) {
    if (activePage < favorites.length - 1 && activePage + 1 !== otherPage) {
      this.props.pageChange(activePageNum, activePage + 1, comparisonPage);
    } else if (activePage + 2 < favorites.length && activePage + 1 === otherPage) {
      this.props.pageChange(activePageNum, activePage + 2, comparisonPage);
    }
  }

  pageForward1(){
    this.pageForward(this.props.activePage1, this.props.otherPage1, this.props.userFavorites, this.props.activePageNum1, this.props.comparisonPage1);
  }

  pageForward2(){
    this.pageForward(this.props.activePage2, this.props.otherPage2, this.props.userFavorites, this.props.activePageNum2, this.props.comparisonPage2);
  }

  pageBack(activePage, otherpage, activePageNum, comparisonPage, otherPage){
    if (activePage >= 0 && activePage - 1 !== otherPage){
      this.props.pageChange(activePageNum, activePage - 1, comparisonPage);
    } else if (activePage - 2 >= 0 && activePage - 1 === otherPage) {
      this.props.pageChange(activePageNum, activePage - 2, comparisonPage);
    }
  }

  pageBack1(){
    this.pageBack(this.props.activePage1, this.props.otherPage1, this.props.activePageNum1, this.props.comparisonPage1, this.props.otherPage1);
  }

  pageBack2(){
    this.pageBack(this.props.activePage2, this.props.otherPage2, this.props.activePageNum2, this.props.comparisonPage2, this.props.otherPage2);
  }

  render() {
    const listing1 = this.props.listing1;
    const listing2 = this.props.listing2;
    const labels = [
      'Housing type',
      'Monthly Rent',
      'No. of Bedrooms',
      'Square feet',
      'Private room',
      'Private bath',
      'Furnished space?',
      'Washer / Dryer',
      'Parking options',
      'Are cats allowed',
      'Are dogs allowed',
      'Is smoking allowed',
      'Wheelchair accessibility',
      'Street Address',
      'How many photos',
      'Description'
    ];
    const fields = [
      'housing',
      'price',
      'bedrooms',
      'sqft',
      'private_room',
      'bath',
      'furnished',
      'laundry',
      'parking',
      'cat',
      'dog',
      'smoking',
      'wheelchair_accessible',
      'street_address',
    ];

    let pageBackCheck1 = true,
        pageForwardCheck1 = true;

    if (this.props.activePage1 === 1) {
      pageBackCheck1 = !(this.props.otherPage1 === 0);
    }

    if (this.props.activePage1 === this.props.userFavorites.length - 2) {
      pageForwardCheck1 = !(this.props.otherPage1 === this.props.userFavorites.length - 1)
    }

    let pageBackCheck2 = true,
        pageForwardCheck2 = true;

    if (this.props.activePage2 === 1) {
      pageBackCheck2 = !(this.props.otherPage2 === 0);
    }

    if (this.props.activePage2 === this.props.userFavorites.length - 2) {
      pageForwardCheck2 = !(this.props.otherPage2 === this.props.userFavorites.length - 1)
    }

    return (
      <div>
        <Pager style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <CondensedPager ternFn={this.props.activePage1 > 0 && pageBackCheck1} direction='previous' pageFn={this.pageBack1}/>
          <p>Viewing {this.props.activePage1 + 1} out of {this.props.userFavorites.length}</p>
          <CondensedPager ternFn={this.props.activePage1 < this.props.userFavorites.length - 1 && pageForwardCheck1} direction='next' pageFn={this.pageForward1}/>

          <CondensedPager ternFn={this.props.activePage2 > 0 && pageBackCheck2} direction='previous' pageFn={this.pageBack2}/>
          <p>Viewing {this.props.activePage2 + 1} out of {this.props.userFavorites.length}</p>
          <CondensedPager ternFn={this.props.activePage2 < this.props.userFavorites.length - 1 && pageForwardCheck2} direction='next' pageFn={this.pageForward2}/>
        </Pager>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th style={{textAlign: 'center'}}><MdCompare /></th>
              <th>{titleize(listing1.title)}</th>
              <th>{titleize(listing2.title)}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, idx) =>
              <tr key={idx}>
                <td>{labels[idx]}</td>
                <td>{field === 'price' 
                  ? "$" + listing1[field]
                  : field === "sqft" && listing1[field]
                  ? <span>{listing1[field]} ft<sup>2</sup></span>
                  : listing1[field]
                    ? humanize(listing1[field])
                    : <Blank/>}
                </td>
                <td>{field === 'price' 
                  ? "$" + listing2[field]
                  : field === "sqft" && listing2[field]
                  ? <span>{listing2[field]} ft<sup>2</sup></span>
                  : listing2[field]
                    ? humanize(listing2[field])
                    : <Blank/>}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
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

class Favorites extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <td>
                Favorites
              </td>
            </tr>
          </thead>
          <tbody>
            {this.props.userFavorites.map((favorite) => {
              <tr>
                <td>
                  {formatDate(favorite.postDate)}
                  {favorite.housing} -
                  {favorite.bedrooms} -
                  ${favorite.price} -
                  {favorite.title}
                </td>
              </tr>
            })}
          </tbody>
        </Table>

        <Table condensed hover>
          <thead>
            <tr>
              <th style={{textAlign: 'center'}}>Favorites</th>
            </tr>
          </thead>
          <tbody>
            {this.props.userFavorites.map((favorite, idx) =>
              <tr key={idx}>
                <td>{favorite.postDate} -
                  &nbsp;
                {favorite.housing
                  ? humanize(favorite.housing)
                  : <Blank/>} -
                  &nbsp;
                {favorite.bedrooms
                  ? humanize(favorite.bedrooms)
                  : <Blank/>} -
                  &nbsp;
                {favorite.price
                  ? <span>${humanize(favorite.price)}</span>
                  : <Blank/>} -
                &nbsp;
                {favorite.title
                  ? humanize(favorite.title)
                  : <Blank/>}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default class Compare extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.checkForAddedFavorite();
  }

  render() {
    const AddFavorites = () => {
      return (
        <div className='panel panel-default' style={{
          height: '722px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px',
          padding: '80px'
        }}>
          <div>
            <h1>Save Favorites to compare them side-by-side</h1>
          </div>
        </div>
      )
    }

    return (
      <div>
         <Grid fluid style={{
          minWidth: '1000px'
        }}>
          <Row>
            <Col>
              <TableRewritten
                userFavorites={this.props.userFavorites}
                // fetchAndFormatFavorites={this.props.fetchAndFormatFavorites}
                pageChange={this.props.pageChange}

                listing1={this.props.comparison1}
                comparison1={this.props.comparison1}
                activePage1={this.props.activePage1}
                comparisonPage1='comparison1'
                activePageNum1='activePage1'
                otherPage1={this.props.activePage2}

                listing2={this.props.comparison2}
                comparison2={this.props.comparison2}
                activePage2={this.props.activePage2}
                comparisonPage2='comparison2'
                activePageNum2='activePage2'
                otherPage2={this.props.activePage1}
              />
            </Col>
            <Col>
              <Favorites userFavorites={this.props.userFavorites}/>
            </Col>
          </Row>
        </Grid>
        {/*<p>Compare</p>
        <p>{JSON.stringify(this.props)}</p>*/}
      </div>
    );
  }
}