import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { auth } from '../model/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { onGoogleButtonPress } from '../model/auth/GoogleAuth';
import { signInWithFB } from '../model/auth/FacebookAuth';
import { useUser } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({navigation} : {navigation: any}) {
    const {t} = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { state, dispatch } = useUser();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setEmail('');
            setPassword('');
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if(user){
                navigation.navigate('Home');
            }
        })
    }, [])

    const handleLogin = async (email:string, password:string) => {
        try {
            // Firebase ile giriş yapma
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
        
            // Giriş yapıldıktan sonra AsyncStorage'a oturum bilgisini kaydet
            await AsyncStorage.setItem('userToken', user.uid);
        
            console.log('Kullanıcı Giriş Yaptı:', user.email);
        
            // Kullanıcıyı Home ekranına yönlendir
            navigation.navigate('Home');
          } catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
        
            // Hata durumlarını ele alma
            switch (errorCode) {
              case 'auth/invalid-email':
                alert(t('invalidEmail'));
                break;
              case 'auth/user-not-found':
                alert(t('userNotFound'));
                break;
              case 'auth/wrong-password':
                alert(t('wrongPassword'));
                break;
              case 'auth/network-request-failed':
                alert(t('networkError'));
                break;
              default:
                alert(`${t('errorOccurred')}: ${errorMessage}`);
            }
          }
    }

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    }

    const forgetPassword = () => {
        navigation.navigate('ForgetPassword')
    }

  return (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#DCE9F2" }}
        behavior={Platform.OS === 'ios' ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('First')}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.text}>{t('travelDiary')}</Text>
                    <Image style={styles.image} source={require('../assets/dunya.png')}/>
                    <Text style={styles.text1}>{t('login')}</Text>
                </View>
                <KeyboardAvoidingView style={styles.inputContainer}>
                    <Text style={styles.text2}>{t('email')}</Text>
                    <TextInput 
                        style={styles.input} 
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'/>
                    <Text style={styles.text2}>{t('password')}</Text>
                    <TextInput 
                        style={styles.input} 
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry/>
                    <TouchableOpacity onPress={forgetPassword}>
                        <Text style={styles.text3}>{t('forgotPassword')}</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
                <View style={styles.container1}>
                    <TouchableOpacity style={styles.button} onPress={() => handleLogin(email, password)}>
                        <Text style={styles.buttonText}>{t('login')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button1} onPress={handleSignUp}>
                        <Text style={styles.noAccount}>{t('noAccount')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.text4}>------------------  {t('or')}  ------------------</Text>
                    <TouchableOpacity style={styles.button2} onPress={() => onGoogleButtonPress(dispatch, navigation)}>
                        <Text style={styles.buttonText}>{t('signInWithGoogle')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button3} onPress={() => signInWithFB(dispatch, navigation)}>
                        <Text style={styles.buttonText}>{t('signInWithFacebook')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScrollView>
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
        marginTop: 20,
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
        fontSize: 30,
        fontWeight: 'bold',
    },
    text1: {
        fontSize: 35,
        fontWeight: 'bold',
        margin: 20,
        marginBottom: 50,
    },
    inputContainer: {
        top: 20,
        width: '60%',
        alignSelf: 'center',
    },
    text2: {
        marginTop: 10,
        marginBottom: 2,
    },
    text3: {
        alignSelf: 'flex-end',
        fontSize: 12,
    },
    text4: {
        alignSelf: 'center',
        margin: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#99B6B6',
        height: 30,
        paddingHorizontal: 10,
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
    button2: {
        alignSelf: 'center',
        margin: 10,
        backgroundColor: '#B1C6C6',
        width: '60%',
        borderRadius: 15,
        height: 30,
        borderWidth: 0.5,
    },
    button3: {
        alignSelf: 'center',
        margin: 10,
        backgroundColor: '#0081DE',
        width: '60%',
        borderRadius: 15,
        height: 30,
        borderWidth: 0.5,
    },
    buttonText: {
        color: 'white',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 18,
    },
    noAccount: {
        textDecorationLine: 'underline',
    }
})