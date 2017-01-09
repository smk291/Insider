import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';

export default class MapRender extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let markers = this.props.markers;
    let marker = {
      // animation: null,
      // attribution: null,
      clickable: true,
      // cursor: null,
      // draggable: null,
      // icon: null,
      // label: null,
      // opacity: null,
      // options: null,
      // place: null,
      // position: null,
      // shape: null,
      title: 'Listing!',
      visible: true,
      zIndex: 9
    }
    const CityMap = withGoogleMap(props => (
      <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={13}
        center={{ lat: 47.6062, lng: -122.3321 }}
      >
        <MarkerClusterer
          averageCenter
          enableRetinaIcons
          gridSize={30}
        >
          {markers.map((el, idx) => (
            <Marker
              key={idx}
              position = {{lat: Number(el.lat), lng: Number(el.lon)}}
              onClick={() => props.onMarkerClick(el)}
              infoContent = {el}
            >
            {el.showInfo && (
              <InfoWindow onCloseClick={() => props.onMarkerClose(el)}>
                <div>{el.infoContent}</div>
              </InfoWindow>
            )}
            </Marker>
          ))}
        </MarkerClusterer>
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
        // lat={this.props.lat}
        // lng={this.props.lng}
        // markers={this.props.markers}
        // onMapLoad={this.props.onMapLoad}
        // onCenterChanged={this.props.onCenterChanged}
        // onMarkerClick={this.props.onMarkerClick}
        // onMarkerClose={this.props.onMarkerClose}
        // onSearchBoxMount={this.props.onSearchBoxMount}
      />
    )
  }
}