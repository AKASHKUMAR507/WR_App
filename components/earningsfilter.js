import React, { createRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, DeviceEventEmitter, Dimensions } from 'react-native';
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';
import shadows from '../styles/shadows';
import VectorImage from 'react-native-vector-image';
import { Button, ButtonSizes, ButtonTypes } from './atoms/buttons';
import { useDealsFilterStore, useDrawerSheetStore, useEarningsFilterStore } from '../stores/stores';
import { CheckboxRow, FilterPill } from './dealsfilter';
import { DrawerSheetObject } from './drawersheet';

function EarningsFilter() {
    const earningsListParams = useEarningsFilterStore(state => state.earningsFilter);
    const setEarningsListParams = useEarningsFilterStore(state => state.setEarningsFilter);

    const addDrawerSheet = useDrawerSheetStore(state => state.addDrawerSheet);
    const toggleDrawerSheet = useDrawerSheetStore(state => state.toggleDrawerSheet);

    useEffect(() => {
        addDrawerSheet(new DrawerSheetObject('earningsFilterSheet', <EarningsFilterSheetContent />))
    },[])

    const toggleDealType = (deal) => {
        const newEarningsListParams = { ...earningsListParams };
        newEarningsListParams.dealtype[deal] = !newEarningsListParams.dealtype[deal];

        if (!newEarningsListParams.dealtype.BUYING && !newEarningsListParams.dealtype.SELLING) {
            newEarningsListParams.dealtype.BUYING = true;
        }

        setEarningsListParams({ ...newEarningsListParams });
    }

    const toggleClaimStatus = (status) => {
        const newEarningsListParams = { ...earningsListParams };
        newEarningsListParams.claimstatus[status] = !newEarningsListParams.claimstatus[status];

        if (!newEarningsListParams.claimstatus.ELIGIBLE_FOR_CLAIM && !newEarningsListParams.claimstatus.NOT_ELIGIBLE_FOR_CLAIM && !newEarningsListParams.claimstatus.CLAIM_UNDER_PROCESS && !newEarningsListParams.claimstatus.SUCCESS_FEE_PAID && !newEarningsListParams.claimstatus.SUCCESS_FEE_NOT_PAID) {
            newEarningsListParams.claimstatus.ELIGIBLE_FOR_CLAIM = true;
        }

        setEarningsListParams({ ...newEarningsListParams });
    }

    return (
        <View style={styles.filterContainer}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => toggleDrawerSheet('earningsFilterSheet')} >
                <VectorImage source={require('../assets/icons/adjustments.svg')} style={styles.filterIcon}/>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.filterRow} horizontal={true} showsHorizontalScrollIndicator={false}>
                <FilterPill active={earningsListParams.dealtype.BUYING} onPress={() => toggleDealType('BUYING')} text="Buying"/>
                <FilterPill active={earningsListParams.dealtype.SELLING} onPress={() => toggleDealType('SELLING')} text="Selling"/>
                <View style={styles.hsep}/>
                <FilterPill active={earningsListParams.claimstatus.ELIGIBLE_FOR_CLAIM} onPress={() => toggleClaimStatus('ELIGIBLE_FOR_CLAIM')} text="Eligible For Claim"/>
                <FilterPill active={earningsListParams.claimstatus.NOT_ELIGIBLE_FOR_CLAIM} onPress={() => toggleClaimStatus('NOT_ELIGIBLE_FOR_CLAIM')} text="Not Eligible For Claim"/>
                <FilterPill active={earningsListParams.claimstatus.CLAIM_UNDER_PROCESS} onPress={() => toggleClaimStatus('CLAIM_UNDER_PROCESS')} text="Claim Under Process"/>
                <FilterPill active={earningsListParams.claimstatus.SUCCESS_FEE_PAID} onPress={() => toggleClaimStatus('SUCCESS_FEE_PAID')} text="Success Fee Paid"/>
                <FilterPill active={earningsListParams.claimstatus.SUCCESS_FEE_NOT_PAID} onPress={() => toggleClaimStatus('SUCCESS_FEE_NOT_PAID')} text="Success Fee Not Paid"/>
            </ScrollView>
        </View>
    )
}

function EarningsFilterSheetContent() {
    const earningsListParams = useEarningsFilterStore(state => state.earningsFilter);
    const setEarningsListParams = useEarningsFilterStore(state => state.setEarningsFilter);

    const toggleDealType = (deal) => {
        const newEarningsListParams = { ...earningsListParams };
        newEarningsListParams.dealtype[deal] = !newEarningsListParams.dealtype[deal];

        if (!newEarningsListParams.dealtype.BUYING && !newEarningsListParams.dealtype.SELLING) {
            newEarningsListParams.dealtype.BUYING = true;
        }

        setEarningsListParams({ ...newEarningsListParams });
    }

    const toggleClaimStatus = (status) => {
        const newEarningsListParams = { ...earningsListParams };
        newEarningsListParams.claimstatus[status] = !newEarningsListParams.claimstatus[status];

        setEarningsListParams({ ...newEarningsListParams });
    }

    const setAllFilters = (value = false) => {
        const newEarningsListParams = { ...earningsListParams };

        newEarningsListParams.dealtype.BUYING = true;
        newEarningsListParams.dealtype.SELLING = value;

        newEarningsListParams.claimstatus.ELIGIBLE_FOR_CLAIM = true;
        newEarningsListParams.claimstatus.NOT_ELIGIBLE_FOR_CLAIM = value;
        newEarningsListParams.claimstatus.CLAIM_UNDER_PROCESS = value;
        newEarningsListParams.claimstatus.SUCCESS_FEE_PAID = value;
        newEarningsListParams.claimstatus.SUCCESS_FEE_NOT_PAID = value;

        setEarningsListParams({ ...newEarningsListParams });
    }

    return (
        <ScrollView contentContainerStyle={styles.filterSheet}>
            <Text style={styles.filterSheetTitle}>Filter Earnings</Text>
            <View style={styles.filterSheetGroup}> 
                <Text style={styles.filterSheetSubheading}>Associate Deal Roles</Text>
                <CheckboxRow active={earningsListParams.dealtype.BUYING} onPress={() => toggleDealType('BUYING')} text="Buying"/>
                <CheckboxRow active={earningsListParams.dealtype.SELLING} onPress={() => toggleDealType('SELLING')} text="Selling"/>
            </View>
            <View style={styles.vsep}/>
            <View style={styles.filterSheetGroup}>
                <Text style={styles.filterSheetSubheading}>Claim Status Types</Text>
                <CheckboxRow active={earningsListParams.claimstatus.ELIGIBLE_FOR_CLAIM} onPress={() => toggleClaimStatus('ELIGIBLE_FOR_CLAIM')} text="Eligible For Claim"/>
                <CheckboxRow active={earningsListParams.claimstatus.NOT_ELIGIBLE_FOR_CLAIM} onPress={() => toggleClaimStatus('NOT_ELIGIBLE_FOR_CLAIM')} text="Not Eligible For Claim"/>
                <CheckboxRow active={earningsListParams.claimstatus.CLAIM_UNDER_PROCESS} onPress={() => toggleClaimStatus('CLAIM_UNDER_PROCESS')} text="Claim Under Process"/>
                <CheckboxRow active={earningsListParams.claimstatus.SUCCESS_FEE_PAID} onPress={() => toggleClaimStatus('SUCCESS_FEE_PAID')} text="Success Fee Paid"/>
                <CheckboxRow active={earningsListParams.claimstatus.SUCCESS_FEE_NOT_PAID} onPress={() => toggleClaimStatus('SUCCESS_FEE_NOT_PAID')} text="Success Fee Not Paid"/>
            </View>
            <View style={styles.filterBottomRow}>
                <View style={{ flex: 1 }}>
                    <Button type={ButtonTypes.primary} size={ButtonSizes.small} label="Select All" onPress={() => setAllFilters(true)}/>
                </View>
                <View style={{ width: 12 }}/>
                <View style={{ flex: 1 }}>
                    <Button type={ButtonTypes.secondary} size={ButtonSizes.small} label="Clear All" onPress={() => setAllFilters(false)}/>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    filterContainer: {
        backgroundColor: colors.White,
        ...shadows.shadowLight,

        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

        paddingVertical: 16,

        zIndex: 10,
    },

    filterRow: {
        paddingHorizontal: 8,
    },

    filterIcon: {
        width: 24,
        height: 24,

        marginHorizontal: 8,
    },

    pill: {
        borderRadius: 24,

        paddingVertical: 4,
        paddingHorizontal: 16,
        
        marginHorizontal: 4,

        backgroundColor: colors.LightGray,
    },

    pillText: {
        ...fontSizes.button_xsmall,
        color: colors.DarkGray,
    },

    pillActive: {
        backgroundColor: colors.Primary,
    },

    pillActiveText: {
        color: colors.White,
    },

    hsep: {
        width: 1,
        marginHorizontal: 8,

        backgroundColor: colors.DarkGray20,
    },

    filterSheet: {
        backgroundColor: colors.White,

        paddingVertical: 16,
        paddingHorizontal: 16,

        paddingBottom: 24,
    },

    filterSheetTitle: {
        ...fontSizes.heading,
        color: colors.Black,

        marginBottom: 16,
    },

    filterSheetSubheading: {
        ...fontSizes.heading_small,
        color: colors.Black,

        marginVertical: 8,
    },

    filterSheetGroup: {
    },

    vsep: {
        width: '100%',
        height: 1,

        backgroundColor: colors.DarkGray20,

        marginVertical: 8,
    },

    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginVertical: 4,
    },

    checkboxLabel: {
        ...fontSizes.heading_small,
        color: colors.DarkGray,
    },

    filterBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',

        marginVertical: 8,
    },
});

export default EarningsFilter;
export { EarningsFilterSheetContent };