import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../environment';
import  Constants  from 'expo-constants';
import * as Location from 'expo-location';

type LocationType = Location.LocationObject | null;

export default function MapScreen() {
    const [location, setLocation] = useState<LocationType>(null);

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted'){
                console.log("Permisson to access location was denied");
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })
    }, [])

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_GOOGLE}
        initialRegion={{
            latitude: location ? location.coords.latitude : 40.193298,
            longitude: location ? location.coords.longitude : 29.074202,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }}>
        <Marker
            coordinate= {{
                latitude: location ? location.coords.latitude : 40.193298,
                longitude: location ? location.coords.longitude : 29.074202,
            }}
        />
      </MapView>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
            styles={{textInput: styles.input}}
            placeholder='Search'
            onPress={(data, details = null) => {
                console.log(data, details);
            }}
            query={{
                key: GOOGLE_API_KEY,
                language: 'en',
            }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    width: "90%",
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    elevation: 4,
    padding: 8,
    borderRadius: 20,
    top: Constants.statusBarHeight,
    alignSelf: 'center',
  },
  input: {

  }
});
