import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../environment';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { firestore } from '../model/firebase';
import { collection, getDocs } from 'firebase/firestore';

type LocationType = Location.LocationObject | null;
type LocationType1 = {
  latitude: number,
  longitude: number,
  title: string,
}

export default function MapScreen({navigation}:{navigation:any}) {
  const [location, setLocation] = useState<LocationType>(null);
  const [locations, setLocations] = useState<LocationType1[]>([])
  const [region, setRegion] = useState({
    latitude: 40.193298,
    longitude: 29.074202,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();

    const fetchLocations = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'Memories'));
      const locationsData = querySnapshot.docs.map(doc => ({
        latitude: doc.data().location.latitude,
        longitude: doc.data().location.longitude,
        title: doc.data().memory,
      }));
      setLocations(locationsData);
    }
    fetchLocations();
  }, []);
  

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Mevcut Konum"
          />
        )}
        {locations.map((loc, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            title={loc.title}
          />
        ))}
      </MapView>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            console.log(data, details);
            if (details) {
              setRegion({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            }
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
            types: '(cities)', // Şehirleri filtrelemek için
          }}
          styles={{
            textInputContainer: styles.textInputContainer,
            textInput: styles.input,
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          fetchDetails={true}
          enablePoweredByContainer={false} // 'Powered by Google' yazısını kaldırmak için
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
    width: '90%',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    elevation: 4,
    padding: 8,
    borderRadius: 20,
    top: Constants.statusBarHeight,
    alignSelf: 'center',
  },
  textInputContainer: {
    width: '100%',
  },
  input: {

  },
});
