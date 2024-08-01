import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useReducer } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from '../model/firebase'
import { useUser } from '../context/UserContext';
import { setDoc, doc } from 'firebase/firestore';

export default function SignUpScreen({navigation} : {navigation: any}) {

    const initialState = {name: '', surname: '', email: '', password: ''}

    const reducer = (state: any, action: {type: any, payload: any}) => {
        switch(action.type){
            case 'setName':
                return {...state, name: action.payload};
            case 'setSurname':
                return {...state, surname: action.payload};    
            case 'setEmail':
                return {...state, email: action.payload};
            case 'setPassword':
                return {...state, password: action.payload};
            default: 
                return state;     
        }
    }

    const [state, dispatchLocal] = useReducer(reducer, initialState);
    const { dispatch } = useUser();


    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, state.email, state.password)
        .then(async (userCredential) => {
            console.log("User registered: ", userCredential.user);

            await setDoc(doc(firestore, 'Users', userCredential.user.uid), {
                name: state.name,
                surname: state.surname,
                email: state.email,
                password: state.password,
            })

            dispatch({type: 'SET_USER', payload: state})
            alert("Kayıt İşlemi Başarılı");
            navigation.navigate('Login')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Error code:', errorCode);
            console.log('Error message:', errorMessage);
            switch (errorCode) {
                case 'auth/invalid-email':
                    alert("Girilen e-posta adresi geçersiz. Lütfen geçerli bir e-posta adresi girin.");
                    break;
                    case 'auth/network-request-failed':
                        alert("Ağ hatası oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.");
                        break;
                    case 'auth/email-already-in-use':
                        alert("Bu e-posta adresi zaten kullanımda. Başka bir e-posta adresi deneyin veya giriş yapın.");
                        break;
                    case 'auth/weak-password':
                        alert("Girilen şifre çok zayıf. Lütfen daha güçlü bir şifre girin.");
                        break;
                    default:
                        alert(`Bir hata oluştu: ${errorMessage}`);
            }
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
                value={state.name}
                onChangeText={(text) => dispatchLocal({type: 'setName', payload: text})}
            />
            <Text style={styles.text2}>Soyad</Text>
            <TextInput 
                style={styles.input}
                value={state.surname}
                onChangeText={(text) => dispatchLocal({type: 'setSurname', payload: text})}
            />
            <Text style={styles.text2}>Email</Text>
            <TextInput 
                style={styles.input} 
                value={state.email}
                onChangeText={(text) => dispatchLocal({type: 'setEmail', payload: text})}
                keyboardType='email-address'
            />
            <Text style={styles.text2}>Şifre</Text>
            <TextInput 
                style={styles.input} 
                value={state.password}
                onChangeText={(text) => dispatchLocal({type: 'setPassword', payload: text})}
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