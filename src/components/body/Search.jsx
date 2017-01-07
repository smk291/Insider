import React                                from 'react'
import ReactDOM                             from 'react-dom';
import {render}                             from 'react-dom'
import ReactSimpleRange                     from 'react-simple-range';
import {Grid, Tooltip, Row, Col, Tab, Tabs} from 'react-bootstrap'
import primary                                from './primary.css'
import searchstyle                          from './searchstyle'
import ViewAd                               from './viewlistings/ViewAd'
import ListingsView                         from './viewlistings/ListingsView'
import ListingsViewFiltered                 from './viewlistings/ListingsViewFiltered'
import FilterData                           from './filterdata/FilterData.jsx'
import DataSummary                          from './viewdata/DataSummary'

export default class Search extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col sm={12} md={10}>
            <Tabs style={{fontWeight: '500', fontSize: '16pt'}}  defaultActiveKey={1} id="placeholder1">
              <Tab eventKey={1} title='Housing data at a glance'>
                <DataSummary {...this.props}/>
              </Tab>
              <Tab eventKey={2} title='Filter data'>
                <FilterData {...this.props}/>
              </Tab>
              <Tab eventKey={3} title="Browse all listings">
                <ListingsView {...this.props} />
              </Tab>
              <Tab eventKey={4} disabled={this.props.filteredList.length > 0} title="Browse filtered / sorted listings">
                <ListingsViewFiltered {...this.props} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Grid>
    );
  }
}