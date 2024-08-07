import { CameraType, useCameraPermissions, CameraCapturedPicture, CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, ImageBackground } from 'react-native';
import { MaterialIcons, AntDesign, Entypo } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { firestore, storage, auth } from '../model/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function CameraScreen({navigation} : {navigation:any}) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [city, setCity] = useState<string|null>(null)
  const [memory, setMemory] = useState('');
  const [uploading, setUploading] = useState(false)

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if(cameraRef.current){
      const options = {qualitiy: 0.5, base64: true, mute: true} 
      const photo = await cameraRef.current.takePictureAsync(options);
      if (photo) {
        setPhoto(photo);
      }
    }
  }

  const getCityFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        console.log('Geocode result:', geocode); // Geocode sonucu kontrol et
        for (let i = 0; i < geocode.length; i++) {
          if (geocode[i].city) {
            return geocode[i].city;
          } else if (geocode[i].subregion) {
            return geocode[i].subregion;
          } else if (geocode[i].region) {
            return geocode[i].region;
          }
        }
      }
      return 'Unknown City';
    } catch (error) {
      console.error('Error in reverseGeocodeAsync:', error);
      return 'Unknown City';
    }
  };

  const getLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);

    let city = await getCityFromCoordinates(location.coords.latitude, location.coords.longitude);
    setCity(city);
  }

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `images/${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }

  const savePhoto = async () => {
    if(photo && location && memory ){
      setUploading(true);
      try {
        const imageUrl = await uploadImage(photo.uri);
        await addDoc(collection(firestore, 'Memories'), {
          imageUrl,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            city: city,
          },
          memory,
          timestamp: serverTimestamp(),
          email: auth.currentUser?.email,
        })
        alert('Memory saved successfully!');
        setPhoto(null);
        setLocation(null);
        setCity(null);
        setMemory('');
        console.log("Fotoğraf, konum ve anı başarıyla kaydedildi!");
        console.log('Fotoğraf URI: ', photo.uri);
        console.log('Konum: ', location);
        console.log('Anı: ', memory);
      } catch (error) {
        console.error('Error saving memory: ', error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please fill all fields and take a photo')
    }
  };

  const returnBack = () => {
    setPhoto(null);
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.preview}>
            <ImageBackground source={{uri: photo.uri}} style={styles.photo}>
              <TouchableOpacity style={styles.backButton} onPress={returnBack}>
                <Text><AntDesign name="arrowleft" size={24} color="white" /></Text>
              </TouchableOpacity>
              <View style={styles.inputs}>
                <View style={styles.inputContainer}>
                  <TouchableOpacity style={styles.button} onPress={getLocation}>
                    <Text style={styles.text}><MaterialIcons name="location-on" size={18} color="white" /> Konum Ekle</Text>
                  </TouchableOpacity>
                  <TextInput 
                    style={styles.input}
                    placeholder='Anı Ekle'
                    onChangeText={setMemory}
                    value={memory}
                  />
                </View>
                <TouchableOpacity style={styles.buttonSave} onPress={savePhoto} disabled={uploading}>
                  <Text style={styles.saveText}>{uploading ? 'Kaydediliyor...' : 'Kaydet'}</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
        </View>
      ) : (
        <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}><MaterialIcons name="flip-camera-android" size={32} color="black" /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}><Entypo name="circle" size={40} color="black" /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.text}><AntDesign name="left" size={32} color="black" /></Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    alignSelf: 'center',
    width: '90%',
    margin: 10,
  },
  button: {
    flex: 1,
    height: 45,
    marginBottom: 10,
    paddingLeft: 10,
    color: 'white',
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  preview: {
    flex: 1,
  },
  photo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 40,
  },
  inputs: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    paddingLeft: 10,
    flex: 1,
    color: 'white',
    marginHorizontal: 5,
  },
  buttonSave: {
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
