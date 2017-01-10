import React from 'react'
import { Button, Grid, Jumbotron, Row, Col, Popover, Tooltip, Modal } from 'react-bootstrap'
import primary from './primary.css'
import InlineSVG from 'svg-inline-react'
import MdSearch from 'react-icons/lib/md/search'
import MdCompare from 'react-icons/lib/md/compare'
import MdMap from 'react-icons/lib/md/map'
import Listing1 from './compare/Listing1'
import Listing2 from './compare/Listing2'

export default class Compare extends React.Component {
  constructor(props) {
    super(props);
    this.scrapeList = this.scrapeList.bind(this);
    this.scrapeRows = this.scrapeRows.bind(this);
    this.scrapeNull = this.scrapeNull.bind(this);
    this.filterListings = this.filterListings.bind(this)
    this.handleSelect2 = this.handleSelect2.bind(this)
    this.handleSelect1 = this.handleSelect1.bind(this)
  }

  scrapeList(e){
    this.props.scrapeList(e);
  }

  scrapeRows(e){
    this.props.scrapeRows(e);
  }

  scrapeNull(e){
    this.props.scrapeNull(e);
  }

  filterListings(){
    this.props.filterListings();
  }

  handleSelect1(eventkey){
    this.props.handleSelect1(eventkey);
  }

  handleSelect2(eventkey){
    this.props.handleSelect2(eventkey);
  }

  render() {
    const AddFavorites = () => {
      return(
        <div className = 'panel panel-default' style={{height: '722px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div>
            <h1>Save Favorites to compare them side-by-side</h1>
          </div>
        </div>
      )
    }

    return (
      <div style={{height: '100vh'}}>
        <Grid style={{height: '722px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}} fluid>
          <Row>
            <Col>
            {/* Header */}
            </Col>
          </Row>
          <Row>
            <Col>
              {/* Subeader */}
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              {this.props.userFavoritesForDisplay.length > 0 ? <Listing1
                comparison1={this.props.comparison1}
                activePage1={this.props.activePage1}
                userFavoritesForDisplay={this.props.userFavoritesForDisplay}
                pageChange={this.props.pageChange}
              /> :
              <AddFavorites />}
            </Col>
            <Col md={5}>
              {this.props.userFavoritesForDisplay.length > 0 ? <Listing2
                comparison2={this.props.comparison2}
                activePage2={this.props.activePage2}
                userFavoritesForDisplay={this.props.userFavoritesForDisplay}
                pageChange={this.props.pageChange}
              /> :
              <AddFavorites />}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}