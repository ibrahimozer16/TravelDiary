import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import React, { useReducer, useState } from 'react';
import { firestore } from '../model/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function EditScreen({ route, navigation }: { route: any, navigation: any }) {
  const { t } = useTranslation();
  const { memory } = route.params || {};
  const initialState = { 
    title: memory.title || '',
    content: memory.content || '',
    score: memory.score || '',
    imageUrl: memory.imageUrl ? [memory.imageUrl] : []
  };

  const reducer = (state: any, action: { type: any; payload: any; }) => {
    switch (action.type) {
      case 'setTitle':
        return { ...state, title: action.payload };
      case 'setContent':
        return { ...state, content: action.payload }; 
      case 'setScore':
        return { ...state, score: action.payload };   
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [uploading, setUploading] = useState(false);

  const saveEdit = async () => {
    try {
      const memoryDocRef = doc(firestore, 'Memories', memory.id);
      await updateDoc(memoryDocRef, {
        title: state.title,
        content: state.content,
        score: state.score,
      });
      alert(t('memoryUpdatedSuccessfully'));
      navigation.navigate('Memory', { 
        memory: { 
          ...memory, 
          title: state.title, 
          content: state.content,
          score: state.score, 
        } 
      });
    } catch (error) {
      console.error('Error updating memory: ', error);
      alert(t('failedToUpdateMemory'));
    }
  };

  const handleEditScore = (newScore:string) => {
    const numericValue = parseFloat(newScore);
    if(!isNaN(numericValue) && numericValue >= 0 && numericValue <= 5){
      dispatch({ type: 'setScore', payload: newScore })
    }else{
      alert('Lütfen 0 ile 5 arası bir değer giriniz!');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <TouchableOpacity onPress={() => navigation.navigate('Memory', {memory})}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.score}>
          <Text style={styles.location}>{memory.title}, {memory.location.city}</Text>
          <View style={styles.text2}>
            <AntDesign name="star" size={22} color="black" style={styles.icon1} />
            <TextInput
              style={styles.score1}
              value={String(state.score)}
              onChangeText={handleEditScore}
              keyboardType='decimal-pad'
            />
          </View>
        </View>
        <Text style={styles.date}>{new Date(memory.timestamp.seconds * 1000).toLocaleDateString()}</Text>
        <View style={styles.add}>
          <Text style={styles.text}>{t('photos')}</Text>
        </View>
      </View>
      <View style={styles.container1}>
        <Image source={{ uri: memory.imageUrl }} style={styles.image} />
      </View>
      <View style={styles.container2}>
        <Text style={styles.text}>{t('memories')}</Text>
        <Text style={styles.text1}>{t('title')}</Text>
        <TextInput
          style={styles.memory}
          value={state.title}
          onChangeText={(title) => dispatch({ type: 'setTitle', payload: title })}
        />
        <Text style={styles.text1}>{t('content')}</Text>
        <TextInput
          style={styles.memory}
          value={state.content}
          onChangeText={(content) => dispatch({ type: 'setContent', payload: content })}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={saveEdit}>
          <Text style={styles.buttonText}>{uploading ? t('saving') : t('save')}</Text>
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
      flex: 2.5,
      width: '90%',
      alignSelf: 'center',
    },
    icon: {
      left: 10,
      marginTop: 30,
    },
    icon1: {
      marginTop: 10,
    },
    add: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    imageContainer: {
      position: 'relative',
      marginRight: 10,
    },
    image: {
      flex: 1,
      width: 250,
      borderRadius: 10,
      marginHorizontal: 5,
    },
    location: {
      fontSize: 28,
      fontWeight: 'bold',
      marginLeft: 10,
      marginTop: 10,
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
    text1: {
      fontWeight: '500',
      fontSize: 18,
      marginHorizontal: 10,
    },
    text2: {
      flexDirection: 'row',
      backgroundColor: 'yellow',
      width: '20%',
      marginTop: 5,
    },
    input: {
      fontSize: 16,
      padding: 8,
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
    score: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
    },
    score1: {
      fontSize: 24,
      fontWeight: '500',
    },
});
