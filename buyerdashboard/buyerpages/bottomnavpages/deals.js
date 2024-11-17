import React, { useState, useEffect, createRef, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, TouchableOpacity, DeviceEventEmitter, ActivityIndicator, LayoutAnimation, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from '../../../components/atoms/buttons';
import fontSizes from '../../../styles/fonts';
import colors from '../../../styles/colors';
import DealStatusPill, { StatusTypeFromStatus } from '../../../components/dealstatuspill';
import { DealModes, DealsModeSelector } from '../../../components/modeselectors';
import { ListBuyingDeals, ListSellingDeals } from '../../../network/models/deals';
import Chronos from '../../../utilities/chronos';
import { FlashList } from "@shopify/flash-list";
import { useDealsFilterStore, useDealsModeStore, useMroHubDealsFilterStore } from '../../../stores/stores';
import SkeletonContainer from '../../../components/skeletons';
import NoContentFound from '../../../components/nocontentfound';
import useRefreshScreens from '../../../hooks/refreshscreens';
import { Alert, AlertBoxContext } from '../../../components/alertbox';
import { DealTypeFromString, DealTypes } from '../../../pages/dealpages/dealdetails';
import useRefreshControl from '../../../hooks/refreshcontrol';
import DealsFilter from '../../dealsfilter';
import { DraftDealList, MroHubDealList } from '../../../network/models/mrohubdeal';

const DealsCardSkeletonData = { dealid: 0, dealname: '', description: '', roletype: '', dealstatus: '', createddate: 0, closingdate: 0, read: false }

function getActiveFilter(statusObject) {
    for (let key in statusObject) {
        if (statusObject[key]) {
            return key.toUpperCase();
        }
    }
    return '';
}

function DealsCardBody({ deal, name, description, dealtype, rfqid = null }) {
    const navigation = useNavigation();
    const chronos = new Chronos();

    const roletype = StatusTypeFromStatus(deal.roletype);
    const dealstatus = StatusTypeFromStatus(deal.dealstatus);

    const handleNavigation = ({dealid, draft = 0}) => {
        navigation.navigate('BuyerDealDetails', {dealid: dealid, draft: draft});
    }
    return (
        <TouchableOpacity testID={`${deal.dealid}:${rfqid}:deallist`} style={styles.card} activeOpacity={0.8} onPress={() => handleNavigation({dealid: deal.dealid, draft: 0})}>
            <View style={styles.cardHeader}>
                <Text style={styles.idText}>Deal {deal.dealid} {rfqid && ` (RFQ ${rfqid})`}</Text>
                <View style={styles.statusPills}>
                    <DealStatusPill status={dealstatus} />
                    {!deal.read && <View style={styles.indicator} />}
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text numberOfLines={2} style={styles.cardTitle}>{name}</Text>
                <Text numberOfLines={1} style={styles.cardBodyText}>{description}</Text>
            </View>
            <View style={styles.cardBody}>
                {/* <Text style={styles.cardTitle}>Associated Deal Manager</Text>
                {
                    deal.dealmanagername &&
                    <View style={styles.cardHeader}>
                        <Text style={styles.idText}>Name</Text>
                        <Text style={styles.idText}>{deal.dealmanagername}</Text>
                    </View>
                } */}
                {/* <View style={styles.cardHeader}>
                    <Text style={styles.idText}>Mobile No</Text>
                    <Text style={styles.idText}>+91 8372837282</Text>
                </View>
                <View style={styles.cardHeader}>
                    <Text style={styles.idText}>Email</Text>
                    <Text style={styles.idText}>cs@gmail.com</Text>
                </View> */}
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

function DealsListContainer({ dealsList, refreshDeals }) {

    return (
        dealsList?.content ?
            (
                dealsList?.content?.length > 0 ?
                    <FlashList data={dealsList.content} renderItem={({ item }) => <DealsCard deal={item} />} estimatedItemSize={200} showsVerticalScrollIndicator={false} /> :
                    <NoContentFound title={'No Deals Found'} message={'Could not find any deals matching your current preferences.'} />
            ) :
            <SkeletonContainer child={<DealsCard deal={DealsCardSkeletonData} />} />
    )
}

function DealsPage() {
    const navigation = useNavigation();
    const refreshScreens = useRefreshScreens();

    const [dealsList, setDealsList] = useState();
    const dealsFilters = useMroHubDealsFilterStore(state => state.dealsFilter);

    const [page, setPage] = useState(1)

    const createAlert = useContext(AlertBoxContext);

    useFocusEffect(useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        fetchMroHubDealsList()
    }, [dealsFilters, refreshScreens.shouldRefresh]));


    const fetchMroHubDealsList = async () => {
        setDealsList();

        const dealFilterParams = { dealstatus: getActiveFilter(dealsFilters.dealstatus), pagenum: page.toString(), elements: '1000' }
        
        try {
            const deals = await MroHubDealList(dealFilterParams);
            setDealsList(deals);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <React.Fragment>
            <DealsFilter onIconClick={() => navigation.navigate('DealsFilterSheet')} />
            <DealsListContainer dealsList={dealsList} />
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
export { DealsCard, DealsCardSkeletonData }