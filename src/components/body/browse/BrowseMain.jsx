// <editor-fold
import React from 'react'
import {Button, Grid, Row, Col, Tooltip, Accordion, Panel, ListGroup, ListGroupItem, Table, Pager} from 'react-bootstrap'
import humanize from 'underscore.string/humanize'
import titleize from 'underscore.string/titleize'
import { BootstrapTable, TableHeaderColumn, TableBody, TableHeader } from 'react-bootstrap-table'
import InlineSVG from 'svg-inline-react'
import MdDateRange from 'react-icons/lib/md/date-range'
import FaBed from 'react-icons/lib/fa/bed'
import MdInsertLink from 'react-icons/lib/md/insert-link'
import MdAttachMoney from 'react-icons/lib/md/attach-money'
import MdLocationCity from 'react-icons/lib/md/location-city'
import axios from 'axios'
import BrowseLeft from './BrowseLeft'
import BrowseRight from './BrowseRight'

// </editor-fold>

// From ViewAndFilter
// To CustomSortTable and DisplayedAd
export default class BrowseMain extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const shadow = {
    //   -webkit-box-shadow: 0 3px 8px rgba(0, 0, 0, .25);
    //   -moz-box-shadow: 0 3px 8px rgba(0, 0, 0, .25);
    //   box-shadow: 0 3px 8px rgba(0, 0, 0, .25);
    //   -webkit-border-radius: 3px;
    //   -moz-border-radius: 3px;
    //   border-radius: 3px;
    // }

    const ClickHere = () => {
      return(
        <div className='panel panel-default' style={{height: '722px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div>
            <h1>Click on a row to view the listing's details</h1>
          </div>
        </div>
      )
    }

    return (
      <div style={{width: '100%', marginTop: '10px'}}>
        <Grid style={{width: '100%'}} fluid>
          <Row>
            <Col sm={12} md={6}>
              <BrowseLeft
                displayThese={this.props.listings}
                changeView={this.props.changeView}
              />
            </Col>
            <Col sm={12} md={6}>
              <div>
                <div>
                  {this.props.displayAd.id ? <BrowseRight
                    displayAd={this.props.displayAd}
                    saveToFavorites={this.props.saveToFavorites}
                  /> :
                  <ClickHere />}
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}