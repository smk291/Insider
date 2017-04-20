//<editor-fold import
import React                                from 'react'
import {Tooltip, Tab, Tabs, Grid, Col, Row} from 'react-bootstrap'
import Customize                            from './customize/Customize'
import BrowseMain                           from './browse/BrowseMain'
import DataSummary                          from './viewdata/DataSummary'
import InlineSVG                            from 'svg-inline-react'
import MdRemoveRedEye                       from 'react-icons/lib/md/remove-red-eye'
import FilterData                           from './filterdata/FilterData'
import VirtTable                            from './browse/VirtTable'

export default class Browse extends React.Component {
  constructor(props){
    super(props);
    this.saveToFavorites         = this.saveToFavorites.bind(this);
    this.saveToFavoritesFiltered = this.saveToFavoritesFiltered.bind(this);
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
          <Tab animation eventKey={2} title='Virt Table'>
            <VirtTable {...this.props}/>
          </Tab>
          <Tab animation eventKey={3} title='Browse all listings'>
            <Grid fluid>
              <Row>
                <Col md={12}>
                  <BrowseMain
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

        {/*<p>Hiya! VandF</p>
        <p>{JSON.stringify(this.props)}</p>*/}
      </div>
    );
  }
}