import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
// import MapControl from './MapControl';

// Create a div to hold the control.
var controlDiv = document.createElement('div');

// Set CSS for the control border
var controlUI = document.createElement('div');
controlUI.style.backgroundColor = '#fff';
controlUI.style.border = '2px solid #fff';
controlUI.style.cursor = 'pointer';
controlUI.style.marginBottom = '22px';
controlUI.style.textAlign = 'center';
controlUI.title = 'Click to recenter the map';
controlDiv.appendChild(controlUI);

// Set CSS for the control interior
var controlText = document.createElement('div');
controlText.style.color = 'rgb(25,25,25)';
controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
controlText.style.fontSize = '16px';
controlText.style.lineHeight = '38px';
controlText.style.paddingLeft = '5px';
controlText.style.paddingRight = '5px';
controlText.innerHTML = 'Center Map';
controlUI.appendChild(controlText);


export default class MapRender extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let props = this.props;
    const CityMap = withGoogleMap(props => (
      <GoogleMap ref={props.onMapLoad} defaultZoom={13} center={{ lat: 47.6062, lng: -122.3321 }} onDragEnd={props.onCenterChanged}>
        {this.props.listings.map((el, idx) => (
          <Marker marker = {{lat: el.lat, lng: el.lon}} onClick={() => props.onMarkerClick(marker)} infoContent = {el}>
            {marker.showInfo && (
              <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
                <div>{el.infoContent}</div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    ));

    return (
      <CityMap
        containerElement={
          <div style={{ height: `100vh`, width: `100%` }} />
        }
        mapElement={
          <div style={{ height: '100%' }} />
        }
        lat={this.props.lat}
        lng={this.props.lng}
        // markers={this.props.markers}
        onMapLoad={this.props.onMapLoad}
        onCenterChanged={this.props.onCenterChanged}
        onMarkerClick={this.props.onMarkerClick}
        onMarkerClose={this.props.onMarkerClose}
        onSearchBoxMount={this.props.onSearchBoxMount}
      />
    )
  }
}