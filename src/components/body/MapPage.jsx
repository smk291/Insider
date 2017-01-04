import React, {Component} from 'react'
import MapRender from './MapRender'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import mapstyle from './mapstyle'

export default class MapPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <MapRender
          {...this.props}
        />
        <div>
          <Grid fluid>
            <Row>
              <Col md={6}>
                <div>

                </div>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    )
  }
}