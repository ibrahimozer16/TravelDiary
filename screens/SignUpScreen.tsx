import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../model/firebase'

export default function SignUpScreen({navigation} : {navigation: any}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');


    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User registered: ", userCredential.user);
            alert("Kayıt İşlemi Başarılı");
            navigation.navigate('Login')
        })
        .catch((error) => {
            // Hata durumunda
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Error code:', errorCode);
            console.log('Error message:', errorMessage);
            alert("Kayıt işlemi sırasında bir hata oluştu!");
        });
    }

    const returnLogin = () => {
        navigation.navigate('Login');
    }

  return (
    <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('First')}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Image style={styles.image} source={require('../assets/dunya.png')}/>
            <Text style={styles.text}>Gezi Günlüğü</Text>
            <Text style={styles.text1}>Giriş Yap</Text>
        </View>
        <SafeAreaView style={styles.inputContainer}>
            <Text style={styles.text2}>Ad</Text>
            <TextInput 
                style={styles.input}
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.text2}>Soyad</Text>
            <TextInput 
                style={styles.input}
                value={surname}
                onChangeText={setSurname}
            />
            <Text style={styles.text2}>Email</Text>
            <TextInput 
                style={styles.input} 
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
            />
            <Text style={styles.text2}>Şifre</Text>
            <TextInput 
                style={styles.input} 
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
        </SafeAreaView>
        <View style={styles.container1}>
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button1} onPress={returnLogin}>
                <Text>Zaten Bir Hesabım Var</Text>
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
        top: 40,
    },
    header: {
        top: 50,
        alignItems: 'center',
    },
    icon: {
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    image: {
        width: 200,
        height: 130,
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
    inputContainer: {
        width: '60%',
        alignSelf: 'center',
        top: 30,
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
        color: 'white',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 18,
    },
})