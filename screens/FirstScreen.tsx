import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';

export default function FirstScreen({navigation} : {navigation: any}) {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.text2}>Hoşgeldiniz</Text>
            <Image style={styles.image} source={require('../assets/dunya.png')}/>
            <Text style={styles.text}>Gezi Günlüğü</Text>
        </View>
        <View style={styles.inputContainer}>
            <Image style={styles.image1} source={require('../assets/camera.png')}/>
            <Image style={styles.image1} source={require('../assets/airbus.png')}/>
            <Image style={styles.image1} source={require('../assets/diary.png')}/>
        </View>
        <View style={styles.container1}>
            <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DCE9F2",
        justifyContent: 'flex-start',
    },
    container1: {
        top: 50,
        flex: 3,
    },
    header: {
        alignItems: 'center',
        flex: 5,
        marginTop: 40,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    image: {
        width: 220,
        height: 140,
        margin: 50,
    },
    image1: {
        width: 70,
        height: 70,
        borderRadius: 20,
    },
    text: {
        fontSize: 35,
        fontWeight: 'bold',
        width: '60%',
    },
    text1: {
        fontSize: 35,
        fontWeight: 'bold',
        margin: 20,
    },
    text2: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 2,
    },
    button: {
        alignSelf: 'center',
        backgroundColor: '#94ACBD',
        marginTop: 20,
        width: '60%',
        height: 30,
        borderRadius: 15,
        borderWidth: 0.5,
    },
    button1: {
        alignSelf: 'center',
        backgroundColor: '#B1C9DA',
        marginTop: 20,
        width: '60%',
        height: 30,
        borderRadius: 15,
        borderWidth: 0.5,
    },
    buttonText: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 18,
    },
})