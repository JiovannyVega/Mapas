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

  const [markers, setMarkers] = useState([]);

  const [hasAdded, setHasAdded] = useState(false);

  const addMarkers = () => {
    if (!currentLocation) {
      alert('Current location is not available');
      return;
    }

    const { latitude, longitude } = currentLocation;
    const offset = 0.0005; // puedes ajustar este valor según tus necesidades

    const newMarkers = [
      { latitude: latitude + offset, longitude: longitude + offset },
      { latitude: latitude - offset, longitude: longitude + offset },
      { latitude: latitude - offset, longitude: longitude - offset },
      { latitude: latitude + offset, longitude: longitude - offset },
    ];
    setMarkers(newMarkers);
    setHasAdded(true);
  }

  const addMarker = () => {
    if (markers.length >= 10) {
      alert('No puedes agregar más de 10 marcadores');
      return;
    }

    const firstMarker = markers[0];
    const lastMarker = markers[markers.length - 1];
    const newMarker = {
      latitude: (firstMarker.latitude + lastMarker.latitude) / 2,
      longitude: (firstMarker.longitude + lastMarker.longitude) / 2,
    };
    setMarkers([...markers, newMarker]);
  }

  const removeMarker = () => {
    if (markers.length <= 3) {
      alert('Debes tener al menos 3 marcadores');
      return;
    }

    setMarkers(markers.slice(0, -1)); // elimina el último marcador
  }

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
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
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
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
          zoom: 50
        }}
        mapType='hybrid'
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            pinColor="blue"
          />
        )}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            draggable
            title={`${index + 1}`}
            onDragEnd={(e) => {
              const newMarkers = [...markers];
              newMarkers[index] = e.nativeEvent.coordinate;
              setMarkers(newMarkers);
            }}
          />
        ))}
        <Polygon
          coordinates={polygonCoordinates}
          strokeColor="#FFFF00"
          strokeWidth={2}
          fillColor="rgba(0, 128, 0, 0.5)"
        />
        {markers.length > 0 && (
          <Polygon
            coordinates={markers}
            strokeColor="#FFFF00"
            strokeWidth={2}
            fillColor="rgba(0, 128, 0, 0.5)"
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Get Location" onPress={getLocationPermission} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Add" onPress={addMarkers} disabled={hasAdded} />
        </View>
        {hasAdded && (
          <>
            <View style={styles.buttonWrapper}>
              <Button title="Add Point" onPress={addMarker} disabled={markers.length >= 10} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Remove Point" onPress={removeMarker} disabled={markers.length <= 3} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Guardar" />
            </View>
          </>
        )}
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
    position: 'absolute', // Posiciona el contenedor de los botones de manera absoluta
    bottom: 50, // Coloca el contenedor de los botones 50 píxeles por encima del borde inferior de la pantalla
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 20,
    flexWrap: 'wrap',
  },
  buttonWrapper: {
    flex: 1,
    margin: 10,
    minWidth: '40%', // Asegura que cada botón tenga al menos el 40% del ancho de la pantalla
  },
});
