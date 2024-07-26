import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { MaterialCommunityIcons, Feather  } from '@expo/vector-icons';

export default function HomeScreen({navigation} : {navigation: any}) {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.keyContainer}>
        <Text style={styles.text}>Merhaba İbrahim    <MaterialCommunityIcons name="hand-wave" size={24} color="black" /></Text>
        <TextInput style={styles.input} placeholder='    Anı Ara'/>
        <Text style={styles.text}>Anılar</Text>
        <View style={styles.buttonView}>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Tarihe Göre</Text>
            </TouchableOpacity>
            <Text>    </Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Puana Göre</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.container1}>
    <Text>fotoğraflar</Text>
      </View>
      <View style={styles.container2}>
        <View style={styles.tabbar}>
            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
                <Feather name="map" size={32} color="black"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
                <Feather name="camera" size={32} color="black"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Feather name="user" size={32} color="black"/>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DCE9F2",
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyContainer: {
        width: '85%',
        flex: 3,
        backgroundColor: 'red',
        justifyContent: 'center'
    },
    container1: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '85%',
        flex: 4,
        backgroundColor: 'green'
    },
    container2: {
        width: '100%',
        flex: 0.5,
        backgroundColor: '#B1C9DA',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
        marginVertical: 20,
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#99B6B6',
        fontSize: 16,
        borderRadius: 15,
        height: 50,
    },
    button: {
        backgroundColor: '#99B6B6',
        width: '40%',
        height: 35,
        borderRadius: 15,
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 16,
    },
    tabbar: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
})