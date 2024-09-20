import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../model/firebase';
import { onAuthStateChanged } from 'firebase/auth';


export default function FirstScreen({navigation} : {navigation: any}) {
  
    const {t, i18n} = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    const languageTr = () => {
        i18n.changeLanguage('tr');
    }

    const languageEn = () => {
        i18n.changeLanguage('en');
    }

    const languageDe = () => {
        i18n.changeLanguage('de');
    }

    const languageSp = () => {
        i18n.changeLanguage('sp');
    }

    useEffect(() => {
        const checkUserSession = async () => {
            const userToken = await AsyncStorage.getItem('userToken');

            if(userToken){
                onAuthStateChanged(auth, (user) => {
                    if(user){
                        navigation.navigate('Home');
                    }else{
                        setIsLoading(false);
                    } 
                }
            )
            }else{
                setIsLoading(false);
            }
        }
        checkUserSession();
    }, []);

    if (isLoading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
 
    return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.text2}>{t('welcome')}</Text>
            <Image style={styles.image} source={require('../assets/dunya.png')}/>
            <Text style={styles.text}>{t('travelDiary')}</Text>
        </View>
        <View style={styles.inputContainer}>
            <Image style={styles.image1} source={require('../assets/camera.png')}/>
            <Image style={styles.image1} source={require('../assets/airbus.png')}/>
            <Image style={styles.image1} source={require('../assets/diary.png')}/>
        </View>
        <View style={styles.container1}>
            <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>{t('login')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.buttonText}>{t('signup')}</Text>
            </TouchableOpacity>
            <View style={styles.lng}>
                <TouchableOpacity style={styles.buttons} onPress={languageTr}>
                    <Text>TR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons} onPress={languageEn}>
                    <Text>EN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons} onPress={languageDe}>
                    <Text>DE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons} onPress={languageSp}>
                    <Text>SP</Text>
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
        width: '70%',
        textAlign: 'center',
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
    buttons: {
        borderWidth: 1,
        borderRadius: 10,
        width: '20%',
        alignItems: 'center'
    },
    lng: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        margin: 20,
        width: '60%',
    }
})