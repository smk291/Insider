import React from 'react'
import {Button, Grid, Row, Col, Tooltip, Accordion, Panel, ListGroup, ListGroupItem, Table, Pager} from 'react-bootstrap'
import main2 from './main2.css'
import ListingHeader from './ListingHeader'
import humanize from 'underscore.string/humanize'

export default class ListingsViewFiltered extends React.Component {
  constructor(props) {
    super(props);
    this.decrementFiltered = this.decrementFiltered.bind(this)
    this.incrementFiltered = this.incrementFiltered.bind(this)
  }

  decrementFiltered(e){
    this.props.decrementFiltered(e);
  }

  incrementFiltered(e){
    this.props.incrementFiltered(e);
  }

  render() {
    return (
      <div>
      {this.props.filteredList.length && this.props.filteredList.length > 0 ? <div>
        <Accordion style={{overflow: 'hidden', height: '65vh', fontWeight: 400}}>
          {this.props.filteredList.slice(this.props.start,this.props.stop).map((el, key) => {
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
                <Grid>
                  <Row>
                    <Col sm={5} md={5}>
                      <Table striped bordered condensed hover>
                        <tbody>
                          <tr>
                            <td>Type of housing:</td>
                            <td>{el.housing_types ? humanize(el.housing_types) : 'Blank'}</td>
                          </tr>
                          <tr>
                            <td>Square feet:</td>
                            <td>{el.sqft ? el.sqft + 'ft2' : 'Blank'}</td>
                          </tr>
                          <tr>
                            <td>Private room?</td>
                            <td>{el.private_room_types ? el.private_room_types : 'Blank'}</td>
                          </tr>
                          <tr>
                            <td>Private bath?</td>
                            <td>{el.bath_types ? el.bath_types : 'Blank'}</td>
                          </tr>
                          <tr>
                            <td>Furnished?</td>
                            <td>{el.furnished_type ? el.furnished_type: 'Blank'}</td>
                          </tr>
                          <tr>
                            <td>Laundry?</td>
                            <td>{el.laundry_types ? humanize(el.laundry_types): 'Blank'}</td>
                          </tr>
                          <tr>
                            <td>Parking?</td>
                            <td>{el.parking_types ? humanize(el.parking_types): 'Blank'}</td>
                          </tr>

                        </tbody>
                      </Table>
                    </Col>
                    <Col sm={5} md={5}>
                      <Table striped bordered condensed hover>
                        <tbody>
                          <tr>
                            <td>Description:</td>
                            <td>{humanize(el.descr)}</td>
                          </tr>
                          <tr>
                            <td>Street address?</td>
                            <td>{el.street_address ? el.street_address: 'Blank'}</td>
                          </tr>
                          <tr>
                            <td>Wheelchair accessible?</td>
                            <td>{el.wheelchair_accessible ? el.wheelchair_accessible: 'Blank'}</td>
                          </tr>
                        </tbody>
                      </Table>
                      <p></p>
                      <p>{el.cat_types ? el.cat_types: ''}</p>
                      <p>{el.dog_types ? el.dog_types: ''}</p>
                      <p>{el.smoking_types ? el.smoking_types : ''}</p>
                      <a href={`http://seattle.craigslist.org${el.url}`}>Open the ad on craigslist</a>
                    </Col>
                  </Row>
                </Grid>
            </Panel>
            })}
        </Accordion>
        <Pager>
          <Pager.Item onSelect={this.decrementFiltered} previous href="#">&larr; Previous Page</Pager.Item>
          <p style={{display: 'inline-block'}}>Listings {this.props.start + 1} - {this.props.stop + 1}</p>
          <Pager.Item onSelect={this.incrementFiltered} next href="#">Next Page &rarr;</Pager.Item>
        </Pager> </div>: ''}
      </div>
    );
  }
}