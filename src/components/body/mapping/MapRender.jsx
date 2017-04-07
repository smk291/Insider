import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';
import InlineSVG from 'svg-inline-react'
import MdLocationCity from 'react-icons/lib/md/location-city'
import MdHome from 'react-icons/lib/md/home'
import MdLandscape from 'react-icons/lib/md/landscape'
import MdMoodBad from 'react-icons/lib/md/mood-bad'
import MdNaturePeople from 'react-icons/lib/md/nature-people'

export default class MapRender extends React.Component {
  constructor(props) {
    super(props);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerClose = this.handleMarkerClose.bind(this);
    this.state = {
      markers: this.props.markers.map(el => {
        el.showInfo = false;
        return el
      }),
      icons: {
        'apartment': <MdLocationCity />,
        'condo': <MdLocationCity />,
        'house': <MdHome />,
        'townhouse': <MdHome />,
        'duplex': <MdHome />,
        'land': <MdLandscape />,
        'in-law': <MdMoodBad />,
        'cottage': <MdNaturePeople />,
        'cabin': <MdNaturePeople />,
      }
    }
  }

  // Toggle to 'true' to show InfoWindow and re-renders component
  handleMarkerClick(targetMarker, e) {
    this.setState({markers: this.state.markers.map(marker => {
      if (marker === targetMarker) {
        marker.showInfo = true;
        return marker;
      };

      return marker;
      })
    });
  }

  handleMarkerClose(targetMarker, e) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          marker.showInfo = false;
          return marker;
        };

        return marker;
        }),
    });
  }


  render() {
    let marker = {
      // animation: null,
      // attribution: null,
      clickable: true,
      // cursor: null,
      // draggable: null,
      icon: null,
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
        // ref={props.onMapLoad}
        defaultZoom={13}
        center={{ lat: 47.6062, lng: -122.3321 }}
      >
        <MarkerClusterer
          averageCenter
          enableRetinaIcons
          gridSize={30}
        >
          {this.state.markers.map((el, idx) => (<Marker
            key={idx}
            position = {{lat: Number(el.lat), lng: Number(el.lon)}}
            onClick={() => this.handleMarkerClick(el)}
            infoContent = {<DisplayedAd
              displayAd={this.props.displayAd}
              saveToFavorites={this.props.saveToFavorites}
                           />}
                                                >
            {el.showInfo && (
              <InfoWindow onCloseClick={() => this.handleMarkerClose(el)}>
                <div>{<DisplayedAd
                  displayAd={el}
                  saveToFavorites={this.props.saveToFavorites}
                      />}</div>
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
          <div style={{ height: `94vh`, width: `100%` }} />
        }
        mapElement={
          <div style={{ height: '100%' }} />
        }
        lat={this.props.lat}
        lng={this.props.lng}
        markers={this.state.markers}
        // onMapLoad={this.props.onMapLoad}
        onMarkerClick={this.handleMarkerClick}
        onMarkerClose={this.handleMarkerClose}
      />
    )
  }
}