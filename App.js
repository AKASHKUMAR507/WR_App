import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, UIManager, Platform, DeviceEventEmitter, useColorScheme, StatusBar, PermissionsAndroid, } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from './styles/colors';
import * as Keychain from 'react-native-keychain';
import fontSizes from './styles/fonts';
import { RemoveHeader, SetHeader } from './network/network';
import LoadingPage from './pages/loading';
import { useDealsFilterStore, useDealsModeStore, useDemoModeStore, useDrawerSheetStore, useFcmToken, useUserStore, } from './stores/stores';
import DisableInteraction from './components/disableinteraction';
import { DrawerSheetManager } from './components/drawersheet';
import { useAnimatedKeyboard } from 'react-native-reanimated';
import HeaderOnboarding from './components/headeronboarding';
import OnboardingInitialPage from './pages/onboardingpages/onboardinginitial';
import appleAuth from '@invertase/react-native-apple-authentication';
import { appleAccessRevoked } from './pages/authpages/oauth';
import { AlertBoxContext, AlertBoxWrapper } from './components/alertbox';
import OnboardingStack from './navigators/onboardingnavigator';
import AuthNavigator from './navigators/authnavigator';
import AppStackNavigator from './navigators/appstacknavigator';
import HydrateStores from './components/hydratestores';
import * as Sentry from '@sentry/react-native';
import UserRoleAppStackNavigator from './navigators/userroleappstacknavigator';
import { getDeviceFCMToken } from './network/pushnotification';
import messaging from '@react-native-firebase/messaging';
import { usePushNotificationsDataStore } from './stores/datastores';
import SplashScreen from 'react-native-splash-screen';
import Welcome from './pages/welcome';

Sentry.init({
  dsn: 'https://68d8fbda6f4c8e4c37055520ec092930@o4506120965980160.ingest.sentry.io/4506120974041088',
});

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function deepLinkFromNotificationData(data) {
  // console.log("data", data)
}

const config = {
  screens: {
    NotificationPage: {
      path: './buyerdashboard/notificationpages/notification',
    },
  },
};

const linking = {
  prefixes: ['worldref://', 'https://worldref.com'],
  config,
};

const Stack = createNativeStackNavigator();

function App() {
  const [loaded, setLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const userOnboarded = useUserStore(state => state.userOnboarded);

  const setFcmToken = useFcmToken(state => state.setFcmToken);

  const setUserOnboarded = useUserStore(state => state.setUserOnboarded);
  const loadUserDetails = useUserStore(state => state.getUser);
  const resetUserDetails = useUserStore(state => state.setUser);

  const loadDealsMode = useDealsModeStore(state => state.getDealsMode);
  const loadDealsFilter = useDealsFilterStore(state => state.getDealsFilter);

  const loadDemoMode = useDemoModeStore(state => state.getDemoMode);
  const setDemoMode = useDemoModeStore(state => state.setDemoMode);

  const setPushNotifications = usePushNotificationsDataStore(
    state => state.setPushNotifications,
  );
  const setNavigation = usePushNotificationsDataStore(
    state => state.setNavigation,
  );

  const updateDrawerNavigationState = useDrawerSheetStore(
    state => state.updateNavigationState,
  );

  const navigationRef = useRef(null);

  const colorScheme = useColorScheme();
  useAnimatedKeyboard();

  useEffect(() => {
    if (loaded) return;

    (async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        SetHeader('Authorization', `Bearer ${credentials.username}`);
        setAuthenticated(true);
      }

      await loadDealsMode();
      await loadDealsFilter();
      await loadUserDetails();
      await loadDemoMode();

      setLoaded(true);
    })();
    if (appleAuth.isSupported)
      return appleAuth.onCredentialRevoked(appleAccessRevoked);
  }, []);

  useEffect(() => {
    requestNotificationPermission();

    const unsubscribe = messaging().onMessage(async message => {
      setPushNotifications(message);
    });

    const unsubscribeMessage = messaging().onNotificationOpenedApp(
      async message => {
        setNavigation(message);
      },
    );

    return unsubscribe, unsubscribeMessage;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000)
  }, [])

  const requestNotificationPermission = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      const authStatus = await messaging().requestPermission();

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await getDeviceFCMToken();
        setFcmToken(token);
      }
    } catch (error) {
      throw error;
    }
  };

  DeviceEventEmitter.addListener('login', async ({ accessToken, refreshToken }) => {
    SetHeader('Authorization', `Bearer ${accessToken}`);
    await Keychain.setGenericPassword(accessToken, refreshToken);
    setAuthenticated(true);
  });

  DeviceEventEmitter.addListener('logout', async () => {
    RemoveHeader('Authorization');

    await Keychain.resetGenericPassword();
    await resetUserDetails(null);

    setAuthenticated(false);
    setUserOnboarded(false);
    setDemoMode(true);
  });

  DeviceEventEmitter.addListener('onboarded', () => setUserOnboarded(true));
  DeviceEventEmitter.addListener('demo-completed', () => setDemoMode(false));

  if (!loaded) {
    return (
      <SafeAreaProvider>
        <StatusBar backgroundColor={colors.Primary} barStyle="dark-content" />
        <LoadingPage />
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar backgroundColor={colors.Primary} barStyle="light-content" />
        <AlertBoxWrapper>
          <HydrateStores />
          <NavigationContainer ref={navigationRef} linking={linking} theme={{ colors: { background: colors.White } }} onStateChange={updateDrawerNavigationState}>
            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.White }, headerTitleStyle: { ...fontSizes.heading, color: colors.Black }, }}>
              {authenticated ? (
                <Stack.Group screenOptions={{ animation: 'slide_from_right' }}>
                  {!userOnboarded ? (
                    <Stack.Group screenOptions={{ animation: 'slide_from_right' }}>
                      <Stack.Screen name="OnboardingInitial" component={OnboardingInitialPage} options={{ header: props => <HeaderOnboarding {...props} />, animation: 'slide_from_right', }} />
                      <Stack.Screen name="Onboarding" component={OnboardingStack} options={{ header: props => (<HeaderOnboarding {...props} showProgress />), animation: 'slide_from_right', }} />
                    </Stack.Group>
                  ) : (<Stack.Screen name="AppStack" component={UserRoleAppStackNavigator} options={{ headerShown: false, animation: 'slide_from_right', }} />)}
                </Stack.Group>
              ) : (
                <Stack.Screen name="AuthStack" component={AuthNavigator} options={{ headerShown: false, animation: 'slide_from_right' }} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
          <DrawerSheetManager />
        </AlertBoxWrapper>
      </SafeAreaProvider>
      <DisableInteraction />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});

export default App;
