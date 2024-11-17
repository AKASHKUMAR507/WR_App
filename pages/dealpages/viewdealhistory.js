import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import MenuButton from '../../components/atoms/menubutton';
import Chronos from '../../utilities/chronos';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useCurrentDeal from '../../hooks/currentdeal';
import { Alert, AlertBoxContext } from '../../components/alertbox';

function GetLabelAndCallbackForCategory(category) {
    const navigation = useNavigation();

    switch (category) {
        case 'RFQ':
            return { label: 'View Deal Details', callback: () => navigation.goBack() };
        case 'Quotes':
            return { label: 'View Quotations', callback: () => navigation.navigate('ViewQuotations') };
        case 'Messages':
            return { label: 'View Messages', callback: () => navigation.navigate('Chat') };
        default: 
            return { label: 'View Deal Details', callback: () => navigation.goBack() };
    }
}

function FollowDealNotification({ category }) {
    const { label, callback } = GetLabelAndCallbackForCategory(category);

    return (
        <MenuButton label={label} onPress={() => callback()}/>
    )
}

function DealHistoryCard({ notification }) {
    const chronos = new Chronos();

    return (
        <React.Fragment>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardText}>{chronos.FormattedDateTimeFromTimestamp(notification.createdAt)}</Text>
                    <View style={styles.edits}>
                        <Text style={styles.cardText}>{chronos.ElapsedTimeFromTimestamp(notification.createdAt)}</Text>
                    </View>
                </View>
                <Text style={styles.cardTitle}>{notification.message}</Text>
            </View>
            <FollowDealNotification category={notification.category}/>
            <View style={styles.vspace}/>
        </React.Fragment>
    )
}

function ViewDealHistoryPage(props) {
    const [currentDeal] = useCurrentDeal();

    const notifications = Chronos.SortObjectsByDate(currentDeal.notifications, 'createdAt');
    const insets = useSafeAreaInsets();

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
            { notifications.map((notification, index) => <DealHistoryCard key={index} notification={notification}/>) }
        </ScrollView>   
    )
}

const styles = StyleSheet.create({
    page: {
    },

    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 16,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardBody: {
        marginVertical: 16,
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,

        marginTop: 12,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardBodyText: {
        ...fontSizes.body_small,
        color: colors.DarkGray,

        marginTop: 4,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    cardAction: {
        ...fontSizes.heading_xsmall,
        color: colors.Primary,

        marginTop: 12,
    },

    statusPills: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    indicator: {
        width: 12,
        height: 12,
        
        borderRadius: 6,
        backgroundColor: colors.Error,
        
        marginHorizontal: 4,
    },

    cardRowWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    tag: {
        backgroundColor: colors.Primary20,
        borderRadius: 16,

        paddingHorizontal: 16,
        paddingVertical: 4,

        marginRight: 8,
        marginBottom: 8,
    },

    tagText: {
        ...fontSizes.button_small,
        color: colors.Primary,
    },

    edits: {
        backgroundColor: colors.LightGray,
        borderRadius: 4,

        paddingHorizontal: 12,
        paddingVertical: 4,

        alignSelf: 'flex-start',
    },

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },
});

export default ViewDealHistoryPage;