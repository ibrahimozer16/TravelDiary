import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import React from 'react';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import { firestore, storage } from '../model/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useTranslation } from 'react-i18next';

export default function MemoryScreen({ route, navigation }: { route: any, navigation: any }) {
  const {t} = useTranslation();
  const { memory } = route.params;

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, 'Memories', memory.id));
      const imageRef = ref(storage, memory.imageUrl);
      await deleteObject(imageRef);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error deleting memory: ', error);
      Alert.alert('Error', 'Anıyı silerken bir hata oluştu.');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Anıyı Sil",
      "Bu anıyı silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Sil", onPress: handleDelete }
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
        <Text style={styles.location}>{memory.location.city}</Text>
        <Text style={styles.date}>{new Date(memory.timestamp.seconds * 1000).toLocaleDateString()}</Text>
        <Text style={styles.text}>{t('photos')}</Text>
      </View>
      <View style={styles.container1}>
        <Image source={{ uri: memory.imageUrl }} style={styles.image} />
      </View>
      <View style={styles.container2}>
        <Text style={styles.text}>{t('memories')}</Text>
        <Text style={styles.memory}>{memory.memory}</Text>
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
  horizontalList: {
    paddingHorizontal: 10,
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
    marginTop: 15,
    marginBottom: 5,
  },
  memory: {
    fontSize: 14,
    fontWeight: '400',
  },
});
