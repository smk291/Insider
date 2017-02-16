import React from 'react'
import {
  Table,
  Button,
  Grid,
  Jumbotron,
  Row,
  Col,
  Popover,
  Tooltip,
  Modal
} from 'react-bootstrap'
import primary from './primary.css'
import InlineSVG from 'svg-inline-react'
import MdSearch from 'react-icons/lib/md/search'
import MdCompare from 'react-icons/lib/md/compare'
import MdMap from 'react-icons/lib/md/map'
// import ContentTable from './compare/ContentTable'
import axios from 'axios'
import Listing from './compare/Listing.jsx'

class ContentTable extends React.Component {
  render() {
    const fields = [
      'Housing type',
      'Monthly Rent',
      'No. of Bedrooms',
      'Square feet',
      'Private room',
      'Private bath',
      'Furnished space?',
      'Washer / Dryer',
      'Parking options',
      'How many photos',
      'Are cats allowed',
      'Are dogs allowed',
      'Is smoking allowed',
      'Wheelchair accessibility',
      'Street Address',
      'Description'
    ];

    return (
      <div style={{
        marginTop: '72px'
      }}>
        <div className='panel panel-default'>
          <div style={{
            margin: '0px 20px',
            padding: '20px 0px'
          }} className='panel-body'>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>
                    <h2 style={{
                      margin: '20px',
                      height: '2em',
                      textAlign: 'center'
                    }}><MdCompare size="60"/></h2>
                  </th>
                </tr>
              </thead>
            </Table>
            <Table>
              <tbody style={{
                textAlign: 'center'
              }}>
                {fields.map((field) => <tr>
                  <td>{field}</td>
                </tr>)}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default class Compare extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getFavorites();
  }

  render() {
    const AddFavorites = () => {
      return (
        <div className='panel panel-default' style={{
          height: '722px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px',
          padding: '80px'
        }}>
          <div>
            <h1>Save Favorites to compare them side-by-side</h1>
          </div>
        </div>
      )
    }

    return (
      <div>
        <Grid fluid style={{
          minWidth: '1000px'
        }}>
          <Row style={{
            display: 'flex',
            justifyContent: 'center'
          }}></Row>
          {this.props.userFavorites.length > 0
            ? <Row style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Col md={5} sm={5}>
                  <Listing
                    listing={this.props.comparison1}
                    comparison={this.props.comparison1}
                    activePage={this.props.activePage1}
                    userFavorites={this.props.userFavorites}
                    pageChange={this.props.pageChange}
                    fetchAndFormatFavorites={this.props.fetchAndFormatFavorites}
                    alignment='right'
                    comparisonPage='comparison1'
                    activePageNum='activePage1'
                    otherPage={this.props.activePage2}
                  />
                </Col>
                <Col md={2}>
                  <ContentTable/>
                </Col>
                <Col md={5} sm={5}>
                  <Listing
                    listing={this.props.comparison2}
                    comparison={this.props.comparison2}
                    activePage={this.props.activePage2}
                    userFavorites={this.props.userFavorites}
                    pageChange={this.props.pageChange}
                    fetchAndFormatFavorites={this.props.fetchAndFormatFavorites}
                    alignment='left' 
                    comparisonPage='comparison2'
                    activePageNum='activePage2'
                    otherPage={this.props.activePage1}
                  />
                </Col>
              </Row>
            : <Row>
              <Col><AddFavorites md={10}/></Col>
            </Row>}
        </Grid>
      </div>
    );
  }
}