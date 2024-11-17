import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, LayoutAnimation, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import colors from '../styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VectorImage from 'react-native-vector-image';
import shadows from '../styles/shadows';
import fontSizes from '../styles/fonts';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useDemoModeStore, useUserStore } from '../stores/stores';
import AvatarPlaceholder from './avatarplaceholder';
import { useNewNotificationsDataStore, useNotificationsDataStore } from '../stores/datastores';
import Animated, { interpolate, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import Aphrodite from '../utilities/aphrodite';

// Please note that in the renderer, we explicitly check for network.isConnected === false
// This is because network.isConnected is undefined when the app is first launched
function Header(props) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const network = useNetInfo();
    const user = useUserStore(state => state.user);

    const demoMode = useDemoModeStore(state => state.demoMode);

    const fetchNotifications = useNewNotificationsDataStore(state => state.fetchNotification)
    const unread = useNewNotificationsDataStore(state => state.unread);

    const userIconMaxTranslation = 32;

    const userIconTranslation = useSharedValue(props.options.userIconShown ? 0 : userIconMaxTranslation);

    const userIconOpacity = useDerivedValue(() => {
        return interpolate(userIconTranslation.value, [0, userIconMaxTranslation / 2], [1, 0]);
    });

    const notificationsIconTranslation = useDerivedValue(() => {
        return interpolate(userIconTranslation.value, [0, userIconMaxTranslation / 2], [0, userIconMaxTranslation - 8]);
    });

    const userIconSlideOut = () => {
        'worklet'
        userIconTranslation.value = withTiming(userIconMaxTranslation);
    }

    const userIconSlideIn = () => {
        'worklet'
        userIconTranslation.value = withTiming(0);
    }

    // useEffect(() => {
    //     fetchNotifications();
    // }, [network.isConnected]);

    useFocusEffect(React.useCallback(() => {
        fetchNotifications();
    }, [network.isConnected]))

    useEffect(() => {
        props.options.userIconShown ? userIconSlideIn() : userIconSlideOut();
    }, [props.options.userIconShown]);

    return (
        <React.Fragment>
            <View style={[styles.headerStyles, { paddingTop: insets.top + 16 }]}>
                <View style={{ flex: 1, overflow: 'hidden', }}>
                    <Text style={styles.welcomeText}>Welcome</Text>
                    <Text style={[styles.userText, { overflow: 'hidden', flexWrap: 'wrap', textTransform: 'capitalize' }]}>{user?.name}</Text>
                </View>
                {
                    network.isConnected !== false && user ?
                        <View style={styles.headerIconsRow}>
                            <Animated.View style={{ transform: [{ translateX: notificationsIconTranslation }] }}>
                                <TouchableOpacity testID={`notificationicon`} activeOpacity={0.8} style={styles.headerIconContainer} onPress={() => navigation.navigate('NotificationPage')}>
                                    {
                                        unread > 0 &&
                                        <View style={styles.notificationBadge}>
                                            <Text style={styles.notificationBadgeText}>{unread === 0 ? '' : unread > 99 ? '+99' : Aphrodite.FormatToTwoDigits(unread)}</Text>
                                        </View>
                                    }
                                    <VectorImage style={styles.headerIcons} source={require('../assets/icons/bell.svg')} />
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View style={{ transform: [{ translateY: userIconTranslation }], opacity: userIconOpacity }}>
                                <TouchableOpacity testID={`profileicon`} disabled={!props.options.userIconShown || !user} activeOpacity={0.8} style={styles.headerIconContainer} onPress={() => navigation.navigate('Profile')}>
                                    {
                                        user.profileimageid ?
                                            <View style={styles.headerUserIcon} /> :
                                            <AvatarPlaceholder style={styles.headerUserIcon} icon='initials' seed={user.name.split(' ')[0].charAt(0)} />
                                    }
                                </TouchableOpacity>
                            </Animated.View>
                        </View> :
                        <View style={styles.headerIconsRow}>
                            {
                                network.isConnected === false && <Text style={styles.networkText}>Connecting</Text> ||
                                !user && <Text style={styles.networkText}>Loading</Text>
                            }
                            <ActivityIndicator size='small' color={colors.DarkGray} />
                        </View>
                }
            </View>
            {
                network.isConnected === false &&
                <View style={styles.noNetworkTab}>
                    <Text style={styles.noNetworkTabText}>You are currently offline</Text>
                </View>
            }
            {/* {
                demoMode &&
                <View style={styles.demoModeTab}>
                    <Text style={styles.demoModeTabText}>Demo Mode Active. Tap To Learn More.</Text>
                </View>
            } */}
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    headerStyles: {
        paddingHorizontal: 16,
        paddingBottom: 8,

        backgroundColor: colors.Primary,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    headerIconsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        marginLeft: 24,
    },

    headerIcons: {
        width: 28,
        height: 28,

        borderRadius: 14,

        tintColor: colors.White
    },

    headerUserIcon: {
        width: 44,
        height: 44,

        borderRadius: 22,
    },

    headerLogo: {
        width: 154,
        height: 37,
    },

    notificationBadge: {
        paddingHorizontal: 4,
        paddingVertical: 2,

        borderRadius: 12,

        backgroundColor: colors.Error,

        alignItems: 'center',
        justifyContent: 'center',

        position: 'absolute',
        top: -8,
        right: -4,

        minWidth: 24,
        minHeight: 24,

        zIndex: 1,
    },

    notificationBadgeText: {
        ...fontSizes.button_xsmall,
        color: colors.White,
    },

    networkText: {
        ...fontSizes.heading_small,
        color: colors.DarkGray,

        marginRight: 12,
    },

    noNetworkTab: {
        backgroundColor: colors.Primary,

        paddingVertical: 6,
        paddingHorizontal: 16,

        ...shadows.shadowLight,
    },

    noNetworkTabText: {
        ...fontSizes.heading_xsmall,
        color: colors.White,
    },

    demoModeTab: {
        backgroundColor: colors.Secondary,

        paddingVertical: 6,
        paddingHorizontal: 16,

        ...shadows.shadowExtraLight,
    },

    demoModeTabText: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    welcomeText: {
        color: colors.White,
        ...fontSizes.heading_small
    },

    userText: {
        color: colors.White,
        ...fontSizes.heading_large,
        fontSize: 22
    }
});

export default Header;