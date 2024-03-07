import * as React from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Button, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
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

  React.useEffect(() => {
    getLocationPermission();
  }, [])

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
        <Marker
          draggable
          coordinate={origin}
          onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
        />
        <Marker
          draggable
          coordinate={destination}
          onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)}
        />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeColor='blue'
          strokeWidth={3}
        />
        {/* <Polyline
          coordinates={[origin, destination]}
          strokeColor='red'
          strokeWidth={3}
        /> */}
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
