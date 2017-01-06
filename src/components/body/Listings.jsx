import React from 'react'
import { Button, Grid, Jumbotron, Row, Col, Tooltip, Accordion, Panel } from 'react-bootstrap'

import main2 from './main2.css'
import ListingHeader from './ListingHeader'
import ListingsView from './ListingsView'

export default class Listings extends React.Component {
  constructor(props) {
    super(props);
    this.scrapeList = this.scrapeList.bind(this);
    this.scrapeRows = this.scrapeRows.bind(this);
    this.scrapeNull = this.scrapeNull.bind(this);
    this.getListings = this.getListings.bind(this);
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

  getListings(e){
    this.props.getListings(e);
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}