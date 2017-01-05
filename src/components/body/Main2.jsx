import React from 'react'
import { Button, Grid, Jumbotron, Row, Col, Popover, Tooltip, Modal } from 'react-bootstrap'
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

export default class Main2 extends React.Component {
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
            <h1 style={{color: '#216869', fontWeight: '300'}}>Welcome to <span className={main2.insider}>Insider</span></h1>
            <p className={main2.points}>craigslist is indispensable.</p>
            <p>Where else would you look if you were on a budget and needed a sublet or an apartment in a major US city?</p>
            <p className={main2.points}>It's also awful.</p>
            <p>I mean, it's awful in a lot of ways, but the website itself is particularly bad. It's ugly, dated and user-hostile. The search is limited and can sort by just two parameters (recency and price). The mapping is helpful only when there's one marker: unless you already know exactly what listings the map is displaying and where they are, you have no way of knowing what each marker represents until you click on it. </p>
            <p className={main2.points}>It doesn't need to be this way.</p>
            <p>Insider shows just how easy it would be to make craigslist more functional, useful and usable.</p>
            <div>
              <Button onClick={this.scrapeNull}>get null</Button>
              <Button onClick={this.scrapeList}>get list</Button>
              <Button onClick={this.scrapeRows}>get row scrapes</Button>
              {this.props.loggedIn ? <p>Logged in!</p> : <p> Not logged in </p>}
              {/* <Button onClick={console.log(this.state.list)}>log list</Button> */}
            </div>
          </Grid>

        </Jumbotron>
        <Grid className={main2.thirdsGrid}>
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
        </Grid>
      </div>
    );
  }
}