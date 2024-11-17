import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes } from './../../components/atoms/buttons';
import fontSizes from './../../styles/fonts';
import colors from './../../styles/colors';
import MenuButton from './../../components/atoms/menubutton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DealTypes } from './dealdetails';
import Aphrodite from '../../utilities/aphrodite';
import Chronos from '../../utilities/chronos';
import NoContentFound from '../../components/nocontentfound';
import useCurrentDeal from '../../hooks/currentdeal';
import useUserRoles from '../../stores/userrole';

const invoiceStatusTypes = {
    Paid: 'Paid',
    Unpaid: 'Unpaid',
}

function ColorPropsFromStatus(status) {
    switch(status) {
        case invoiceStatusTypes.Paid:
            return { backgroundColor: colors.Success, borderColor: colors.Success, color: colors.White }
        case invoiceStatusTypes.Unpaid:
            return { backgroundColor: colors.Error, borderColor: colors.Error, color: colors.White }
    }
}

function InvoiceStatusPill({ status = invoiceStatusTypes.Unpaid }) {
    const { backgroundColor, borderColor, color } = ColorPropsFromStatus(status);

    return (
        <View style={[styles.invoiceStatusPill, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
            <Text style={[styles.invoiceStatusPillText, { color: color }]}>{status}</Text>
        </View>
    )
}

function InvoiceCard({ invoice }) {
    const navigation = useNavigation();
    const chronos = new Chronos();

    const status = invoice.paid ? invoiceStatusTypes.Paid : invoiceStatusTypes.Unpaid;

    return (
        <View>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardText}>{chronos.FormattedDateFromTimestamp(invoice.createddate)}</Text>
                    <InvoiceStatusPill status={status}/>
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{invoice.sellerDetails.sellername}</Text>
                    <Text style={styles.cardBodyText}>{Aphrodite.FormatCommaSeparatedString(invoice.sellerDetails.compname, invoice.sellerDetails.city, invoice.sellerDetails.country)}</Text>
                </View>
                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.cardTextBold}>Invoice Value</Text>
                        <Text style={styles.cardText}>{invoice.currency} {Aphrodite.FormatNumbers(invoice.invoiceamount)}</Text>
                    </View>
                    <View>
                        <Text style={styles.cardTextBold}>Invoice Due Date</Text>
                        <Text style={styles.cardText}>{chronos.FormattedDateFromTimestamp(invoice.invoiceduedate)}</Text>
                    </View>
                </View>
            </View>
            {
                invoice?.wrinvoiceAttachments?.length > 0 &&
                <MenuButton label='View Invoice Attachments' onPress={() => navigation.navigate('ViewAttachments', { attachments: invoice.wrinvoiceAttachments, pageTitle: 'View Invoice Attachments' })}/>
            }
            <View style={styles.vspace}/>
        </View>
    )
}

function ViewInvoicesPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const userRole = useUserRoles(state => state.userRole);

    const [currentDeal] = useCurrentDeal();

    return (
        <React.Fragment>
            {
                currentDeal.invoicesList.length > 0 ?
                <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
                    { currentDeal.invoicesList.map((invoice, index) => <InvoiceCard key={index} invoice={invoice} dealType={currentDeal.dealType}/>) }
                </ScrollView> :
                <NoContentFound title={'No Invoices Found'} message={'Could not find any Invoices for this deal. Sellers can add new Invoices.'}/>
            } 
            {
                currentDeal.dealType === DealTypes.Buying && !currentDeal.isInactiveDeal &&
                <React.Fragment>
                    <View style={{ paddingBottom: insets.bottom + 64 }}/>
                    <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                        <Button size={ButtonSizes.medium} label='Add New Invoice' onPress={() =>navigation.navigate('AddInvoices')} />
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

    row: {
        flexDirection: 'row',
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

        marginBottom: 12,
        alignSelf: 'flex-start',
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

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },

    invoiceStatusPill: {
        borderRadius: 24,
        borderWidth: 2,

        paddingVertical: 2,
        paddingHorizontal: 16,
        
        marginHorizontal: 4,
    },

    invoiceStatusPillText: {
        ...fontSizes.button_xsmall,
    },
});

export default ViewInvoicesPage;
export { InvoiceCard }