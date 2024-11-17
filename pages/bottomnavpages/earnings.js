import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, DeviceEventEmitter } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import shadows from '../../styles/shadows';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Aphrodite from '../../utilities/aphrodite';
import { Skeleton } from '../../components/skeletons';
import { GetEarningsOverview } from '../../network/models/earnings';
import { Alert, AlertBoxContext } from '../../components/alertbox';

function SuccessFeeCard({ title, text, amount, preset }) {
    const navigation = useNavigation();
    const createAlert = useContext(AlertBoxContext);

    return (
        <TouchableOpacity  onPress={() =>  navigation.navigate('EarningsList', { preset: preset })} /*  onPress={() => createAlert(Alert.Info('Earning details are not available at the moment. Please stay tuned for updates. We\'re sorry for the inconvinience.', 'Coming Soon'))} */ activeOpacity={0.8} style={styles.card} >
            <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{title}</Text>
                <View>
                    {
                        amount ?
                        <Text style={styles.cardInfo}>USD {Aphrodite.FormatNumbers(amount)}</Text> :
                        <Skeleton width={80} height={20}/>
                    }
                </View>
            </View>
            <Text style={styles.cardText}>{text}</Text>
        </TouchableOpacity>
    )
}

function EarningsPage(props) {
    const [earningsOverview, setEarningsOverview] = useState();

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchEarningsOverview();
    }, []);

    const fetchEarningsOverview = async () => {
        try {
            const earningsOverviewResponse = await GetEarningsOverview();
            setEarningsOverview(earningsOverviewResponse);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
            <SuccessFeeCard title={'Net Success Fee'} text={'Includes success fee for all deals where a Purchase Order has been issued by the Buyer'} amount={earningsOverview?.totalearning} preset={'NetSuccessFee'}/>
            <SuccessFeeCard title={'Success Fee Paid'} text={'Includes all deals and invoices for which Success Fee has been paid to the user'} amount={earningsOverview?.successfeespaid} preset={'SuccessFeePaid'}/>
            <SuccessFeeCard title={'Success Fee Not Paid'} text={'Includes all deals and invoices for which either Success Fee is under process, and those for which Success Fee is not yet due'} amount={earningsOverview?.successfeesnotpaid} preset={'SuccessFeeNotPaid'}/>
        </ScrollView>   
    )
}

const styles = StyleSheet.create({
    page: {
    },

    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 24,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardText: {
        ...fontSizes.body,
        color: colors.DarkGray,
        marginVertical: 8,
    },

    cardInfo: {
        ...fontSizes.heading_small,
        color: colors.Primary,
    },

    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default EarningsPage;