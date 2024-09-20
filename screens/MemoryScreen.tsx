import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, ScrollView } from 'react-native';
import React, { cloneElement } from 'react';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import { firestore, storage } from '../model/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
import * as Sharing from 'expo-sharing';
import Share from 'react-native-share';

export default function MemoryScreen({ route, navigation }: { route: any, navigation: any }) {
  const {t} = useTranslation();
  const { memory } = route.params;

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, 'Memories', memory.id));
      const imageRef = ref(storage, memory.imageUrl);
      await deleteObject(imageRef);
      navigation.navigate(t('Home'));
    } catch (error) {
      console.error(t('errorDeletingMemory'), error); 
      Alert.alert(t('error'), t('errorDeletingMemory'));
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      t('deleteMemory'),
      t('confirmDeleteMemory'),
      [
        { text: t('cancel'), style: "cancel" },
        { text: t('delete'), onPress: handleDelete }
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    navigation.navigate('Edit', { memory });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.actionIcons}>
            <TouchableOpacity onPress={handleEdit}>
              <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDelete}>
              <Feather name="trash-2" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.score}>
          <Text style={styles.location}>{memory.title}, {memory.location.city}</Text>
          <Text style={styles.text}>{<AntDesign name="star" size={22} color="black" />}{memory.score}</Text>
        </View>
        <Text style={styles.date}>{new Date(memory.timestamp.seconds * 1000).toLocaleDateString()}</Text>
        <Text style={styles.text}>{t('photos')}</Text>
      </View>
      <View style={styles.container1}>
        <Image source={{ uri: memory.imageUrl }} style={styles.image} />
      </View>
      <View style={styles.container2}>
        <Text style={styles.text}>{t('memories')}</Text>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.memory}>{memory.content}</Text>
        </ScrollView>
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
    marginLeft: 40,
  },
  container1: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 4.5,
  },
  container2: {
    flex: 2.5,
    width: '90%',
    alignSelf: 'center',
    marginLeft: 40,
  },
  icon: {
    alignSelf: 'stretch',
    marginRight: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  image: {
    flex: 1,
    width: 250,
    borderRadius: 10,
  },
  location: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 7,
  },
  text1: {
    fontWeight: '500',
    fontSize: 18,
    marginTop: 3,
    marginBottom: 3,
  },
  scrollView: {
    width: '90%',
    maxHeight: 140, 
    borderWidth: 0.1,
  },
  memory: {
    fontSize: 14,
    fontWeight: '500',
    paddingRight: 3,
  },
  score: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
});
