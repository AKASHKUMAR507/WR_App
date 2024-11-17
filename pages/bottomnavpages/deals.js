import React, { useState, useEffect, createRef, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, TouchableOpacity, DeviceEventEmitter, ActivityIndicator, LayoutAnimation } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import DealStatusPill, { StatusTypeFromStatus } from '../../components/dealstatuspill';
import { DealModes, DealsModeSelector } from '../../components/modeselectors';
import { ListBuyingDeals, ListSellingDeals } from '../../network/models/deals';
import Chronos from '../../utilities/chronos';
import { FlashList } from "@shopify/flash-list";
import { useDealsFilterStore, useDealsModeStore } from '../../stores/stores';
import DealsFilter from '../../components/dealsfilter';
import SkeletonContainer from '../../components/skeletons';
import NoContentFound from '../../components/nocontentfound';
import useRefreshScreens from '../../hooks/refreshscreens';
import { DealTypeFromString, DealTypes } from '../dealpages/dealdetails';
import { Alert, AlertBoxContext } from '../../components/alertbox';

const DealsCardSkeletonData = { dealid: 0, dealname: '', description: '', roletype: '', dealstatus: '', createddate: 0, closingdate: 0, read: false }

function DealsCardBody({ deal, name, description, dealtype, rfqid = null }) {
    const navigation = useNavigation();
    const chronos = new Chronos();

    const roletype = StatusTypeFromStatus(deal.roletype);
    const dealstatus = StatusTypeFromStatus(deal.dealstatus);

    return (
        <TouchableOpacity testID={`${deal.dealid}:${rfqid}:deallist`} style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('DealDetails', { dealid: deal.dealid, role: dealtype, rfqid: rfqid })}>
            <View style={styles.cardHeader}>
                <Text style={styles.idText}>Deal {deal.dealid} {rfqid && ` (RFQ ${rfqid})`}</Text>
                <View style={styles.statusPills}>
                    <DealStatusPill status={roletype} />
                    <DealStatusPill status={dealstatus} />
                    {!deal.read && <View style={styles.indicator} />}
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text numberOfLines={2} style={styles.cardTitle}>{name}</Text>
                <Text numberOfLines={1} style={styles.cardBodyText}>{description}</Text>
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.cardText}>{chronos.FormattedDateFromTimestamp(deal.createddate)}</Text>
                <Text style={styles.cardText}>Closes<Text style={styles.cardTextBold}> {chronos.FormattedDateFromTimestamp(deal.closingdate)}</Text></Text>
            </View>
        </TouchableOpacity>
    )
}

function DealsCard({ deal }) {
    const dealtype = DealTypeFromString(deal.dealtype);

    return (
        <DealsCardBody deal={deal} name={deal.dealname} description={deal.description} dealtype={dealtype} rfqid={deal.rfqid} />
    )
}

function DealsListContainer({ dealsList }) {
    return (
        dealsList ?
            (
                dealsList.length > 0 ?
                    <FlashList data={dealsList} renderItem={({ item }) => <DealsCard deal={item} />} estimatedItemSize={200} showsVerticalScrollIndicator={false} /> :
                    <NoContentFound title={'No Deals Found'} message={'Could not find any deals matching your current preferences.'} />
            ) :
            <SkeletonContainer child={<DealsCard deal={DealsCardSkeletonData} />} />
    )
}

function DealsPage() {
    const navigation = useNavigation();
    const refreshScreens = useRefreshScreens();

    const [dealsList, setDealsList] = useState();

    const dealsMode = useDealsModeStore(state => state.dealsMode);
    const setDealsMode = useDealsModeStore(state => state.setDealsMode);

    const dealsFilters = useDealsFilterStore(state => state.dealsFilter);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        dealsMode === DealModes.Buying ? fetchBuyingDealsList() : fetchSellingDealsList();
    }, [dealsFilters, dealsMode, refreshScreens.shouldRefresh]);

    const fetchSellingDealsList = async () => {
        setDealsList();

        try {
            const sellingDeals = await ListSellingDeals(dealsFilters);
            setDealsList([...sellingDeals]);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const fetchBuyingDealsList = async () => {
        setDealsList();

        try {
            const buyingDeals = await ListBuyingDeals(dealsFilters);
            setDealsList([...buyingDeals]);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <React.Fragment>
            <DealsModeSelector mode={dealsMode} onChangeMode={(mode) => setDealsMode(mode)} />
            <DealsFilter onIconClick={() => navigation.navigate('DealsFilterSheet')} />
            <DealsListContainer dealsList={dealsList} />
            {
                dealsMode === DealModes.Selling &&
                <React.Fragment>
                    <View style={{ height: 64 }} />
                    <View style={styles.buttonContainer}>
                        <Button label='Refer New Deal' onPress={() => navigation.navigate('ReferDeal')} />
                    </View>
                </React.Fragment>
            }
        </React.Fragment>
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
    },

    cardBodyText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        marginTop: 4,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
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

    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
    },

    idText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },
});

export default DealsPage;
export { DealsCard, DealsCardSkeletonData, DealsListContainer }