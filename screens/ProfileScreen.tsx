import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { auth, firestore } from '../model/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProfileScreen({navigation} : {navigation: any}) {
    const {t} = useTranslation();
    const { state, dispatch } = useUser();
    const { user } = state;
    const [showPassword, setShowPassword] = useState(false);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if(currentUser){
                const userDoc = await getDoc(doc(firestore, 'Users', currentUser.uid));
                if(userDoc.exists()){
                    const userData = userDoc.data();
                    dispatch({ 
                        type: 'SET_USER', 
                        payload: {
                            name: userData.name || '',
                            surname: userData.surname || '',
                            email: userData.email || '',
                            password: userData.password || '',
                            profileImage: userData.profileImage || null,
                    } });
                }
            }
        }
        fetchUserData();
    }, [dispatch])

    const handleSignOut = async () => {
        try {
            const isSignedInWithGoogle = currentUser?.providerData.some(
                (provider) => provider.providerId === 'google.com'
            )

            const isSignedInWithFacebook = currentUser?.providerData.some(
                (provider) => provider.providerId === 'facebook.com'
            );

            await auth.signOut();
        
            if(isSignedInWithGoogle) {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }

            if (isSignedInWithFacebook) {
                await LoginManager.logOut();
            }

            await AsyncStorage.removeItem('userToken');

            dispatch({type: 'CLEAR_USER'});
            navigation.navigate('Login');

        } catch (error) {
            console.error('Error signing out: ', error);
        }
    }

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
            <Text style={styles.text1}>{t('profile')}</Text>
            <Image style={styles.image} source={user?.profileImage ? { uri: user.profileImage } : require('../assets/avatar.png')}/>
        </View>
        <View style={styles.inputContainer}>
            {user ? (
                <>
                    <Text style={styles.text2}>{t('name')}</Text>
                    <Text style={styles.input}>{user.name}</Text>
                    <Text style={styles.text2}>{t('surname')}</Text>
                    <Text style={styles.input}>{user.surname}</Text>
                    <Text style={styles.text2}>{t('email')}</Text>
                    <Text style={styles.input}>{user.email}</Text>
                    <Text style={styles.text2}>{t('password')}</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            value={user.password}
                            secureTextEntry={!showPassword}
                            editable={false}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Entypo name={showPassword ? 'eye-with-line' : 'eye'} size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </>
            ):(
                <Text style={styles.errorText}>{t('noUser')}</Text>
            )}
        </View>
        <View style={styles.container1}>
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleSignOut}>
                <Text style={styles.buttonText}>{t('logout')}</Text>
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
        top: 40,
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
        width: 180,
        height: 180,
        borderRadius: 90,
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
        textAlignVertical: 'center',
        paddingLeft: 10,
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
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#99B6B6',
        height: 30,
      },
    passwordInput: {
        fontSize: 16,
        flex: 1,
        paddingLeft: 10,
    },
})