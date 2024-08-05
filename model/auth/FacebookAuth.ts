import React, { useState, useEffect } from 'react';
import { FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import 'expo-dev-client';
import { auth } from '../firebase';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

export default function FacebookAuth() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user:any) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    if(initializing) return null;
}

export const signInWithFB = async (dispatch:any, navigation:any) => {
    try {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if(result.isCancelled){
            console.log('Facebook login cancelled');
            return;
        }

        const data = await AccessToken.getCurrentAccessToken();
        if(!data){
            throw new Error('Failed to get access token');
        }
        const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
        const user_sign_in = await signInWithCredential(auth, facebookCredential);
        console.log(user_sign_in);

        const {user} = user_sign_in;

        dispatch({ 
            type: 'SET_USER', 
            payload: {
                name: user.displayName || '',
                surname: user.displayName || '',
                email: user.email,
                password: '',
                profileImage: user.photoURL || '',
            }
        });

        // Navigate to the Home screen
        navigation.navigate('Home');

    } catch (error) {
        console.log(error);
    }
}
