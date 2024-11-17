import React, { } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMroHubDealsFilterStore } from '../stores/stores';
import Pandora from '../utilities/pandora';
import shadows from '../styles/shadows';
import colors from '../styles/colors';
import fontSizes from '../styles/fonts';
import Aphrodite from '../utilities/aphrodite';

function FilterPill(props) {

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress()} style={[styles.pill, props.active && { backgroundColor: props.color }]}>
            <View style={styles.pillItems}>
                <Text style={[styles.pillText, props.active && styles.pillActiveText]}>{props.text}</Text>
                {
                    props.num > 0 &&
                    <View style={[styles.badgePills, props.active && styles.badgeActive]}>
                        <Text style={[styles.badgeText, props.active && styles.badgeTextActive]}>{Aphrodite.FormatToTwoDigitsPlusSign(props.num)}</Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
    )
}

function DealsFilter(props) {
    const dealsListParams = useMroHubDealsFilterStore(state => state.dealsFilter);
    const setDealsListParams = useMroHubDealsFilterStore(state => state.setDealsFilter);

    const toggleDealStatus = (status) => {
        const newDealsListParams = { ...dealsListParams };
        for (let key in newDealsListParams.dealstatus) {
            newDealsListParams.dealstatus[key] = (key === status);
        }

        Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);
        setDealsListParams({ ...newDealsListParams });
    }

    const pillsColor = (statusObject) => {
        const trueKeyStatus = Object.keys(statusObject).find(key => statusObject[key]);

        switch (trueKeyStatus) {
            case 'ALL':
                return colors.Primary;
            case 'INPROGRESS':
                return colors.Success;
            case 'DELIVERED':
                return colors.SecondaryPrimary;
            default:
                return colors.Primary;
        }
    }

    return (
        <React.Fragment>
            <View style={styles.filterContainer}>
                <FilterPill num={props.num} active={dealsListParams.dealstatus.ALL} color={pillsColor(dealsListParams.dealstatus)} onPress={() => toggleDealStatus('ALL')} text="All" />
                <FilterPill num={props.ip} active={dealsListParams.dealstatus.INPROGRESS} color={pillsColor(dealsListParams.dealstatus)} onPress={() => toggleDealStatus('INPROGRESS')} text="In-Progress" />
                <FilterPill num={props.del} active={dealsListParams.dealstatus.DELIVERED} color={pillsColor(dealsListParams.dealstatus)} onPress={() => toggleDealStatus('DELIVERED')} text="Delivered" />
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    filterContainer: {
        backgroundColor: colors.White,
        // ...shadows.shadowLight,
        borderBottomWidth: 2,
        borderBottomColor: colors.Gray,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',

        paddingHorizontal: 16,
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
        paddingHorizontal: 24,
        paddingVertical: 8,

        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,

        flex: 1,
    },

    pillText: {
        ...fontSizes.button_xsmall,
        color: colors.DarkGray,
        textAlign: 'center'
    },

    pillActive: {
        backgroundColor: colors.Primary,
    },

    badgeActive: {
        backgroundColor: colors.White,
    },

    badgeTextActive: {
        color: colors.Primary
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

    pillItems: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        columnGap: 4,
    },

    badgePills: {
        paddingHorizontal: 6,
        paddingVertical: 2,

        borderRadius: 12,

        backgroundColor: colors.Primary,

        alignItems: 'center',
        justifyContent: 'center',
    },

    badgeText: {
        ...fontSizes.button_small,
        color: colors.White,
        textAlign: 'center'
    }
});

export default DealsFilter;
export { FilterPill };