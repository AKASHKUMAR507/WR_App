import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';

const statusTypes = {
    Active: 'Active',
    Passive: 'Passive',
    Submitted: 'Submitted',
    Live: 'Live',
    Quoted: 'Quoted',
    PO_Released: 'PO Released',
    Invoiced: 'Invoiced',
    Partially_Paid: 'Partially Paid',
    Fully_Paid: 'Paid',
    Won: 'Won',
    Delivered: 'Delivered',
    Rejected: 'Rejected',
    Lost: 'Lost',
    Suspended: 'Suspended',
    Open: 'Open',
    Closed: 'Closed',
    Order_Placed: 'Order Placed',
    Order_Confirmed: 'Order Confirmed',
    Draft: 'Draft',
    Cancelled: 'Cancelled',
    InProgress: 'In Progress'
}

function StatusTypeFromStatus(status) {
    switch(status) {
        case 'A':
            return statusTypes.Active;
        case 'P':
            return statusTypes.Passive;
        case 'SUBMITTED': 
            return statusTypes.Submitted;
        case 'LIVE':
            return statusTypes.Live;
        case 'QUOTED':
            return statusTypes.Quoted;
        case 'PO_RELEASED':
            return statusTypes.PO_Released;
        case 'INVOICED':
            return statusTypes.Invoiced;
        case 'PARTIALLY_PAID':
            return statusTypes.Partially_Paid;
        case 'FULLY_PAID':
            return statusTypes.Fully_Paid;
        case "WON": 
            return statusTypes.Won;
        case 'DELIVERED':
            return statusTypes.Delivered;
        case 'REJECTED':
            return statusTypes.Rejected;
        case 'LOST':
            return statusTypes.Lost;
        case 'SUSPENDED':
            return statusTypes.Suspended;
        case 'OPEN':
            return statusTypes.Open;
        case 'CLOSED':
            return statusTypes.Closed;
        case 'ORDER_PLACED':
            return statusTypes.Order_Placed;
        case 'ORDER_CONFIRMED':
            return statusTypes.Order_Confirmed;
        case 'DRAFT':
            return statusTypes.Draft;
        case 'CANCELLED':
            return statusTypes.Cancelled;
        case 'INPROGRESS':
            return statusTypes.InProgress;
    }
}

function ColorPropsFromStatus(status) {
    switch(status) {
        case statusTypes.Active:
            return { backgroundColor: colors.White, borderColor: colors.Primary, color: colors.Primary }
        case statusTypes.Passive:
            return { backgroundColor: colors.White, borderColor: colors.Error, color: colors.Error }
        case statusTypes.Submitted:
            return { backgroundColor: colors.Primary, borderColor: colors.Primary, color: colors.White }
        case statusTypes.Live:
            return { backgroundColor: colors.Success, borderColor: colors.Success, color: colors.White }
        case statusTypes.Quoted:
            return { backgroundColor: colors.Warning, borderColor: colors.Warning, color: colors.White }
        case statusTypes.PO_Released:
            return { backgroundColor: colors.Success, borderColor: colors.Success, color: colors.White }
        case statusTypes.Invoiced:
            return { backgroundColor: colors.Success, borderColor: colors.Success, color: colors.White }
        case statusTypes.Partially_Paid:
            return { backgroundColor: colors.Warning, borderColor: colors.Warning, color: colors.White }
        case statusTypes.Fully_Paid:
            return { backgroundColor: colors.Success, borderColor: colors.Success, color: colors.White }
        case statusTypes.Won:
            return { backgroundColor: colors.Primary, borderColor: colors.Primary, color: colors.White }
        case statusTypes.Delivered:
            return { backgroundColor: colors.SecondaryPrimary, borderColor: colors.SecondaryPrimary, color: colors.White }
        case statusTypes.Rejected:
            return { backgroundColor: colors.DarkGray, borderColor: colors.DarkGray, color: colors.White }
        case statusTypes.Lost:
            return { backgroundColor: colors.Error, borderColor: colors.Error, color: colors.White }
        case statusTypes.Suspended:
            return { backgroundColor: colors.Warning, borderColor: colors.Warning, color: colors.White }
        case statusTypes.Open:
            return { backgroundColor: colors.Success, borderColor: colors.Success, color: colors.White }
        case statusTypes.Closed:
            return { backgroundColor: colors.Error, borderColor: colors.Error, color: colors.White }
        case statusTypes.Order_Placed:
            return { backgroundColor: colors.Error, borderColor: colors.Error, color: colors.White }
        case statusTypes.Order_Confirmed:
            return { backgroundColor: colors.Error, borderColor: colors.Error, color: colors.White }
        case statusTypes.Draft:
            return { backgroundColor: colors.Error, borderColor: colors.Error, color: colors.White }
        case statusTypes.Cancelled:
            return { backgroundColor: colors.Error, borderColor: colors.Error, color: colors.White }
        case statusTypes.InProgress:
            return { backgroundColor: colors.Success, borderColor: colors.Success, color: colors.White }
        default:
            return { backgroundColor: colors.Error, borderColor: colors.Error, color: colors.White }
    }
}

function DealStatusPill({ status = statusTypes.Active }) {
    const { backgroundColor, borderColor, color } = ColorPropsFromStatus(status);

    return (
        <View style={[styles.dealStatusPill, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
            <Text style={[styles.dealStatusPillText, { color: color }]}>{status}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    dealStatusPill: {
        borderRadius: 24,
        borderWidth: 2,

        paddingVertical: 2,
        paddingHorizontal: 16,
        
        marginHorizontal: 4,
    },

    dealStatusPillText: {
        ...fontSizes.button_xsmall,
    },
});

export default DealStatusPill;
export { statusTypes, StatusTypeFromStatus };