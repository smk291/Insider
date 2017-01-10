import React from 'react'
import { Button, Grid, Jumbotron, Row, Col, Popover, Tooltip, Modal, Table } from 'react-bootstrap'
import primary from '../primary.css'
import InlineSVG from 'svg-inline-react'
import MdSearch from 'react-icons/lib/md/search'
import MdCompare from 'react-icons/lib/md/compare'
import MdMap from 'react-icons/lib/md/map'

export default class ContentTable extends React.Component {
  render() {
    return (
      <div>
        <Table striped bordered condensed hover>
          <tbody>
            <tr>
              <td>Type of housing:</td>
            </tr>
            <tr>
              <td>Square feet:</td>
            </tr>
            <tr>
              <td>Private room?</td>
            </tr>
            <tr>
              <td>Private bath?</td>
            </tr>
            <tr>
              <td>Furnished?</td>
            </tr>
            <tr>
              <td>Laundry?</td>
            </tr>
            <tr>
              <td>Parking?</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}