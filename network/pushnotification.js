import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';

export const initializeNotificationsForForegroundMode = () => {
    //not used
    try {
        const unsubscribe = messaging().onMessage(async notification => {
            console.log('Foreground mode!', notification)
        });
        return unsubscribe;
    } catch (error) {
        console.log(error)
    }
}

export const initializeNotifications = async () => {
    //not used
    const backgroundHandler = messaging().setBackgroundMessageHandler(async message => {
        console.log('Background mode:', message);
        return message;
    });

    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
        console.log('Kill state:', initialNotification);
        return initialNotification;
    }
    return backgroundHandler;
};

export const initializeOnNotificationOpenedApp = () => {
    //not used
    messaging().onNotificationOpenedApp(notification => {
        console.log('re direct sms', notification);
    });
}

export const requestNotificationPermission = async () => {
    // used in app
    try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        
        const authStatus = await messaging().requestPermission();
        console.log(authStatus)
        return (
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const getDeviceFCMToken = async () => {
    // used in app
    try {
        await messaging().getToken();
        const token = await messaging().getToken();
        return token;
    } catch (error) {
        throw error;
    }
};