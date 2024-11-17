import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, TouchableOpacity, LayoutAnimation, DeviceEventEmitter } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import EarningsFilter from '../../components/earningsfilter';
import { useEarningsFilterStore } from '../../stores/stores';
import { ListEarnings } from '../../network/models/earnings';
import SkeletonContainer from '../../components/skeletons';
import { FlashList } from '@shopify/flash-list';
import Chronos from '../../utilities/chronos';
import Aphrodite from '../../utilities/aphrodite';
import { Alert, AlertBoxContext } from '../../components/alertbox';

const EarningsCardSkeletonData = { dealname: '', description: '', dealcreateddate: 0, associatetotalfees: 0 }

const EarningClaimPresets = {
    SuccessFeePaid: {
        dealtype: { BUYING: true, SELLING: true },
        claimstatus: { ELIGIBLE_FOR_CLAIM: false, NOT_ELIGIBLE_FOR_CLAIM: false, CLAIM_UNDER_PROCESS: false, SUCCESS_FEE_PAID: true, SUCCESS_FEE_NOT_PAID: false }
    },
    SuccessFeeNotPaid: {
        dealtype: { BUYING: true, SELLING: true },
        claimstatus: { ELIGIBLE_FOR_CLAIM: false, NOT_ELIGIBLE_FOR_CLAIM: false, CLAIM_UNDER_PROCESS: false, SUCCESS_FEE_PAID: false, SUCCESS_FEE_NOT_PAID: true }
    },
    NetSuccessFee: {
        dealtype: { BUYING: true, SELLING: true },
        claimstatus: { ELIGIBLE_FOR_CLAIM: true, NOT_ELIGIBLE_FOR_CLAIM: true, CLAIM_UNDER_PROCESS: true, SUCCESS_FEE_PAID: true, SUCCESS_FEE_NOT_PAID: true }
    }
}

const EarningClaimTypes = {
    EligibleForClaim: 'Eligible For Claim',
    NotEligibleForClaim: 'Not Eligible For Claim',
    ClaimUnderProcess: 'Claim Under Process', 
    SuccessFeeNotPaid: 'Success Fee Not Paid',
    SuccessFeePaid: 'Success Fee Paid',
}

function ClaimStylesByType(type) {
    switch (type) {
        case EarningClaimTypes.EligibleForClaim:
            return { backgroundColor: colors.Success10, color: colors.Success }
        case EarningClaimTypes.NotEligibleForClaim:
            return { backgroundColor: colors.Error10, color: colors.Error }
        case EarningClaimTypes.ClaimUnderProcess:
            return { backgroundColor: colors.Secondary, color: colors.Warning }
        case EarningClaimTypes.SuccessFeeNotPaid:
            return { backgroundColor: colors.Warning, color: colors.White }
        case EarningClaimTypes.SuccessFeePaid:
            return { backgroundColor: colors.Success, color: colors.White }
        default:
            return { backgroundColor: colors.LightGray20, color: colors.Success }
    }
}

function EarningsCardTagClaim({ type = EarningClaimTypes.NotEligibleForClaim }) {
    const { backgroundColor, color } = ClaimStylesByType(type);

    return (
        <View style={[styles.tag, { backgroundColor: backgroundColor }]}>
            <Text style={[styles.tagText, { color: color }]}>{type}</Text>
        </View>
    )
}

function GetClaimTypeFromEarningFlags(associatePaidFlag, claimSubmittedFlag, worldRefPaidFlag) {
    const associatePaid = associatePaidFlag === 'y';
    const claimSubmitted = claimSubmittedFlag === 'y';
    const worldRefPaid = worldRefPaidFlag === 'y';

    if (!worldRefPaid) return EarningClaimTypes.NotEligibleForClaim;
    if (worldRefPaid && !claimSubmitted) return EarningClaimTypes.EligibleForClaim;
    if (worldRefPaid && claimSubmitted && !associatePaid) return EarningClaimTypes.ClaimUnderProcess;
    if (worldRefPaid && claimSubmitted && associatePaid) return EarningClaimTypes.SuccessFeePaid;
    return EarningClaimTypes.SuccessFeeNotPaid;
}

function EarningsCard({ earning }) {
    const navigation = useNavigation();
    const chronos = new Chronos();
    const claimType = GetClaimTypeFromEarningFlags(earning.associatepaidflag, earning.claim_submitted, earning.wrpaidflag);

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('EarningDetailsPreClaim', {earning: earning, claimType: claimType})}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardText}>{chronos.FormattedDateFromTimestamp(earning.dealcreateddate)}</Text>
                <EarningsCardTagClaim type={claimType}/>
            </View>
            <View style={styles.cardBody}>
                <Text numberOfLines={2} style={styles.cardTitle}><Text style={styles.cardText}>{`(${earning.dealid}) `}</Text>{earning.dealname}</Text>
                <View style={{ height: 8 }}/>
                <Text numberOfLines={2} style={styles.cardText}>{earning.description}</Text>
            </View>
            <View style={styles.cardFooter}>
                <View>
                    <Text style={styles.cardText}>Amount</Text>
                    <Text style={styles.cardAmountText}>USD {Aphrodite.FormatNumbers(earning.associatetotalfees)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function EarningsListContainer({ earningsList }) {
    return (
        earningsList ?
        ( 
            earningsList.length > 0 ? 
            <FlashList data={earningsList} renderItem={({ item }) => <EarningsCard earning={item}/>} estimatedItemSize={240} showsVerticalScrollIndicator={false}/> : 
            <NoContentFound title={'No Deals Found'} message={'Could not find any deals matching your current preferences.'}/>
        ) :
        <SkeletonContainer child={<EarningsCard earning={EarningsCardSkeletonData}/>}/>
    )
}

function EarningsListPage(props) {
    const navigation = useNavigation();

    const [earningsList, setEarningsList] = useState();
    const [preset, setPreset] = useState();
    const createAlert = useContext(AlertBoxContext);

    const earningsFilter = useEarningsFilterStore(state => state.earningsFilter);
    const setEarningsFilter = useEarningsFilterStore(state => state.setEarningsFilter);

    useLayoutEffect(() => {
        const presetFromRoutes = props.route?.params?.preset;
        if (presetFromRoutes) setPreset(EarningClaimPresets[presetFromRoutes]); 
    }, []);

    useEffect(() => {
        if (preset) setEarningsFilter(preset);
    }, [preset]);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        fetchEarningsList();
    }, [earningsFilter]);

    const fetchEarningsList = async () => {
        setEarningsList();

        try {
            const earnings = await ListEarnings(earningsFilter);
            setEarningsList([...earnings]);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }
    
    return (
        <React.Fragment>
            <EarningsFilter/>
            <EarningsListContainer earningsList={earningsList}/>
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

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    cardAmountText: {
        ...fontSizes.heading_large,
        color: colors.Black,
    },

    cardRowWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        marginTop: 8,
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

    tag: {
        backgroundColor: colors.LightGray,

        paddingHorizontal: 8,
        paddingVertical: 4,

        borderRadius: 4,

        marginVertical: 4,
        marginRight: 8,
    },

    tagText: {
        ...fontSizes.button_small,
        color: colors.DarkGray,
    },

    vspace: {
        height: 24,
    },
});

export default EarningsListPage;
export { EarningClaimTypes }