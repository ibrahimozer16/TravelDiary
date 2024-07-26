import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../model/firebase';

export default function LoginControllerScreen({navigation} : {navigation:any}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setEmail('');
            setPassword('');
        })
        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if(user){
                navigation.navigate('Home');
            }
        })
    }, [])


}