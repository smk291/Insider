import React from 'react'
import {Button, HelpBlock, ButtonGroup, FormGroup, ControlLabel, FormControl,Grid, Jumbotron, Row, Col, Popover, Tooltip, Modal, Checkbox } from 'react-bootstrap'
import main2 from './main2.css'
import InlineSVG from 'svg-inline-react'
import ListingsView from './ListingsView'

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.checkboxHandleChange = this.checkboxHandleChange.bind(this)
  }

  handleChange(e){
    this.props.handleChange(e);
  }

  handleCheckbox(e){
    this.props.handleCheckbox(e)
  }

  checkboxHandleChange(e, field){
    this.props.checkboxHandleChange(e, field);
  }

  render() {
    return (
      <div>
        <Button onClick={this.getListings}>get listings</Button>
          <Grid fluid>
            <h1 style={{fontWeight: '300'}}>Listings! </h1>
            <div>
              <form>
                <FormGroup>
                  <ControlLabel>Min. bedrooms</ControlLabel>
                  <FormControl
                    id="bedroomsMin"
                    name="minBedrooms"
                    type="number"
                    label="Min. bedrooms"
                    placeholder=" "
                    min="0"
                    value={this.props.minBedrooms}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Max bedrooms</ControlLabel>
                  <FormControl
                    id="bedroomsnMax"
                    name="maxBedrooms"
                    type="number"
                    label="Max. bedrooms"
                    placeholder="0"
                    min={this.props.minBedrooms}
                    value={this.props.maxBedrooms}
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Min. rent</ControlLabel>
                  <FormControl
                    id="rentMin"
                    type="number"
                    label="Min. rent"
                    placeholder="0"
                    min={0}
                    step={100}
                    name="minRent"
                    value={this.props.minRent}
                    onChange={this.handleChange}
                  />
                  <ControlLabel>Max rent</ControlLabel>
                  <FormControl
                    id="rentMax"
                    type="number"
                    label="Max. rent"
                    placeholder="0"
                    step={100}
                    min={this.props.minRent}
                    name="maxRent"
                    value={this.props.maxRent}
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <ControlLabel>Types of housing</ControlLabel>
                  {this.props.housingTypes.map((type, idx) => {
                    return <Checkbox
                      key={idx}
                      type="checkbox"
                      checked={this.props[type]}
                      // onChange={this.handleCheckbox}
                      onChange={this.checkboxHandleChange.bind(this, type)}
                      >{type}</Checkbox>
                  })}
                    {/* <Checkbox type="checkbox" onChange={this.handleCheckBox} checked={this.state.checked} /> */}

                  {/* })} */}
              </form>
                <Row>
                  <Col md={6}>
                    <ListingsView
                      {...this.props}
                    />
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

/* <FormGroup controlId={}>
  <ControlLabel>{}</ControlLabel>
  <FormControl
    type="text"
    value={}
    id="searchButton"
    ref="input"
    className="searchButton"
    onKeyUp={}
    onChange={}
    buttonAfter={}
    placeholder="Search..."
  /> */

/*
  function FieldGroup({ id, label, help, ...props }) {
  return (
  <FormGroup controlId={id}>
  <ControlLabel>{label}</ControlLabel>
  <FormControl {...props} />
  {help && <HelpBlock>{help}</HelpBlock>}
</FormGroup>
);
}

sqft
price - min and max

laundry type
table.enu('laundry_types', ['laundry on site', 'w/d in unit', 'laundry in bldg', null]).defaultTo(null);
<ButtonGroup justified>
<Button href="#">Left</Button>
<Button href="#">Middle</Button>
<DropdownButton title="Dropdown" id="bg-justified-dropdown">
<MenuItem eventKey="1">Dropdown link</MenuItem>
<MenuItem eventKey="2">Dropdown link</MenuItem>
</DropdownButton>
</ButtonGroup>
parking type
table.enu('parking_types', ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking', null]).defaultTo(null);
<ButtonGroup justified>
<Button href="#">Left</Button>
<Button href="#">Middle</Button>
<DropdownButton title="Dropdown" id="bg-justified-dropdown">
<MenuItem eventKey="1">Dropdown link</MenuItem>
<MenuItem eventKey="2">Dropdown link</MenuItem>
</DropdownButton>
</ButtonGroup>
bath type
table.enu('bath_types', ['private bath', 'no private bath', null]).defaultTo(null);

private room type
table.enu('private_room_types', ['private room', 'room not private', null]).defaultTo(null);

cat type
table.enu('cat_types', ['cats are OK - purrr', null]).defaultTo(null);

dog type
table.enu('dog_types', ['dogs are OK - wooof', null]).defaultTo(null);

furnished type
table.enu('furnished_types', ['furnished', null]).defaultTo(null);

smoking_types
table.enu('smoking_types', ['no smoking', null]).defaultTo(null);

wheelchair accessible
table.enu('wheelchair_types', ['wheelchair accessible', null]).defaultTo(null);


table.jsonb('photos');

});
};


exports.down = (knex) => {
return knex.schema.dropTable('listings');
}; */
