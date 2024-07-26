import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';


export default function ProfileEditScreen({navigation} : {navigation: any}) {
  return (
    <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Profile')}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
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
            <Text style={styles.text2}>Eski Şifre</Text>
            <TextInput style={styles.input} secureTextEntry></TextInput>
            <Text style={styles.text2}>Yeni Şifre</Text>
            <TextInput style={styles.input} secureTextEntry></TextInput>
        </SafeAreaView>
        <View style={styles.container1}>
            <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>Kaydet</Text>
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
        flex: 2,
        justifyContent: 'center'
    },
    header: {
        top: 50,
        alignItems: 'center',
        flex: 4,
    },
    inputContainer: {
        width: '60%',
        alignSelf: 'center',
        marginTop: 20,
        flex: 3.5,
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
        backgroundColor: '#B1C9DA',
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
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 18,
    },
})