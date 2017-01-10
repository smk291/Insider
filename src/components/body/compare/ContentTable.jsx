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
        <div className = 'panel panel-default'>
          <div style={{margin: '0px 20px', padding: '20px 20px'}} className='panel-body'>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>
                <h2 style={{margin: '20px', height: '2em'}}><MdCompare size="60"/></h2>
              </th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </Table>
        <Table>
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
            <tr>
              <td>How many photos?</td>
            </tr>
            <tr>
              <td>Are cats allowed?</td>
            </tr>
            <tr>
              <td>Are dogs allowed?</td>
            </tr>
            <tr>
              <td>Is smoking allowed</td>
            </tr>
            <tr>
              <td>Wheelchar accessible</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  </div>
    );
  }
}