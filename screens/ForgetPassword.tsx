import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { auth } from '../model/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';


export default function ForgetPassword({navigation} : {navigation: any}) {
    const [email, setEmail] = useState('');

    const handlePassword = async () => {
        await sendPasswordResetEmail(auth, email)
        .then(() => alert("Şifrenizi Email'inize Gönderilen Linkten Değiştirebilirsiniz"))
        .then(() => navigation.navigate('Login'))
        .catch((error: any) => console.log(error.message))
    }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('First')}>
            <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Image style={styles.image} source={require('../assets/dunya.png')}/>
        <Text style={styles.text}>Gezi Günlüğü</Text>
        <Text style={styles.text1}>Şifre Sıfırlama</Text>
      </View>
      <SafeAreaView style={styles.inputContainer}>
        <Text style={styles.text2}>Email</Text>
        <TextInput 
            style={styles.input} 
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'/>
      </SafeAreaView>
      <View style={styles.container1}>
        <TouchableOpacity style={styles.button} onPress={handlePassword}>
            <Text style={styles.buttonText}>Şifreyi Sıfırla</Text>
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
        marginTop: 70,
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
        margin: 40,
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
    input: {
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#99B6B6',
        height: 30,
    },
    button: {
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