import React from 'react'
import {Button, Grid, Jumbotron, Row, Col, Tooltip, Accordion, Panel} from 'react-bootstrap'
import main2 from './main2.css'
import ListingHeader from './ListingHeader'

export default class ListingsView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Accordion style={{overflow: 'hidden'}}>
          {this.props.listings.slice(0,10).map((el, key) => {
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
      </div>
    );
  }
}