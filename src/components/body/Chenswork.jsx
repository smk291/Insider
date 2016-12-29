import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

const CityMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={13}
    center={{ lat: 47.6062, lng: -122.3321 }}
    onDragEnd={props.onCenterChanged}
  >

    {/* {props.markers.map((marker, index) => (
      <Marker
        {...marker}
        onClick={() => props.onMarkerClick(marker)}
      >
        {marker.showInfo && (
          <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
            <div>{marker.infoContent}</div>
          </InfoWindow>
        )}
      </Marker> */}
    ))}
  </GoogleMap>
));

export default class Mapz extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CityMap
        containerElement={
          <div style={{ height: `50vh`, width: `50%` }} />
        }
        mapElement={
          <div style={{ height: `50vh` }} />
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