import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import appleAuth from '@invertase/react-native-apple-authentication';
import { DeviceEventEmitter } from "react-native";
import { Logout } from "../../network/models/auth";

function configureGoogle() {
    GoogleSignin.configure({ webClientId: '994786232063-k45lv2f4kn1eeo845be69v63ih6eh51g.apps.googleusercontent.com' });
}

async function processGoogleOAuth() {
    try {
        await GoogleSignin.signOut();

        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();

        return userInfo;
    }
    catch (error) {
        throw error;
    }
}

// TODO: call this function when the user clicks on the "Sign Out" button in the profile page, if the user is authenticated with Google
async function processGoogleSignOut() {
    try {
        await GoogleSignin.signOut();

        await Logout();
        DeviceEventEmitter.emit('logout');
    }
    catch (error) {
        throw error;
    }
}

async function revokeGoogleAccess() {
    try {
        // TODO: treat revoke access as account deletion request
        console.warn('GOOGLE_ACCESS_REVOKED: Consider treating this as an account deletion request from the user and clear the data relevant to them.');
        
        await GoogleSignin.revokeAccess();
        await Logout();
        DeviceEventEmitter.emit('logout');
    }
    catch (error) {
        throw error;
    }
}

async function processAppleOAuth() {
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
        if (credentialState !== appleAuth.State.AUTHORIZED) throw new Error('Apple login failed');

        return appleAuthRequestResponse;
    }
    catch (error) {
        throw error;
    }
}

// TODO: the caller of this function resides in the App component's useEffect hook, where AlertBoxContext is not available. 
// Find a way to call this function from where it can access the AlertBoxContext, and the catch can be handled.
async function appleAccessRevoked() {
    try {
        // TODO: treat revoke access as account deletion request
        console.warn('APPLE_ACCESS_REVOKED: Consider treating this as an account deletion request from the user and clear the data relevant to them.');

        await Logout();
        DeviceEventEmitter.emit('logout');
    }
    catch (error) {
        DeviceEventEmitter.emit('alert', { message: error.message })
    }
}

function handleAppleLoginErrors(error) {
    if (error.code === appleAuth.Error.CANCELED) return;

    if (error.code === appleAuth.Error.FAILED) throw new Error('Login failed. Please try again.');
    if (error.code === appleAuth.Error.INVALID_RESPONSE) throw new Error('Received an invalid response from the server. Please try again.');
    if (error.code === appleAuth.Error.NOT_HANDLED) throw new Error('Request was not handled. Please try again.');
    if (error.code === appleAuth.Error.UNKNOWN) throw new Error('Received an unknown response. Please try again.');

    return error;
}

function handleGoogleLoginErrors(error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) return;

    if (error.code === statusCodes.IN_PROGRESS) throw new Error('Google sign in is in progress. Please try again.');
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) throw new Error('Google Play services are not available. Please try again.');
    if (error.code === statusCodes.SIGN_IN_REQUIRED) throw new Error('Google sign in is required. Please try again.');
    if (error.code === statusCodes.NETWORK_ERROR) throw new Error('Network error. Please try again.');
    if (error.code === statusCodes.DEVELOPER_ERROR) throw new Error('Developer error. Please try again.');
    if (error.code === statusCodes.ERROR) throw new Error('Error. Please try again.');

    return error;
}

export { configureGoogle, processGoogleOAuth, processGoogleSignOut, revokeGoogleAccess, processAppleOAuth, appleAccessRevoked, handleGoogleLoginErrors, handleAppleLoginErrors }