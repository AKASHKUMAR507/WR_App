import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useUserRoles, { Roles } from '../stores/userrole';
import LoadingPage from '../pages/loading';
import AppStackNavigator from './appstacknavigator';
import BuyerAppStackNavigator from '../buyerdashboard/buyernavigator/buyerappstacknavitor';
import { useCallback, useContext, useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert, AlertBoxContext } from '../components/alertbox';
import { usePushNotificationsDataStore } from '../stores/datastores';
import { DeviceEventEmitter } from 'react-native';


const Stack = createNativeStackNavigator();

const UserRoleAppStackNavigator = () => {
    const loadUserRole = useUserRoles(state => state.loadUserRole)
    const userRole = useUserRoles(state => state.userRole);

    const createAlert = useContext(AlertBoxContext);

    const notifications = usePushNotificationsDataStore(state => state.notifications);

    useEffect(() => {
        if (notifications) {
            createAlert(Alert.Info(notifications.notification.body, notifications.notification.title));
        }
    }, [notifications]);

    useFocusEffect(useCallback(() => {
        loadUserRole();
    }, []))

    if (userRole == Roles.Associate) {
        createAlert(Alert.Info("Associate login is not allowed in this app.", "Access Denied"));
        DeviceEventEmitter.emit('logout')
        return;
    }

    if (!userRole || (userRole !== Roles.Associate && userRole !== Roles.Buyer)) return <LoadingPage />

    return (
        <Stack.Navigator>
            {userRole === Roles.Associate && <Stack.Screen name="AssociateAppStack" component={AppStackNavigator} options={{ headerShown: false, animation: 'slide_from_right' }} />}
            {userRole === Roles.Buyer && <Stack.Screen name="BuyerAppStack" component={BuyerAppStackNavigator} options={{ headerShown: false, animation: 'slide_from_right' }} />}
        </Stack.Navigator>
    )
}

export default UserRoleAppStackNavigator
