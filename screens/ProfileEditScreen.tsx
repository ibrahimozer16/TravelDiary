import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { auth, firestore, storage } from '../model/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useTranslation } from 'react-i18next';


export default function ProfileEditScreen({navigation} : {navigation: any}) {
    const {t} = useTranslation();
    const { state, dispatch } = useUser();
    const { user } = state;
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [surname, setSurname] = useState(user?.surname || '');
    const [oldPassword, setOldPassword] = useState(user?.password || '');
    const [newPassword, setNewPassword] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
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
                        }
                    })
                    setName(userData.name || '');
                    setSurname(userData.surname || '');
                    setOldPassword(userData.oldPassword || '');
                    setProfileImage(userData.imageProfile || null);
                }
            }
        }
        fetchUserData();
    }, [])

    const handleSave = async () => {
        try {
            if(currentUser && oldPassword && newPassword){
                const credential = EmailAuthProvider.credential(currentUser.email ?? '', oldPassword);
                await reauthenticateWithCredential(currentUser, credential);
                await updatePassword(currentUser, newPassword);
            }
            if(currentUser){
                await updateDoc(doc(firestore, 'Users', currentUser.uid), {
                    name,
                    surname,
                    email: user?.email ?? '',
                    password: newPassword ? newPassword : oldPassword,
                    profileImage: profileImage ?? user?.profileImage,
                })
                dispatch({
                    type: 'SET_USER',
                    payload: {
                        name,
                        surname,
                        email: user?.email ?? '',
                        password: newPassword ? newPassword : oldPassword,
                        profileImage: profileImage! ?? user?.profileImage,
                    }
                })
                alert('Profil güncellendi!');
                navigation.navigate('Profile');
            }
        } catch (error) {
            console.error('Error updating profile: ', error);
            alert('Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
    const addPhoto = () => {
        Alert.alert(
            t('addPhoto'),
            t('chooseAnOption'),
            [
              {
                text: t('camera'),
                onPress: openCamera,
              },
              {
                text: t('gallery'),
                onPress: selectImage,
              },
              {
                text: t('cancel'),
                style: "cancel"
              }
            ],
            { cancelable: true }
          );
    }

    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleImagePicked(result.assets[0].uri);
          }
    }
    
    const openCamera = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
  
        if (!result.canceled) {
          handleImagePicked(result.assets[0].uri);
        }
      } else {
        alert('Camera permission denied');
      }
    };

    const handleImagePicked = async (uri: string) => {
        try {
          if (currentUser) {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            setProfileImage(downloadURL);
          }
        } catch (error) {
          console.error('Error uploading image: ', error);
          alert('Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      };

    return (
    <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Profile')}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.text1}>{t('profile')}</Text>
            <TouchableOpacity onPress={addPhoto}>
                <Image style={styles.image} source={profileImage ? { uri: profileImage } : require('../assets/avatar.png')}/>
            </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.inputContainer}>
            <Text style={styles.text2}>{t('name')}</Text>
            <TextInput 
                style={styles.input}
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.text2}>{t('surname')}</Text>
            <TextInput 
                style={styles.input}
                value={surname}
                onChangeText={setSurname}
            />
            <Text style={styles.text2}>{t('email')}</Text>
            <TextInput 
                style={styles.input} 
                value={user?.email ?? ''}
                editable= {false}
                keyboardType='email-address'
            />
            <Text style={styles.text2}>{t('oldPassword')}</Text>
            <TextInput
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showPassword}
            />
            <Text style={styles.text2}>{t('newPassword')}</Text>
            <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text>{showPassword ? t('hidePassword') : t('showPassword')}</Text>
            </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.container1}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>{t('save')}</Text>
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
        top: 40,
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

function handleImagePicked(uri: any) {
    throw new Error('Function not implemented.');
}
