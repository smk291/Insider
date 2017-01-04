import React from 'react'
import Panel from 'react-bootstrap/lib/Panel'
import humanize from 'underscore.string/humanize'
import capitalize from 'underscore.string/capitalize'
import Grid from 'react-bootstrap/lib/Grid'
import Jumbotron from 'react-bootstrap/lib/Jumbotron'
import Row from 'react-bootstrap/lib/Row'
import listingheader from './listingheader.css'
import Col from 'react-bootstrap/lib/Col'

export default class ListingsHeader extends React.Component {
  constructor(props) {
    super(props);
    this.queryNull = this.queryNull.bind(this);
  }

  queryNull(datum){
    return datum || ''
  }

  queryNullPrice(datum){
    if (datum){
      return `$${datum}`
    } else {
      return ''
    }
  }

  render() {
    const price = this.props.price;
    const postDate = this.props.post_date;
    const bedrooms = (this.props.bedrooms && this.props.bedrooms.indexOf('BR') !== -1) ? this.props.bedrooms : '';
    const title = humanize(this.props.title.replace(/\!|\@|\#|\%|\^|\*|\=|\[|\]|\{|\}|\;|\:|\|\<|\>/gi, ''));
    const neighborhood = capitalize(this.props.neighborhood);

    return (
      <div>
          <Grid fluid>
            <Row>
              <Col sm={1} md={1}>
                <Grid>
                  <Row>
                    <Col sm={12} md={12}>
                      <span>{this.queryNull(postDate)}</span>
                    </Col>
                    <Col sm={12} md={12}>
                      <span>{this.queryNull(bedrooms)}</span>
                    </Col>
                  </Row>
                </Grid>
              </Col>
              <Col sm={10} md={10}>
                <Grid>
                  <Row>
                    <Col sm={12} md={12}><span  className={listingheader.title}>{this.queryNull(title)}</span></Col>
                    <Col sm={2} md={2}><span className="price">{this.queryNullPrice(price)}</span></Col>
                    <Col sm={8} md={8}><span className="neighborhood">{this.queryNull(neighborhood)}</span></Col>
                  </Row>
                </Grid>
              </Col>
            </Row>
        </Grid>
      </div>
    );
  }
}