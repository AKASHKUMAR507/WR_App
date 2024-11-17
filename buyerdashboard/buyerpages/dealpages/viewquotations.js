import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes } from '../../../components/atoms/buttons';
import fontSizes from '../../../styles/fonts';
import colors from '../../../styles/colors';
import MenuButton from '../../../components/atoms/menubutton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chronos from '../../../utilities/chronos';

import Aphrodite from '../../../utilities/aphrodite';
import NoContentFound from '../../../components/nocontentfound';
import useCurrentDeal from '../../../hooks/currentdeal';
import { DealTypes } from '../../../pages/dealpages/dealdetails';

function QuotationsCard({ quotation, dealType, dealStatus }) {
    const navigation = useNavigation();
    const chronos = new Chronos();

    const currency = quotation.outputcurrency || quotation.inputcurrency || quotation.currency;
    
    return (
        <View>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardText}>{chronos.FormattedDateFromTimestamp(quotation.createddate)}</Text>
                    <View style={styles.row}>
                        <Text style={styles.cardText}>Quotation</Text>
                        <View style={{ width: 8 }} />
                        <Text style={styles.cardTextBold}>{quotation.quotetobuyerid || quotation.sellerofferreferencenumber}</Text>
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>From {quotation.sellerDetails.sellername}</Text>
                    <Text style={styles.cardBodyText}>{Aphrodite.FormatCommaSeparatedString(quotation.sellerDetails.compname, quotation.sellerDetails.city, quotation.sellerDetails.country)}</Text>
                </View>
                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.cardTextBold}>Quotation Value</Text>
                        <Text style={styles.cardText}>{currency} {Aphrodite.FormatNumbers(quotation.offervalue || quotation.finalestimatedoffervalue)}</Text>
                    </View>
                    <View>
                        <Text style={styles.cardTextBold}>Valid Till</Text>
                        <Text style={styles.cardText}>{chronos.FormattedDateFromTimestamp(quotation.offervalidity)}</Text>
                    </View>
                </View>
            </View>
            <MenuButton label='View Quotation Details' onPress={() => navigation.navigate('ViewQuotationDetails', { quotation: quotation, type: dealType })} />
            {/* <MenuButton label='View Quotation Line Items' onPress={() => navigation.navigate('ViewLineItems', { lineitems: quotation.lineitems, createddate: quotation.createddate })} /> */}
            <MenuButton label='View Quotation Line Items' onPress={() => navigation.navigate('ViewBuyerQuoteLineItem')} />
            <MenuButton label='View Estimated Items' onPress={() => navigation.navigate('ViewEstimatedItems', { estimatedItem: quotation.estimateditems, currency: quotation.outputcurrency, type: dealType })} />
            <MenuButton label='View Overall Take Rate' onPress={() => navigation.navigate('ViewTakeRatePage')} />
            {
                quotation.quoteAttachments && quotation.quoteAttachments.length > 0 &&
                <MenuButton label='View Quotation Attachments' onPress={() => navigation.navigate('ViewAttachments', { attachments: quotation.quoteAttachments, pageTitle: 'View Quotation Attachments' })} />
            }
            <View style={styles.vspace} /> 
            {/* <MenuButton disabled={dealStatus === "QUOTED" ? false : true} label='Create Purchase Order' onPress={() => navigation.navigate('AddPurchaseOrder', { quotation: quotation })} /> */}
            <View style={styles.vspace} />
        </View>
    )
}

function ViewQuotationsPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [currentDeal] = useCurrentDeal();

    return (
        <React.Fragment>
            {
                currentDeal.quotationList.length > 0 ?
                    <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
                        {currentDeal.quotationList.map((quotation, index) => <QuotationsCard key={index} quotation={quotation} dealType={currentDeal.dealType} dealStatus={currentDeal.status} />)}
                    </ScrollView> :
                    <NoContentFound title={'No Quotations Found'} message={'No Quotations available for this deal. Sellers can add new Quotations.'} />
            }
            {
                currentDeal.dealType === DealTypes.Buying && !currentDeal.isInactiveDeal &&
                <React.Fragment>
                    <View style={{ paddingBottom: insets.bottom + 64 }} />
                    <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                        <Button size={ButtonSizes.medium} label='Add New Quotation' onPress={() => navigation.navigate('AddQuotation')} />
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
});

export default ViewQuotationsPage;