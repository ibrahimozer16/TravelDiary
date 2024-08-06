import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, FlatList } from 'react-native';
import React, { useReducer, useState } from 'react';
import { firestore, storage } from '../model/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AntDesign, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

export default function EditScreen({ route, navigation }: { route: any, navigation: any }) {
  const { memory } = route.params || {};
  const initialState = { memory: memory.memory, imageUrl: memory.imageUrl ? [memory.imageUrl] : [] };

  const reducer = (state: any, action: { type: any; payload: any; }) => {
    switch (action.type) {
      case 'setText':
        return { ...state, memory: action.payload };
      case 'setImage':
        return { ...state, imageUrl: [...state.imageUrl, action.payload] };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [uploading, setUploading] = useState(false);

  const addPhoto = () => {
    Alert.alert(
      "Add Photo",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: openCamera,
        },
        {
          text: "Gallery",
          onPress: selectImage,
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      handleImagePicked(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        handleImagePicked(result.assets[0].uri);
      }
    } else {
      alert('Camera permission denied');
    }
  };

  const handleImagePicked = async (uri: any) => {
    try {
      setUploading(true);

      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(snapshot.ref);
      dispatch({ type: 'setImage', payload: downloadURL });
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
      alert('Upload failed, sorry :(');
    }
  };

  const saveEdit = async () => {
    try {
      const memoryDocRef = doc(firestore, 'Memories', memory.id);
      await updateDoc(memoryDocRef, {
        memory: state.memory,
        imageUrl: state.imageUrl[0], // assuming single image
      });
      alert('Memory updated successfully!');
      navigation.navigate('Memory', { memory: { ...memory, memory: state.memory, imageUrl: state.imageUrl[0] } });
    } catch (error) {
      console.error('Error updating memory: ', error);
      alert('Failed to update memory');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <TouchableOpacity onPress={() => navigation.navigate('Memory', {memory})}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.location}>{memory.location.city}</Text>
        <Text style={styles.date}>{new Date(memory.timestamp.seconds * 1000).toLocaleDateString()}</Text>
        <View style={styles.add}>
          <Text style={styles.text}>Fotoğraflar</Text>
          <TouchableOpacity onPress={addPhoto}>
            <Entypo name="plus" size={24} color="black" style={styles.add1} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container1}>
        <Image source={{ uri: memory.imageUrl }} style={styles.image} />
      </View>
      <View style={styles.container2}>
        <Text style={styles.text}>Anılar</Text>
        <TextInput
          style={styles.memory}
          value={state.memory}
          onChangeText={(memory) => dispatch({ type: 'setText', payload: memory })}
        />
        <TouchableOpacity style={styles.button} onPress={saveEdit}>
          <Text style={styles.buttonText}>{uploading ? 'Kaydediliyor...' : 'Kaydet'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#DCE9F2",
      justifyContent: 'flex-start',
    },
    header: {
      alignSelf: 'center',
      flex: 2.5,
      width: '90%',
      justifyContent: 'space-evenly',
    },
    container1: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 3.5,
    },
    container2: {
      flex: 3,
      width: '90%',
      alignSelf: 'center',
    },
    icon: {
      left: 10,
      marginTop: 30,
    },
    add: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    add1: {
      marginTop: 20,
    },
    image: {
      flex: 1,
      width: 250,
      borderRadius: 10,
    },
    horizontalList: {
      paddingHorizontal: 10,
    },
    location: {
      fontSize: 28,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    date: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 10,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 24,
      marginTop: 15,
      marginBottom: 5,
      marginHorizontal: 10,
    },
    memory: {
      fontSize: 14,
      fontWeight: '400',
      marginHorizontal: 10,
    },
    button: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: '#B1C9DA',
        bottom: 10,
        width: '40%',
        height: 30,
        borderRadius: 15,
        borderWidth: 0.5,
    },
    buttonText: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 18,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
      },
  });