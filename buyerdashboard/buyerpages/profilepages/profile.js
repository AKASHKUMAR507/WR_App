import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../styles/colors';
import fontSizes from '../../../styles/fonts';
import MenuButton, { MenuButtonTypes } from '../../../components/atoms/menubutton';
import { FormInputDate } from '../../../components/form_inputs/dateinputs';
import { Logout } from '../../../network/models/auth';
import { useUserStore } from '../../../stores/stores';
import AvatarPlaceholder from '../../../components/avatarplaceholder';
import { Alert, AlertBoxContext } from '../../../components/alertbox';
import VerifiedBadge from '../../../components/atoms/verified';
import { usePredefinedTagsDataStore, useUserTagsDataStore } from '../../../stores/datastores';
import useRefreshScreens from '../../../hooks/refreshscreens';
import { GetUserInfo } from '../../../network/models/user';
import { useBuyerProfileInformation } from '../../../stores/fetchstore';

function ProfileDetails(props) {
    const navigation = useNavigation();
    const user = useUserStore(state => state.user);

    return (
        user ?
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.contactHeader}>
                        <AvatarPlaceholder style={styles.contactIcon} icon='initials' seed={user?.name.split(' ')[0].charAt(0)} />
                        <View style={styles.cardRow}>
                            <Text numberOfLines={1} style={[styles.cardHeading, { marginRight: 8 }]}>{user.name}</Text>
                            {user.verifiedcheck && <VerifiedBadge />}
                        </View>
                        <View style={{ height: 8 }} />
                        <Text style={styles.cardBodyText}>{user.email}</Text>
                        {user.company && <Text style={styles.cardBodyText}>{user.company}</Text>}
                    </View>
                </View>
                <MenuButton label='Profile Information' onPress={() => navigation.navigate('ProfileInfo')} />
                <MenuButton label='Add Product' onPress={() => navigation.navigate('AddProduct')} />
                {/* <MenuButton label='One Time Performance' onPress={() => navigation.navigate('OneTimePerformance')} /> */}

                <MenuButton label='Privacy' onPress={() => navigation.navigate("PrivacySetting")} />
                <MenuButton label='Change Password' onPress={() => navigation.navigate("ChangePassword")} />
                <View style={styles.vspace} />
                {/* <MenuButton label='Support' onPress={() => navigation.navigate('Supports')} /> */}
            </View> :
            <View style={styles.centreContainer}>
                <ActivityIndicator color={colors.DarkGray} />
            </View>
    )
}

function ProfileDetailsPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const refreshScreens = useRefreshScreens();
    const createAlert = useContext(AlertBoxContext);

    const [logoutLoading, setLogoutLoading] = useState(false);

    const setUser = useUserStore(state => state.setUser);
    const fetchBuyerProfileInfo = useBuyerProfileInformation(state => state.fetchBuyerProfileInfo);

    useEffect(() => {
        fetchBuyerProfileInformation();
    }, [refreshScreens.shouldRefresh]);

    const fetchBuyerProfileInformation = async () => {
        try {
            await fetchBuyerProfileInfo();
        } catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const logout = async () => {
        try {
            setLogoutLoading(true);
            await Logout();
            DeviceEventEmitter.emit('logout');
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
        finally {
            setLogoutLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
            <ProfileDetails />
            <View>
                <MenuButton type={MenuButtonTypes.Danger} label='Sign Out' onPress={() => logout()} spinner={logoutLoading} />
                <Text style={styles.version}>WorldRef v2.0.3 (167)</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    page: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },

    card: {
        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        flexWrap: 'wrap',
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
    },

    contactHeader: {
        alignItems: 'center',
        width: '100%',
    },

    contactIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,

        backgroundColor: colors.DarkGray20,
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 8,
    },

    contactIconText: {
        ...fontSizes.heading_xxlarge,
        color: colors.DarkGray80,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    cardBody: {
        paddingTop: 16,
    },

    cardHeading: {
        ...fontSizes.heading,
        color: colors.Black,
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,

        paddingHorizontal: 16,
        paddingBottom: 8,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardBodyText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        marginBottom: 4,
    },

    cardTextBold: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },

    section: {
        borderBottomColor: colors.LightGray,
        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
        borderBottomWidth: 1,

        paddingVertical: 12,
        paddingHorizontal: 16,

        backgroundColor: colors.LightGray20,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    sectionGroup: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',

        marginLeft: 16,

        flex: 1
    },

    vsep: {
        height: 16
    },

    centreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    version: {
        ...fontSizes.body_xsmall,
        color: colors.DarkGray80,
        textAlign: 'center',

        marginVertical: 4,
    },
});

export default ProfileDetailsPage;