import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

export default function MemoryScreen({ route, navigation }: { route: any, navigation: any }) {
  const { memory } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Edit', { memory })}>
            <MaterialIcons name="edit" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.location}>{memory.location.city}</Text>
        <Text style={styles.date}>{new Date(memory.timestamp.seconds * 1000).toLocaleDateString()}</Text>
        <Text style={styles.text}>Fotoğraflar</Text>
      </View>
      <View style={styles.container1}>
        <Image source={{ uri: memory.imageUrl }} style={styles.image} />
      </View>
      <View style={styles.container2}>
        <Text style={styles.text}>Anılar</Text>
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
