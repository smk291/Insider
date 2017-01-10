// <editor-fold
import React from 'react'
import {Button, Grid, Row, Col, Tooltip, Accordion, Panel, ListGroup, ListGroupItem, Table, Pager} from 'react-bootstrap'
import primary from '../primary.css'
import ListingHeader from './ListingHeader'
import humanize from 'underscore.string/humanize'
import { BootstrapTable, TableHeaderColumn, TableBody, TableHeader, PaginationList } from 'react-bootstrap-table'
import dataviews from '../dataviews.css'
import InlineSVG from 'svg-inline-react'
import MdDateRange from 'react-icons/lib/md/date-range'
import FaBed from 'react-icons/lib/fa/bed'
import MdInsertLink from 'react-icons/lib/md/insert-link'
import MdAttachMoney from 'react-icons/lib/md/attach-money'
import MdLocationCity from 'react-icons/lib/md/location-city'
import MdSave from 'react-icons/lib/md/save'
import MdStar from 'react-icons/lib/md/star'
import browseListingsStyles from './browseListingsStyles'

// </editor-fold>


// const whetherInFavorites = {
//   true: <MdStar fill="hsl(53, 100%, 50%)" />,
//   false: <MdStar />
// }

export default class BrowseListings extends React.Component {
  constructor(props){
    super(props)
    this.changeView = this.changeView.bind(this)
    // this.isInFavorites = this.isInFavorites.bind(this)
  }

  changeView(row) {
    this.props.changeView(row);
  }
  //
  // isInFavorites(row){
  //   this.props.isInFavorites(row);
  // }

  render(){

    // const enumFormatter = function (cell, row, enumObject) {
    //   console.log(isInFavorites(row));
    //   return enumObject[isInFavorites(row)];
    // }

    const options = {
      paginationShowsTotal: true,
      onRowClick: (row) => {
        this.changeView(row);
      }
    }

    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
      <BootstrapTable
        maxHeight='550'
        bodyContainerClass={dataviews.tableBodyCustomTable}
        height='620'
        scrollTop={ 'Bottom' }
        search options={options}
        hover
        pagination
        style={{overflowY: 'scroll'}}
        striped
        data={this.props.displayThese}>
          <TableHeaderColumn
            width='64'
            headerAlign='center'
            dataField='post_date'
            isKey={ true }
          >
            <MdDateRange
              width="26"
              fill="hsl(200, 50%, 50%)"
              height="26"/>
            </TableHeaderColumn>
          <TableHeaderColumn
            width='180'
            maxheight='20'
            headerAlign='center'
            dataField='title'
          >
            Title
          </TableHeaderColumn>
          <TableHeaderColumn
            width='64'
            dataField='price'
            headerAlign='center'
            dataAlign='left'
          >
            <MdAttachMoney
              width="26"
              fill="hsl(200, 50%, 50%)"
              height="26"
            />
          </TableHeaderColumn>
          <TableHeaderColumn
            width='48'
            headerAlign='center'
            dataField='bedrooms'
          >
            <FaBed
              width="26"
              fill="hsl(200, 50%, 50%)"
              height="26"
            />
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField='id'
            headerAlign='center'
            hidden
          >
            id
          </TableHeaderColumn>
          <TableHeaderColumn
            width='150'
            headerAlign='center'
            dataField='neighborhood'
          >
            <MdLocationCity
              width="26"
              fill="hsl(200, 50%, 50%)"
              height="26"
            />
          </TableHeaderColumn>
      </BootstrapTable>
      </div>
    </div>
    );
  }
}