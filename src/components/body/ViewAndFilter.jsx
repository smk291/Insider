//<editor-fold import
import React                from 'react'
import {Tooltip, Tab, Tabs} from 'react-bootstrap'
import dataviews            from './dataviews'
import ViewAd               from './viewlistings/ViewAd'
import ListingsView         from './viewlistings/ListingsView'
import ListingsViewFiltered from './viewlistings/ListingsViewFiltered'
import FilterData           from './filterdata/FilterData.jsx'
import DataSummary          from './viewdata/DataSummary'
import InlineSVG            from 'svg-inline-react'
import MdRemoveRedEye                from 'react-icons/lib/md/remove-red-eye'
//</editor-fold>

// From Routing
// To DataSummary, FilterData, ListingsView, ListingsViewFiltered
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
      <div className={dataviews.tabs}>
        <Tabs animation defaultActiveKey={1} id="placeholder1">
          <Tab className={dataviews.subheadertab} animation eventKey={1} title='Housing data at a glance'>
            <DataSummary {...this.props}/>
          </Tab>
          <Tab className={dataviews.subheadertab} animation eventKey={2} title='Filter data'>
            <FilterData {...this.props}/>
          </Tab>
          <Tab className={dataviews.subheadertab} animation eventKey={3} title='Browse all listings'>
            <ListingsView
              changeView={this.props.changeView}
              displayAd={this.props.displayAd}
              listingsToDisplay={this.props.listingsToDisplay}
              saveToFavorites={this.saveToFavorites}
            />
          </Tab>
          <Tab className={dataviews.subheadertab} animation eventKey={4} disabled={!this.props.loggedIn} title='Browse filtered / sorted listings'>
            <ListingsViewFiltered
              changeViewFiltered={this.props.changeViewFiltered}
              displayAdFromFiltered={this.props.displayAdFromFiltered}
              filteredListingsToDisplay={this.props.filteredListingsToDisplay}
              saveToFavoritesFiltered={this.saveToFavoritesFiltered}
              pageChange={this.props.pageChange}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}