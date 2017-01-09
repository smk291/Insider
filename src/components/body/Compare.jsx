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

  render() {
    return (
      <div>
        <Grid fluid>
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
            <Col>
              {/* Listing 1 */}
            </Col>
            <Col>
              {/* Listing 2 */}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}