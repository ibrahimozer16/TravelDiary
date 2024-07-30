import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { auth, GoogleAuthProvider, signInWithCredential } from '../model/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
// import { makeRedirectUri } from 'expo-auth-session';

// WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({navigation} : {navigation: any}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    //     clientId: '77926693785-go66jcgosmo5i40vtksc4umr8phim536.apps.googleusercontent.com',
    //     redirectUri: makeRedirectUri({
    //         scheme: 'TravelDiary',
    //     }),
    // });

    // useEffect(() => {
    //     if(response?.type === 'success'){
    //         const { id_token } = response.params;
    //         const credential = GoogleAuthProvider.credential(id_token);
    //         signInWithCredential(auth, credential)
    //         .then((result) => {
    //             const user = result.user;
    //             console.log('User signed in: ', user);
    //             navigation.navigate('Home');
    //         }).catch((error) => {
    //             console.error('Error signing in: ', error);
    //         })
    //     }
    // }, [response])

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

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials: { user: any }) => {
            const user = userCredentials.user;
            console.log('Kullanıcı Giriş Yaptı ', user.email);
            navigation.navigate('Home');
        }).catch((error: { code: any, message: any }) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            switch (errorCode) {
                case 'auth/invalid-email':
                    alert("Girilen e-posta adresi geçersiz. Lütfen geçerli bir e-posta adresi girin.");
                    break;
                case 'auth/user-not-found':
                    alert("Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı. Lütfen kayıt olun.");
                    break;
                case 'auth/wrong-password':
                    alert("Yanlış şifre girildi. Lütfen şifrenizi kontrol edin.");
                    break;
                case 'auth/network-request-failed':
                    alert("Ağ hatası oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.");
                    break;
                default:
                    alert(`Giriş yapılırken bir hata oluştu: ${errorMessage}`);
            }
        });
    }

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    }

    const forgetPassword = () => {
        navigation.navigate('ForgetPassword')
    }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('First')}>
            <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Image style={styles.image} source={require('../assets/dunya.png')}/>
        <Text style={styles.text}>Gezi Günlüğü</Text>
        <Text style={styles.text1}>Giriş Yap</Text>
      </View>
      <SafeAreaView style={styles.inputContainer}>
        <Text style={styles.text2}>Email</Text>
        <TextInput 
            style={styles.input} 
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'/>
        <Text style={styles.text2}>Şifre</Text>
        <TextInput 
            style={styles.input} 
            value={password}
            onChangeText={setPassword}
            secureTextEntry/>
        <TouchableOpacity onPress={forgetPassword}>
            <Text style={styles.text3}>Şifremi Unuttum</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.container1}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={handleSignUp}>
            <Text>Bir Hesabım Yok</Text>
        </TouchableOpacity>
        <Text style={styles.text4}>------------------  ya da  ------------------</Text>
        <TouchableOpacity style={styles.button2} onPress={() => {}}>
            <Text style={styles.buttonText}>Google ile Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button3} onPress={() => {}}>
            <Text style={styles.buttonText}>Facebook ile Giriş Yap</Text>
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
        top: 30,
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
})