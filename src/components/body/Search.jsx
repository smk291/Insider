import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import Grid from 'react-bootstrap/lib/Grid'
import Jumbotron from 'react-bootstrap/lib/Jumbotron'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Popover from 'react-bootstrap/lib/Popover'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import Modal from 'react-bootstrap/lib/Modal'
import HeaderNavigation from '../header/HeaderNavigation'
import Footer from '../footer/Footer'
import Login from './Login'
import SignUp from './SignUp'
import axios from 'axios'
import main2 from './main2.css'
import InlineSVG from 'svg-inline-react'
import MdSearch from 'react-icons/lib/md/search'
import MdCompare from 'react-icons/lib/md/compare'
import MdMap from 'react-icons/lib/md/map'

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.scrapeList = this.scrapeList.bind(this);
    this.scrapeRows = this.scrapeRows.bind(this);
    this.scrapeNull = this.scrapeNull.bind(this);
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

  render() {
    return (
      <div>
        <Jumbotron style={{backgroundColor: '#DCE1DE'}}>
          <Grid fluid>
            <h1 style={{fontWeight: '300'}}>Search! </h1>
            <p>craigslist is indispensible when you're looking for a sublet in a major US city. craigslist is also awful. The interface is dated and user-hostile. The search functions are limited. Sorting and ranking results according to your particular needs aren't possible. Maps provide almost no information.</p>

            <p> It doesn't need to be this way. Insider shows just how easy it would be to make craigslist better, more functional , more useful, more usable.</p>
            <div>
              <Button onClick={this.scrapeNull}>get null</Button>
              <Button onClick={this.scrapeList}>get list</Button>
              <Button onClick={this.scrapeRows}>get row scrapes</Button>
              {this.props.loggedIn ? <p>Logged in!</p> : <p> Not logged in </p>}
            </div>
          </Grid>

        </Jumbotron>
        {/* <Grid className={main2.thirdsGrid}>
          <Row>
            <Col className={main2.thirds} md={4}>
              <h2><MdSearch />   Search better.</h2>
              <p className={main2.thirdsP}>Click below to set your priorities -- not just with booleans but by weighting and ranking parameters. Insider will take these into consideration and rank listings accordingly.</p>
              <p>
                <Button>Create and save search parameters »</Button>
              </p>
            </Col>
            <Col className={main2.thirds} md={4}>
              <h2><MdCompare />   Compare.</h2>
              <p className={main2.thirdsP}>Comparing listings side-by-side is ridiculously easy to implement, but no housing-search website or web app that I've used offers it. </p>
              <p>
                <Button>Compare saved listings »</Button>
              </p>
            </Col>
            <Col className={main2.thirds} md={4}>
              <h2><MdMap />   Use maps.</h2>
              <p className={main2.thirdsP}>Did you know that it's possible to style map markers? Did you know that it's possible to display information about a listing visually via its map marker? Amazing, right?</p>
              <p>
                <Button>Make mapping useful»</Button>
              </p>
            </Col>
          </Row>
        </Grid> */}
      </div>
    );
  }
}