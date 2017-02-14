import React, {Component} from 'react'
import MapRender from './mapping/MapRender'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import mapstyle from './mapping/mapstyle'

// From Routing
// To MapRender
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
      </div>
    )
  }
}