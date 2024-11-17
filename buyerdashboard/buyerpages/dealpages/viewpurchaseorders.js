import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes } from '../../../components/atoms/buttons';
import fontSizes from '../../../styles/fonts';
import colors from '../../../styles/colors';
import MenuButton from '../../../components/atoms/menubutton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Aphrodite from '../../../utilities/aphrodite';
import Chronos from '../../../utilities/chronos';
import NoContentFound from '../../../components/nocontentfound';
import useCurrentDeal from '../../../hooks/currentdeal';
import { DealTypes } from './dealdetails';

function NormalisePurchaseOrders(purchaseOrder, type) {
    const normalisedPO = {
        currency: purchaseOrder.paymentCurrency,
        amount: purchaseOrder.finalPoAmount,
        date: purchaseOrder.createdDate,
        sellerDetails: purchaseOrder.sellerDetails,
        poid: purchaseOrder.buyerPoId,
        ponumber: purchaseOrder.ponumber
    }

    normalisedPO.attachments = type === DealTypes.Buyer ? purchaseOrder.poattachmentList : purchaseOrder.attachMentLists;

    return normalisedPO;
}

function NormaliseAttachments(attachments) {
    if (!attachments) return [];

    const normalisedAttachments = [];

    for (const attachment of attachments) {
        const normalisedAttachment = {
            attachmentfileid: attachment.attachmentFileId,
            attachmentid: attachment.buyerPoAttachementId,
            fileName: attachment.attachmentFileName
        }

        normalisedAttachments.push(normalisedAttachment);
    }

    return normalisedAttachments;
}

function PurchaseOrdersCard({ purchaseOrder }) {
    const navigation = useNavigation();
    const chronos = new Chronos();
    
    return (
        <View>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardText}>{chronos.FormattedDateFromTimestamp(purchaseOrder.date)}</Text>
                    <View style={styles.row}>
                        <Text style={styles.cardText}>Purchase Order No</Text>
                        <View style={{ width: 8 }} />
                        <Text style={styles.cardTextBold}>{purchaseOrder.ponumber}</Text>
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>From {purchaseOrder.sellerDetails.sellername}</Text>
                    <Text style={styles.cardBodyText}>{purchaseOrder.sellerDetails.compname}, {purchaseOrder.sellerDetails.city}, {purchaseOrder.sellerDetails.country}.</Text>
                </View>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardTextBold}>Purchase Order Value</Text>
                    <Text style={styles.cardText}>{purchaseOrder.currency} {Aphrodite.FormatNumbers(purchaseOrder.amount)}</Text>
                </View>
            </View>
            {purchaseOrder.attachments.length > 0 && <MenuButton label='View Purchase Order Attachments' onPress={() => navigation.navigate('ViewAttachments', { attachments: NormaliseAttachments(purchaseOrder.attachments), pageTitle: 'View PO Attachments' })} />}
            <View style={styles.vspace} />
        </View>
    )
}

function ViewPurchaseOrdersPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [currentDeal] = useCurrentDeal();

    const ponumber = currentDeal?.purchaseOrdersList[currentDeal?.purchaseOrdersList.length - 1].ponumber;
   
    return (
        <React.Fragment>
            {
                currentDeal.purchaseOrdersList.length > 0 ?
                    <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
                        {currentDeal.purchaseOrdersList.map((purchaseOrder, index) => <PurchaseOrdersCard key={index} purchaseOrder={NormalisePurchaseOrders(purchaseOrder, currentDeal.dealType)} dealType={currentDeal.dealType} />)}
                    </ScrollView> :
                    <NoContentFound title={'No Purchase Orders Found'} message={'Could not find any Purchase Orders for this deal. Buyers can add new Purchase Orders.'} />
            }
            {
                currentDeal.dealType === DealTypes.Selling && !currentDeal.isInactiveDeal &&
                <React.Fragment>
                    <View style={{ paddingBottom: insets.bottom + 64 }} />
                    {/* {currentDeal.purchaseOrdersList.length === 0 &&
                        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                            <Button size={ButtonSizes.medium} label='Add New Purchase Order' onPress={() => navigation.navigate('AddPurchaseOrder', { quotation: quotation })} />
                        </View>
                    } */}
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

export default ViewPurchaseOrdersPage;
export { PurchaseOrdersCard };