import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import Grid from 'react-bootstrap/lib/Grid'
import Jumbotron from 'react-bootstrap/lib/Jumbotron'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import main2 from './main2.css'
import Accordion from 'react-bootstrap/lib/Accordion'
import Panel from 'react-bootstrap/lib/Panel'
import ListingHeader from './ListingHeader'

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
        <Button onClick={this.getListings}>get listings</Button>
          <Grid fluid>
            <h1 style={{fontWeight: '300'}}>Listings! </h1>
            <div>
                <Row>
                  <Col md={6}>
                    <Accordion style={{overflow: 'hidden'}}>
                      {this.props.listings.map((el, key) => {
                        return <Panel
                          style={{margin: '0px', borderRadius: '0px'}}
                          key={key}
                          eventKey={key}
                          header={
                            <div>
                              <ListingHeader
                                price={el.price}
                                title={el.title}
                                bedrooms={el.bedrooms}
                                neighborhood={el.neighborhood}
                                neighborhood={el.neighborhood}
                                post_date={el.post_date}
                              />
                            </div>}
                          >
                            <p>{el.descr}</p>
                        </Panel>
                        })}
                    </Accordion>
                  </Col>
                </Row>

                  <Row>
                    <Col>
                    <Grid>
                    </Grid>
                  </Col>
                  </Row>
                  <Row>
                    <Col>

                    </Col>
                  </Row>
            </div>
          </Grid>
      </div>
    );
  }
}