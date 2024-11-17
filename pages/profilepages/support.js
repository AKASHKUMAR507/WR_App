import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, DeviceEventEmitter, ActivityIndicator, Alert as AlertPopup } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MenuButton, { MenuButtonTypes } from '../../components/atoms/menubutton';
import { DeleteAccount } from '../../network/models/auth';
import { Alert, AlertBoxContext } from '../../components/alertbox';

function SupportPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const createAlert = useContext(AlertBoxContext);

    const [logoutLoading, setLogoutLoading] = useState(false);

    const showDeleteAccountAlert = () => {
        AlertPopup.alert(
            'Are you sure you want to delete your account?',
            `\nYour information will be deleted permanently and you will not be able to recover your account.`,
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Delete Account',
                    onPress: () => deleteAccount(),
                    style: 'destructive'
                }
            ]
        );
    }

    const deleteAccount = async () => {
        try {
            setLogoutLoading(true);
            await DeleteAccount();
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
            <MenuButton type={MenuButtonTypes.Default} label='View Ticket' onPress={() => navigation.navigate('ViewTicket')} />
            <MenuButton type={MenuButtonTypes.Danger} label='Request Account Deletion' onPress={() => showDeleteAccountAlert()} spinner={logoutLoading} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    page: {
        flexGrow: 1,
        // justifyContent: 'space-between',
    },
});

export default SupportPage;