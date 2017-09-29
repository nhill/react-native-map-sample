import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager, Text, Image, InteractionManager } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { MapView, Location } from 'expo';

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
const MAP_LOADING_DELAY = 300;
const windowWidth = Dimensions.get('window').width;

class Map extends Component {

  state = {
    location: { coords: {latitude: 0, longitude: 0}},
    markers: [],
    initialRender: true,
    isLoading: true
  };

  componentWillMount() {
    Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      window.setTimeout(() => {
        this.setState({
          isLoading: false
        });
      }, MAP_LOADING_DELAY);
    });
  }

  locationChanged = (location) => {
    region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    },
    this.setState({location, region});
    this.setState({markers: [
      {
        title: 'Me',
        description: 'Im here',
        latlng: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        isUser: true
      },
      {
        title: 'Another Person',
        description: 'Over here',
        latlng: {
          latitude: location.coords.latitude+0.001,
          longitude: location.coords.longitude+.001
        },
        isUser: false
      }
    ]});
  }

  renderMarkers() {
    return this.state.markers.map((marker, index) => this.renderMapMarker(marker));
  }

  renderMapMarker(marker) {
    if(marker.isUser === true){
      return (
        <MapView.Marker
          key={marker.title}
          coordinate={marker.latlng}
          title={marker.title}
          description={marker.description}
        >
          <Image
            source={require('../assets/icons/person.jpg')}
            onLayout={() => this.setState({ initialRender: false })}
            key={`${this.state.initialRender}`}
            style={styles.iconUser}
          />
          <MapView.Callout style={{width: windowWidth * .8}}>
            <View>
              <Card title={marker.title} style={{width: windowWidth * .8}}>
                <Text style={{marginBottom: 10}}>
                  {marker.description}
                </Text>
                <Button icon={{name: 'code'}} backgroundColor="#03A9F4" title="My Profile" />
              </Card>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      );
    }else{
      return (
        <MapView.Marker
          key={marker.title}
          coordinate={marker.latlng}
          title={marker.title}
          description={marker.description}
        >
          <Image
            source={require('../assets/icons/person.jpg')}
            onLayout={() => this.setState({ initialRender: false })}
            key={`${this.state.initialRender}`}
            style={styles.icon}
          />
          <MapView.Callout style={{width: windowWidth * .8}}>
            <View>
              <Card title={marker.title} style={{width: windowWidth * .8}}>
                <Text style={{marginBottom: 10}}>
                  {marker.description}
                </Text>
                <Button icon={{name: 'code'}} backgroundColor="#03A9F4" title="Chat Now" />
              </Card>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      );
    }
  }


  render() {
    return (
      <View style={{flex: 1}}>
        <MapView
          style={{flex: 1}}
          initialRegion={this.state.region}
        >
          {this.state.isLoading ? <View /> : this.renderMarkers()}
        </MapView>
      </View>
    );
  }

}

const styles = {
  icon: {
    width: 60,
    height: 60,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#fff',
  },
  iconUser: {
    width: 60,
    height: 60,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: 'red',
  }
}

export default Map;
