import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'; 
import 'expo-dev-client';
import React, { useEffect, useState } from 'react';

GoogleSignin.configure({
    webClientId: '77926693785-go66jcgosmo5i40vtksc4umr8phim536.apps.googleusercontent.com',
    offlineAccess: true,
});

export default function GoogleAuth() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    function onAuthStateChanged(user:any) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    return null; // You can return any UI component here if needed
}

export const onGoogleButtonPress = async (dispatch:any, navigation:any) => {
    try {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token and user info
        const { idToken, user } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        const user_sign_in = await signInWithCredential(auth, googleCredential);
        console.log(user_sign_in);

        // Dispatch user info to UserContext
        dispatch({ 
            type: 'SET_USER', 
            payload: {
                name: user.givenName || '',
                surname: user.familyName || '',
                email: user.email,
                password: '',
                profileImage: user.photo || '',
            }
        });

        // Navigate to the Home screen
        navigation.navigate('Home');
    } catch (error) {
        console.log('Error signing in with Google:', error);
    }
};
