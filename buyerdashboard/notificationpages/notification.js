import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import SkeletonContainer from '../../components/skeletons';
import { FlashList } from '@shopify/flash-list';
import NoContentFound from '../../components/nocontentfound';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import fontSizes from '../../styles/fonts';
import Chronos from '../../utilities/chronos';
import { useNewNotificationsDataStore, useNotificationsDataStore } from '../../stores/datastores';
import { UpdateNewNotificationStatus, UpdateNotification } from '../../network/models/user';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import VectorImage from 'react-native-vector-image';

const notificationsSkeletonData = { associateid: 0, category: "", categorytype: "", createdAt: "", dealid: "", message: "", notificationId: 0, read: false }

const NotificationCard = ({ notification }) => {
    const navigation = useNavigation();
    const chronos = new Chronos();

    const [notificationId, setNotificationId] = useState(null)

    const opacity = useSharedValue(0.5);

    useEffect(() => {
        if (!notification.read) {
            opacity.value = withRepeat(
                withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        } else {
            opacity.value = 1;
        }
    }, [notification.read]);

    useEffect(() => {
        const handleUpdateNotification = async () => {
            if (notificationId) {
                await UpdateNewNotificationStatus({ notificationId: notificationId })
            }
        }
        handleUpdateNotification();
    }, [notificationId]);


    const animatedStyle = useAnimatedStyle(() => {
        return { opacity: opacity.value };
    });

    const handleCardPress = () => {
        setNotificationId(notification.notificationId);
        navigation.navigate('ViewPOTracking', { orderid: parseInt(notification.dealid) })
    }

    return (
        <TouchableOpacity style={[{ paddingVertical: 8 }]} activeOpacity={0.8} onPress={() => handleCardPress()}>
            <View style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
                <Animated.View style={[styles.active, { backgroundColor: notification.read ? colors.White : colors.Primary }, animatedStyle]} />
                <VectorImage source={require('../../assets/icons/logo.svg')} resizeMode='contain' style={{ height: 20, width: 20 }} />
                <View style={{ flex: 1, paddingVertical: 4 }}>
                    {/* {notification.heading && <Text style={styles.heading}>{notification.heading}</Text>} */}
                    <Text numberOfLines={2} style={notification.heading ? styles.title : styles.heading}>{notification.message}</Text>
                </View>

                <Text style={styles.times} >{chronos.NotificationTime(notification?.createdAt)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const NotificationContainer = () => {
    const insets = useSafeAreaInsets();
    const { notifications } = useNewNotificationsDataStore(state => state.notifications)

    return (
        notifications ? (
            notifications.length > 0 ?
                <FlashList data={notifications} renderItem={({ item, index }) => <NotificationCard notification={item} key={index} />} estimatedItemSize={100} ItemSeparatorComponent={() => <View style={styles.vspace} />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingHorizontal: 16 }} /> :
                <NoContentFound title='Notifications' message={`Don't have any notification`} />
        ) : <SkeletonContainer child={<NotificationCard notification={notificationsSkeletonData} />} />
    )
}

const NotificationPage = () => {
    const loadNotification = useNewNotificationsDataStore(state => state.loadNotification);
    const fetchNotification = useNewNotificationsDataStore(state => state.fetchNotification);

    // useEffect(() => {
    //     loadNotification();
    //     fetchNotification();
    // }, [])

    useFocusEffect(React.useCallback(() => {
        loadNotification();
        fetchNotification();
    }, []))

    return (
        <React.Fragment>
            <NotificationContainer />
        </React.Fragment>
    )
}

export default NotificationPage

const styles = StyleSheet.create({
    vspace: {
        height: 1.5,
        backgroundColor: colors.LightGray,
    },

    active: {
        backgroundColor: colors.Primary,
        height: 8,
        width: 8,
        borderRadius: 8
    },

    times: {
        color: colors.Black,
        ...fontSizes.caption
    },

    heading: {
        ...fontSizes.heading_small,
        color: colors.Black
    },

    title: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray
    }
})