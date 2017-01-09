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
            <ListingsView {...this.props} />
          </Tab>
          <Tab className={dataviews.subheadertab} animation eventKey={4} disabled={!this.props.loggedIn} title='Browse filtered / sorted listings'>
            <ListingsViewFiltered {...this.props} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}