import React, { createRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter, Dimensions, ScrollView } from 'react-native';
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';
import shadows from '../styles/shadows';
import VectorImage from 'react-native-vector-image';
import { Checkbox } from './form_inputs/checkboxes';
import { Button, ButtonSizes, ButtonTypes } from './atoms/buttons';
import { useDealsFilterStore, useDrawerSheetStore } from '../stores/stores';
import DrawerSheet, { DrawerSheetObject } from './drawersheet';
import Pandora from '../utilities/pandora';

function FilterPill(props) {
    return (
        <TouchableOpacity testID={`${props.text}:filterpill`} activeOpacity={0.8} onPress={() => props.onPress()} style={[styles.pill, props.active && styles.pillActive]}>
            <Text style={[styles.pillText, props.active && styles.pillActiveText]}>{props.text}</Text>
        </TouchableOpacity>
    )
}

function CheckboxRow({ text = 'Checkbox Label', active = false, onPress = () => {} }) {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.checkboxRow} onPress={() => onPress()}>
            <Text style={styles.checkboxLabel}>{text}</Text>
            <Checkbox testID={text} label={''} active={active} onToggle={() => onPress()} feedback={false}/>
        </TouchableOpacity>
    )
}

function DealsFilter() {
    const dealsListParams = useDealsFilterStore(state => state.dealsFilter);
    const setDealsListParams = useDealsFilterStore(state => state.setDealsFilter);

    const addDrawerSheet = useDrawerSheetStore(state => state.addDrawerSheet);
    const toggleDrawerSheet = useDrawerSheetStore(state => state.toggleDrawerSheet);

    useEffect(() => {
        addDrawerSheet(new DrawerSheetObject('deals-filter-sheet', <DealsFilterSheetContent/>));
    }, []);

    const toggleRoleType = (role) => {
        const newDealsListParams = { ...dealsListParams };
        newDealsListParams.roletype[role] = !newDealsListParams.roletype[role];

        if (!newDealsListParams.roletype.ACTIVE && !newDealsListParams.roletype.PASSIVE) {
            newDealsListParams.roletype.ACTIVE = true;
        }

        Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);
        setDealsListParams({ ...newDealsListParams });
    }

    const toggleDealStatus = (status) => {
        const newDealsListParams = { ...dealsListParams };
        newDealsListParams.dealstatus[status] = !newDealsListParams.dealstatus[status];

        Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);
        setDealsListParams({ ...newDealsListParams });
    }

    return (
        <React.Fragment>
            <View style={styles.filterContainer}>
                <TouchableOpacity testID={`dealsfilter:open`} activeOpacity={0.9} onPress={() => toggleDrawerSheet('deals-filter-sheet')}>
                    <VectorImage source={require('../assets/icons/adjustments.svg')} style={styles.filterIcon}/>
                </TouchableOpacity>
                <ScrollView testID={`dealsfilter:scroll`} contentContainerStyle={styles.filterRow} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <FilterPill active={dealsListParams.roletype.ACTIVE} onPress={() => toggleRoleType('ACTIVE')} text="Active"/>
                    <FilterPill active={dealsListParams.roletype.PASSIVE} onPress={() => toggleRoleType('PASSIVE')} text="Passive"/>
                    <View style={styles.hsep}/>
                    <FilterPill active={dealsListParams.dealstatus.SUBMITTED} onPress={() => toggleDealStatus('SUBMITTED')} text="Submitted"/>
                    <FilterPill active={dealsListParams.dealstatus.LIVE} onPress={() => toggleDealStatus('LIVE')} text="Live"/>
                    <FilterPill active={dealsListParams.dealstatus.QUOTED} onPress={() => toggleDealStatus('QUOTED')} text="Quoted"/>
                    <FilterPill active={dealsListParams.dealstatus.PO_RELEASED} onPress={() => toggleDealStatus('PO_RELEASED')} text="PO Released"/>
                    <FilterPill active={dealsListParams.dealstatus.INVOICED} onPress={() => toggleDealStatus('INVOICED')} text="Invoiced"/>
                    <FilterPill active={dealsListParams.dealstatus.PARTIALLY_PAID} onPress={() => toggleDealStatus('PARTIALLY_PAID')} text="Partially Paid"/>
                    <FilterPill active={dealsListParams.dealstatus.FULLY_PAID} onPress={() => toggleDealStatus('FULLY_PAID')} text="Paid"/>
                    <FilterPill active={dealsListParams.dealstatus.DELIVERED} onPress={() => toggleDealStatus('DELIVERED')} text="Delivered"/>
                    <FilterPill active={dealsListParams.dealstatus.REJECTED} onPress={() => toggleDealStatus('REJECTED')} text="Rejected"/>
                    <FilterPill active={dealsListParams.dealstatus.LOST} onPress={() => toggleDealStatus('LOST')} text="Lost"/>
                    <FilterPill active={dealsListParams.dealstatus.SUSPENDED} onPress={() => toggleDealStatus('SUSPENDED')} text="Suspended"/>
                </ScrollView>
            </View>
        </React.Fragment>
    )
}

function DealsFilterSheetContent() {
    const dealsListParams = useDealsFilterStore(state => state.dealsFilter);
    const setDealsListParams = useDealsFilterStore(state => state.setDealsFilter);

    const toggleRoleType = (role) => {
        const newDealsListParams = { ...dealsListParams };
        newDealsListParams.roletype[role] = !newDealsListParams.roletype[role];

        if (!newDealsListParams.roletype.ACTIVE && !newDealsListParams.roletype.PASSIVE) {
            newDealsListParams.roletype.ACTIVE = true;
        }

        Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);
        setDealsListParams({ ...newDealsListParams });
    }

    const toggleDealStatus = (status) => {
        const newDealsListParams = { ...dealsListParams };
        newDealsListParams.dealstatus[status] = !newDealsListParams.dealstatus[status];

        Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);
        setDealsListParams({ ...newDealsListParams });
    }

    const setAllFilters = (value = false) => {
        const newDealsListParams = { ...dealsListParams };

        newDealsListParams.roletype.ACTIVE = true;
        newDealsListParams.roletype.PASSIVE = value;
        
        newDealsListParams.dealstatus.SUBMITTED = value;
        newDealsListParams.dealstatus.LIVE = value;
        newDealsListParams.dealstatus.QUOTED = value;
        newDealsListParams.dealstatus.PO_RELEASED = value;
        newDealsListParams.dealstatus.INVOICED = value;
        newDealsListParams.dealstatus.PARTIALLY_PAID = value;
        newDealsListParams.dealstatus.FULLY_PAID = value;
        newDealsListParams.dealstatus.DELIVERED = value;
        newDealsListParams.dealstatus.REJECTED = value;
        newDealsListParams.dealstatus.LOST = value;
        newDealsListParams.dealstatus.SUSPENDED = value;
        
        Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);
        setDealsListParams({ ...newDealsListParams });
    }

    return (
        <ScrollView contentContainerStyle={styles.filterSheet}>
            <Text style={styles.filterSheetTitle}>Filter Deals</Text>
            <View style={styles.filterSheetGroup}> 
                <Text style={styles.filterSheetSubheading}>Associate Role Types</Text>
                <CheckboxRow active={dealsListParams.roletype.ACTIVE} onPress={() => toggleRoleType('ACTIVE')} text="Active"/>
                <CheckboxRow active={dealsListParams.roletype.PASSIVE} onPress={() => toggleRoleType('PASSIVE')} text="Passive"/>
            </View>
            <View style={styles.vsep}/>
            <View style={styles.filterSheetGroup}>
                <Text style={styles.filterSheetSubheading}>Deal Status Types</Text>
                <CheckboxRow active={dealsListParams.dealstatus.SUBMITTED} onPress={() => toggleDealStatus('SUBMITTED')} text="Submitted"/>
                <CheckboxRow active={dealsListParams.dealstatus.LIVE} onPress={() => toggleDealStatus('LIVE')} text="Live"/>
                <CheckboxRow active={dealsListParams.dealstatus.QUOTED} onPress={() => toggleDealStatus('QUOTED')} text="Quoted"/>
                <CheckboxRow active={dealsListParams.dealstatus.PO_RELEASED} onPress={() => toggleDealStatus('PO_RELEASED')} text="PO Released"/>
                <CheckboxRow active={dealsListParams.dealstatus.INVOICED} onPress={() => toggleDealStatus('INVOICED')} text="Invoiced"/>
                <CheckboxRow active={dealsListParams.dealstatus.PARTIALLY_PAID} onPress={() => toggleDealStatus('PARTIALLY_PAID')} text="Partially Paid"/>
                <CheckboxRow active={dealsListParams.dealstatus.FULLY_PAID} onPress={() => toggleDealStatus('FULLY_PAID')} text="Paid"/>
                <CheckboxRow active={dealsListParams.dealstatus.DELIVERED} onPress={() => toggleDealStatus('DELIVERED')} text="Delivered"/>
                <CheckboxRow active={dealsListParams.dealstatus.REJECTED} onPress={() => toggleDealStatus('REJECTED')} text="Rejected"/>
                <CheckboxRow active={dealsListParams.dealstatus.LOST} onPress={() => toggleDealStatus('LOST')} text="Lost"/>
                <CheckboxRow active={dealsListParams.dealstatus.SUSPENDED} onPress={() => toggleDealStatus('SUSPENDED')} text="Suspended"/>
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

export default DealsFilter;
export { DealsFilterSheetContent, FilterPill, CheckboxRow };