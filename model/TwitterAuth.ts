import { getAuth, signInWithCredential, OAuthProvider } from "firebase/auth";
import { auth } from './firebase';
import * as AuthSession from 'expo-auth-session';
import * as Random from 'expo-random';

//twitter_client_id='N2t2SjBvbXB6NzB0dV9yRVgwRzA6MTpjaQ'
//twitter_client_secret='E6OdjpWFMN4CmNRNq2RWOe-1zxRGjOhPPYFncE97Eek4hSum5R'

const TWITTER_API_KEY = "6xEoZ83pqPVtNth1dbZUPScKc";
const TWITTER_API_SECRET_KEY = "EQICUMH839tdcUvxyRAa1uzqEs1GqpTt0NpoXDCktcKRhgnVyu";
const REDIRECT_URI = AuthSession.makeRedirectUri({
    scheme: 'TravelDiary',
});

export const handleTwitterLogin = async () => {
    try {
        const nonce = String.fromCharCode(...await Random.getRandomBytesAsync(32));
        const requestTokenUrl = `https://api.twitter.com/oauth/request_token?oauth_callback=${encodeURIComponent(REDIRECT_URI)}`;

        const requestTokenResponse = await fetch(requestTokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': `OAuth oauth_consumer_key="${TWITTER_API_KEY}", oauth_nonce="${nonce}", oauth_signature="${TWITTER_API_SECRET_KEY}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${Math.floor(Date.now() / 1000)}", oauth_version="1.0"`
            }
        });

        const requestTokenData = await requestTokenResponse.text();
        const requestTokenParams = new URLSearchParams(requestTokenData);
        const oauthToken = requestTokenParams.get('oauth_token');
        
        const authUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;
        const result = await AuthSession.startAsync({ authUrl });

        if (result.type !== 'success') {
            return;
        }

        const { oauth_token, oauth_verifier } = result.params;

        const accessTokenUrl = `https://api.twitter.com/oauth/access_token?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`;
        const accessTokenResponse = await fetch(accessTokenUrl, {
            method: 'POST',
        });

        const accessTokenData = await accessTokenResponse.text();
        const accessTokenParams = new URLSearchParams(accessTokenData);
        const oauthTokenFinal = accessTokenParams.get('oauth_token');
        const oauthTokenSecret = accessTokenParams.get('oauth_token_secret');

        const provider = new OAuthProvider('twitter.com');
        const credential = provider.credential(oauthTokenFinal, oauthTokenSecret);

        await signInWithCredential(auth, credential);
        console.log('Twitter sign-in successful');
    } catch (error) {
        console.error('Twitter sign-in error:', error);
    }
};