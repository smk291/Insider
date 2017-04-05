//<editor-fold import
import React                                from 'react'
import {Tooltip, Tab, Tabs, Grid, Col, Row} from 'react-bootstrap'
import dataviews                            from './dataviews'
import Customize                            from './customize/Customize'
import ListingsView                         from './viewlistings/ListingsView'
import DataSummary                          from './viewdata/DataSummary'
import InlineSVG                            from 'svg-inline-react'
import MdRemoveRedEye                       from 'react-icons/lib/md/remove-red-eye'
import FilterData                           from './filterdata/FilterData'

export default class ViewAndFilter extends React.Component {
  constructor(props){
    super(props)
    this.saveToFavorites = this.saveToFavorites.bind(this)
    this.saveToFavoritesFiltered = this.saveToFavoritesFiltered.bind(this)
  }

  saveToFavorites(e){
    this.props.saveToFavorites(e);
  }

  saveToFavoritesFiltered(e){
    this.props.saveToFavoritesFiltered(e);
  }

  render() {
    return (
      <div>
        <Tabs animation defaultActiveKey={3} id="placeholder1">
          <Tab animation eventKey={2} title='Customize your search'>
            <Customize
              listings={this.props.listings}
              bedrooms={this.props.searchParams.bedrooms}
              rent={this.props.searchParams.rent}
              housing={this.props.searchParams.housing}
              laundry={this.props.searchParams.laundry}
              parking={this.props.searchParams.parking}
              bath={this.props.searchParams.bath}
              privateRoom={this.props.searchParams.private_room}
              cats={this.props.searchParams.cats}
              dog={this.props.searchParams.dog}
              furnished={this.props.searchParams.furnished}
              smoking={this.props.searchParams.smoking}
              wheelchair={this.props.searchParams.wheelchair}
            />
          </Tab>
          <Tab animation eventKey={3} title='Browse all listings'>
            <Grid fluid>
              <Row>
                <Col md={10}>
                  <ListingsView
                    changeView        = {this.props.changeView}
                    displayAd         = {this.props.displayAd}
                    listings          = {this.props.listings}
                    saveToFavorites   = {this.saveToFavorites}
                    filterListings    = {this.props.filterListings}
                  />
                </Col>
              </Row>
            </Grid>
          </Tab>
        </Tabs>

        <p>Hiya! VandF</p>
        <p>{JSON.stringify(this.props)}</p>
      </div>
    );
  }
}