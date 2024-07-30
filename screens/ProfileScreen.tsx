import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { AntDesign, MaterialIcons } from '@expo/vector-icons';


export default function ProfileScreen({navigation} : {navigation: any}) {
  return (
    <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
        <View style={styles.header}>
            <View style={styles.icon}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')}>
                    <MaterialIcons name="edit" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.text1}>Profil</Text>
            <Image style={styles.image} source={require('../assets/avatar.png')}/>
        </View>
        <SafeAreaView style={styles.inputContainer}>
            <Text style={styles.text2}>Ad</Text>
            <TextInput style={styles.input}></TextInput>
            <Text style={styles.text2}>Soyad</Text>
            <TextInput style={styles.input}></TextInput>
            <Text style={styles.text2}>Email</Text>
            <TextInput style={styles.input} keyboardType='email-address'></TextInput>
            <Text style={styles.text2}>Şifre</Text>
            <TextInput style={styles.input} secureTextEntry></TextInput>
        </SafeAreaView>
        <View style={styles.container1}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Çıkış Yap</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DCE9F2",
        justifyContent: 'flex-start',
    },
    container1: {
        flex: 1.5,
    },
    header: {
        top: 50,
        alignItems: 'center',
        flex: 3,
    },
    inputContainer: {
        width: '60%',
        alignSelf: 'center',
        top: 30,
        flex: 3,
    },
    icon: {
        alignSelf: 'stretch',
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        width: 170,
        height: 170,
    },
    text: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    text1: {
        fontSize: 35,
        fontWeight: 'bold',
        margin: 20,
    },
    text2: {
        marginTop: 10,
        marginBottom: 2,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#99B6B6',
        height: 30,
    },
    button: {
        alignSelf: 'center',
        backgroundColor: '#0081DE',
        marginTop: 20,
        width: '40%',
        height: 30,
        borderRadius: 15,
        borderWidth: 0.5,
    },
    button1: {
        alignItems: 'center',
        margin: 10,
    },
    buttonText: {
        color: 'white',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 18,
    },
})