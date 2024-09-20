import { CameraType, useCameraPermissions, CameraCapturedPicture, CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, ImageBackground, Modal } from 'react-native';
import { MaterialIcons, AntDesign, Entypo } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { firestore, storage, auth } from '../model/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export default function CameraScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [score, setScore] = useState('');

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{t('cameraGranted')}</Text>
        <Button onPress={requestPermission} title={t('grantPermission')} />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, mute: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      if (photo) {
        setPhoto(photo);
      }
    }
  };

  const getCityFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
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
      return t('unknownCity');
    } catch (error) {
      console.error(t('errorReverseGeocode'), error);
      return t('unknownCity');
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert(t('locationPermissionDenied'));
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);

    let city = await getCityFromCoordinates(location.coords.latitude, location.coords.longitude);
    setCity(city);
    alert('Konum Kaydedildi!');
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `images/${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const savePhoto = async () => {
    if (photo && location && title && content && score) {
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
          title,
          content,
          score,
          timestamp: serverTimestamp(),
          email: auth.currentUser?.email,
        });
        alert(t('memorySavedSuccessfully'));
        setPhoto(null);
        setLocation(null);
        setCity(null);
        setTitle('');
        setContent('');
        setScore('');
        navigation.navigate('Home');
      } catch (error) {
        console.error(t('errorSavingMemory'), error);
      } finally {
        setUploading(false);
      }
    } else {
      alert(t('fillAllFields'));
    }
  };

  const handleAddMemory = () => {
    setModalVisible(false);
  };

  const handleScoreChange = (text: string) => {
    const numericValue = parseFloat(text);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 5) {
      setScore(text);
    } else if (text === '') {
      setScore('');
    }
  };

  const returnBack = () => {
    setPhoto(null);
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.preview}>
          <ImageBackground source={{ uri: photo.uri }} style={styles.photo}>
            <TouchableOpacity style={styles.backButton} onPress={returnBack}>
              <Text>
                <AntDesign name="arrowleft" size={24} color="white" />
              </Text>
            </TouchableOpacity>
            <View style={styles.inputs}>
              <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.button} onPress={getLocation}>
                  <Text style={styles.text}>
                    <MaterialIcons name="location-on" size={18} color="white" />
                    {t('addLocation')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                  <Text style={styles.text}>{t('addMemory')}</Text>
                </TouchableOpacity>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>{t('memoryTitle')}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder={t('titlePlaceholder')}
                        value={title}
                        onChangeText={setTitle}
                      />
                      <Text style={styles.modalText}>{t('memoryContent')}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder={t('contentPlaceholder')}
                        value={content}
                        onChangeText={setContent}
                        multiline
                      />
                      <Text style={styles.modalText}>{t('memoryScore')}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder={t('scorePlaceholder')}
                        value={score}
                        onChangeText={handleScoreChange}
                        keyboardType="decimal-pad"
                      />
                      <View style={styles.buttonContainer1}>
                        <Button title={t('cancel')} onPress={() => setModalVisible(false)} />
                        <Button title={t('save')} onPress={handleAddMemory} />
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
              <TouchableOpacity style={styles.buttonSave} onPress={savePhoto} disabled={uploading}>
                <Text style={styles.saveText}>{uploading ? t('saving') : t('save')}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      ) : (
        <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>
                <MaterialIcons name="flip-camera-android" size={32} color="white" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>
                <Entypo name="circle" size={40} color="white" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.text}>
                <AntDesign name="left" size={32} color="white" />
              </Text>
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
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  buttonSave: {
    padding: 10,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonContainer1: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    marginTop: 5,
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
  modalText: {
    marginTop: 10,
    fontSize: 18,
    textAlign: 'center',
  },
});
