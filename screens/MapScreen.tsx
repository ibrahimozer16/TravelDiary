import React, { useEffect, useReducer, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, TouchableOpacity, View, Modal, Text, Image } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../environment';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { auth, firestore } from '../model/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type LocationType = Location.LocationObject | null;
type LocationType1 = {
  latitude: number,
  longitude: number,
  title: string,
}

export default function MapScreen({navigation, route}:{navigation:any, route:any}) {
  const { memories } = route.params;
  const {t} = useTranslation();
  const mapRef = useRef<MapView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
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
        console.log(t('locationPermissionDenied'));
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
      const currentUser = auth.currentUser;
      if(!currentUser){
        console.log(t('noUserSignedIn'));
        return;
      }
      const q = query(collection(firestore, 'Memories'), where('email', '==', currentUser.email))
      const querySnapshot = await getDocs(q);
      const locationsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log(data);
        return {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          title: data.memory,
          city: data.location.city,
        }
      });
      setLocations(locationsData);
    }
    fetchLocations();
  }, []);

  const handleMarkerPress = (loc:any) => {
    console.log("Marker pressed:", loc);
    setSelectedMemory(loc);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const goToMemory = () => {
    closeModal();
    navigation.navigate('Memory', {memory: selectedMemory});
  }

  const moveToLocation = async (lat: any, lng: any) => {
    if (mapRef.current) {  // mapRef'in null olmadığını kontrol edin
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
        2000
      );
    } else {
      console.error("Map reference is null.");
    }
  };
  

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
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
            title={t('currentLocation')}
            pinColor='blue'
          />
        )}
        {memories.map((memory:any, index:any) => (
          <Marker
            key={index}
            coordinate={{
              latitude: memory.location.latitude,
              longitude: memory.location.longitude,
            }}
            title={memory.title}
            onPress={() => handleMarkerPress(memory)}
          />
        ))}
      </MapView>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{selectedMemory?.title || t('noTitleInfo')}</Text>
            <Image source={{uri: selectedMemory?.imageUrl}} style={styles.image} />
            <TouchableOpacity style={styles.button} onPress={goToMemory}>
              <Text style={styles.buttonText}>{t('goToMemory')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.searchContainer}>
        <View style={{zIndex: 1, flex: 0.5}}>
          <GooglePlacesAutocomplete
            fetchDetails={true}
            placeholder={t('searchLocation')}
            onPress={(data, details = null) => {
              console.log(JSON.stringify(data));
              console.log(JSON.stringify(details?.geometry?.location));
              moveToLocation(details?.geometry?.location.lat, details?.geometry?.location.lng)
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
            }}
            onFail={error => console.log(error)}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
          <Feather name="home" size={32} color="black"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => {
          if (location) {
            setRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        }}>
          <Feather name="map-pin" size={32} color="black"/>
        </TouchableOpacity>
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
    width: '100%',
  },
  image: {
    width: 100,
    height: 150,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'red',
  },
});
