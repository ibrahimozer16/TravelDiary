import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { useEffect } from 'react';
import { auth } from '../model/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export function useGoogleAuth() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '77926693785-go66jcgosmo5i40vtksc4umr8phim536.apps.googleusercontent.com',
        androidClientId: '77926693785-vfn6gq1dddsav5e1aiokldp0iuf62s4l.apps.googleusercontent.com',
        redirectUri: makeRedirectUri({
            scheme: 'TravelDiary'
        })
    });

    useEffect(() => {
        if(response?.type === 'success'){
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).catch(error => {
                console.error('Error signing in with Google', error);
            })
        }
    }, [response])
    return { promptAsync };
}