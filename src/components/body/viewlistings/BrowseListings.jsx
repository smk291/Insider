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

export default class BrowseListings extends React.Component {
  constructor(props){
    super(props)
    this.changeView = this.changeView.bind(this)
  }

  changeView(row) {
    this.props.changeView(row);
  }

  render(){
    const options = {
      paginationShowsTotal: true,
      onRowClick: (row) => {
        this.changeView(row);
      },
      sizePerPage: 12
    }

    function priceFormatter(cell, row) {
      if (cell === null) {
        return cell
      }

      return "$" + cell
    }

    function bedrooms(cell, row) {
      if (cell === null) {
        return cell
      }

      return cell + "br"
    }

    function shorten(cell, row) {
      if (cell && cell.length > 15) {
        return cell.substring(0, 15);
      }

      return cell
    }

    function titleFixer(cell, row) {
      console.log(cell.toLowerCase());
      console.log(cell.toLowerCase().indexOf('felon') !== -1);
      if (cell.indexOf(' ') === -1 || cell.toLowerCase().indexOf('felon') !== -1) {
        cell = <span className={dataviews.blank}>Poor title or bad formatting</span>
        return cell
      } else if (cell.length > 25) {
        cell = <span>{cell.substring(0, 25)}&hellip;</span>
        return cell
      }

      return cell
    }

    return (
      <div>
        <div>
      <BootstrapTable
        bodyContainerClass={dataviews.tableBodyCustomTable}
        scrollTop={ 'Bottom' }
        search options={options}
        hover
        pagination
        style={{overflowY: 'scroll'}}
        striped
        data={this.props.displayThese}>
          <TableHeaderColumn
            width='72'
            headerAlign='center'
            dataField='post_date'
            isKey={ true }
            dataAlign='right'
          >
            <MdDateRange/>
            </TableHeaderColumn>
          <TableHeaderColumn
            width='180'
            maxheight='20'
            headerAlign='center'
            dataField='title'
            dataFormat={ titleFixer }
          >
            Title
          </TableHeaderColumn>
          <TableHeaderColumn
            width='64'
            dataField='price'
            dataFormat={ priceFormatter }
            headerAlign='center'
            dataAlign='right'
          >
            <MdAttachMoney/>
          </TableHeaderColumn>
          <TableHeaderColumn
            width='48'
            headerAlign='center'
            dataFormat={ bedrooms }
            dataField='bedrooms'
            dataAlign='right'
          >
            <FaBed/>
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
            dataFormat={ shorten }
          >
            <MdLocationCity/>
          </TableHeaderColumn>
      </BootstrapTable>
      </div>
    </div>
    );
  }
}