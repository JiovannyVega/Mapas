import React, { useRef, useState } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Button, View } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '@env';

export default function App() {

  const [origin, setOrigin] = React.useState({
    latitude: 22.702841,
    longitude: -99.010740
  })

  const [destination, setDestination] = React.useState({
    latitude: 22.745604,
    longitude: -98.983326
  })

  const polygonCoordinates = [
    { latitude: 22.718482, longitude: -99.007534 },
    { latitude: 22.718487, longitude: -99.005292 },
    { latitude: 22.715913, longitude: -99.005362 },
    { latitude: 22.715917, longitude: -99.007279 },
    { latitude: 22.717423, longitude: -99.007225 },
    { latitude: 22.717465, longitude: -99.007527 },

  ];

  React.useEffect(() => {
    getLocationPermission();
  }, [])

  const [currentLocation, setCurrentLocation] = useState(null);

  const mapRef = React.useRef();

  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }

    // Animate the map to the current location
    setCurrentLocation(current);
    mapRef.current.animateToRegion(current, 500); // 500ms animation duration
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType='hybrid'
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            pinColor="blue"
          />
        )}
        <Polygon
          coordinates={polygonCoordinates}
          strokeColor="#FFFF00"
          strokeWidth={2}
          fillColor="rgba(0, 128, 0, 0.5)"
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Get Location" onPress={getLocationPermission} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
