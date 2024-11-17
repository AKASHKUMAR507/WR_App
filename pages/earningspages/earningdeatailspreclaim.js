import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import MenuButton from '../../components/atoms/menubutton';
import { PurchaseOrdersCard } from '../dealpages/viewpurchaseorders';
import { DealsCard } from '../bottomnavpages/deals';
import { InvoiceCard } from '../dealpages/viewinvoices';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import { EarningClaimTypes } from './earningslist';
import Aphrodite from '../../utilities/aphrodite';

const NetworkMode = {
    Buying: "BUYING",
    Selling: "SELLING"
}

const getSellerAndBuyer = (earning) => {
    let PoRelease = '';
    let InvoiceRelease = '';

    if (earning?.associaterole === NetworkMode.Selling || earning?.associaterole === NetworkMode.Buying) {
        PoRelease = earning?.buyername;
        InvoiceRelease = earning?.sellername;
    }

    return { PoRelease, InvoiceRelease };
};

const invoiceObject = (earning) => {
    const { InvoiceRelease } = getSellerAndBuyer(earning);

    return {
        createddate: earning.invoicedate,
        paid: (earning.associatepaidflag === 'y' && earning.claim_submitted === 'y' && earning.wrpaidflag === 'y') ? "Paid" : "",
        invoiceamount: earning.invoiceamount,
        invoiceduedate: earning?.invoicedate,
        wrinvoiceAttachments: earning?.wrinvoiceAttachments || 0,
        sellerDetails: {
            sellername: InvoiceRelease,
            buyername: earning?.buyername,
            compname: earning?.compname,
            city: earning?.city,
            country: earning?.country,
        }
    };
};

const purchaseOrderObject = (earning) => {
    const { PoRelease } = getSellerAndBuyer(earning);

    return {
        date: earning?.podate,
        poid: earning?.poid,
        currency: earning?.currency || 'USD',
        amount: earning?.poamount,
        attachments: earning?.attachments || 0,
        sellerDetails: {
            sellername: PoRelease,
            buyername: earning?.buyername,
            compname: earning?.compname,
            city: earning?.city,
            country: earning?.country,
        }
    };
};

const dealObject = (earning) => {
    return {
        dealstatus: earning?.dealstatus,
        roletype: earning?.roletype,
        closingdate: earning?.closingdate,
        createddate: earning?.dealcreateddate,
        dealid: earning?.dealid,
        dealname: earning?.dealname,
        dealType: earning?.associaterole,
        description: earning?.description,
        rfqid: earning?.rfqToSellerId
    };
};

function EarningDetailsPreClaim({ earning, type }) {
    const navigation = useNavigation();
   
    const associatePaid = earning.associatepaidflag === 'y';
    const claimSubmitted = earning.claim_submitted === 'y';
    const worldRefPaid = earning.wrpaidflag === 'y';

    const description = earning?.description || 'Description not found';
    const totalSuccessFee = earning?.associatetotalfees || 0;
    const successFeePaid = (associatePaid) ? earning.associatetotalfees : 0;
    const successFeeNotPaid = (associatePaid && !worldRefPaid) ? earning.associatetotalfees : 0;
    const claimAmount = (!associatePaid && claimSubmitted && worldRefPaid) ? earning.associatetotalfees : 0;

    const invoiceDetails = invoiceObject(earning);
    const purchaseOrderDetails = purchaseOrderObject(earning);
    const dealDetails = dealObject(earning);

    return (
        <View style={styles.card}>
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Deal Details</Text>
                <DealsCard deal={dealDetails} />
                <MenuButton label='View Deal Details' onPress={() => navigation.navigate('DealDetails', { dealid: dealDetails.dealid, role: dealDetails.roletype, rfqid: dealDetails.rfqToSellerId || '' })} />
            </View>
            <View style={styles.vspace} />
            <View style={[styles.cardBody]}>
                <Text style={styles.cardTitle}>Purchase Order Details</Text>
                <PurchaseOrdersCard purchaseOrder={purchaseOrderDetails} />
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Invoice Details</Text>
                <InvoiceCard invoice={invoiceDetails} />
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Sucess Fee Details</Text>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Total Success Fee</Text>
                    <Text style={styles.cardBodyText}>{Aphrodite.FormatNumbers(totalSuccessFee)}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Success Fee Paid</Text>
                    <Text style={styles.cardBodyText}>{Aphrodite.FormatNumbers(successFeePaid)}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Success Fee Not Paid</Text>
                    <Text style={styles.cardBodyText}>{Aphrodite.FormatNumbers(successFeeNotPaid)}</Text>
                </View>
            </View>
            <View style={styles.vspace} />
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Claim Details</Text>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Amount</Text>
                    <Text style={styles.cardBodyText}>USD {Aphrodite.FormatNumbers(claimAmount)}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Claim Status</Text>
                    <Text style={styles.cardBodyText}>{type}</Text>
                </View>
            </View>
            <View style={styles.vspace} />
        </View>
    )
}

function ActionFromClaimType({ earning, type = EarningClaimTypes.EligibleForClaim }) {
    const navigation = useNavigation();

    const associatePaid = earning.associatepaidflag === 'y';
    const claimSubmitted = earning.claim_submitted === 'y';
    const worldRefPaid = earning.wrpaidflag === 'y';

    const claimAmount = (!associatePaid && claimSubmitted && worldRefPaid) ? earning.associatetotalfees : 0;

    switch (type) {
        case EarningClaimTypes.EligibleForClaim:
            return <Button size={ButtonSizes.medium} label={`Claim USD ${Aphrodite.FormatNumbers(claimAmount)}`} onPress={() => navigation.navigate('ClaimRequest', { claimAmount: claimAmount })} />
        case EarningClaimTypes.NotEligibleForClaim:
            return <Button size={ButtonSizes.medium} label={`USD ${Aphrodite.FormatNumbers(claimAmount)} Not Eligible For Claim`} disabled />
        case EarningClaimTypes.ClaimUnderProcess:
            return <Button size={ButtonSizes.medium} label={`USD ${Aphrodite.FormatNumbers(claimAmount)} Under Process - View Details`} onPress={() => navigation.navigate('EarningDetailsPostClaim')} />
        case EarningClaimTypes.SuccessFeeNotPaid:
            return <Button size={ButtonSizes.medium} label={`USD ${Aphrodite.FormatNumbers(claimAmount)} Not Paid - View Details`} onPress={() => navigation.navigate('EarningDetailsPostClaim')} />
        case EarningClaimTypes.SuccessFeePaid:
            return <Button size={ButtonSizes.medium} label={`USD ${Aphrodite.FormatNumbers(claimAmount)} Paid - View Details`} onPress={() => navigation.navigate('EarningDetailsPostClaim')} />
        default:
            return <Button size={ButtonSizes.medium} label={`Claim USD ${Aphrodite.FormatNumbers(claimAmount)}`} disabled />
    }
}

function EarningDetailsPreClaimPage() {
    const insets = useSafeAreaInsets();
    const route = useRoute();
    const { earning, claimType } = route?.params;

    return (
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
                <EarningDetailsPreClaim earning={earning} type={claimType} />
                <View style={{ paddingBottom: insets.bottom + 64 }} />
            </ScrollView>
            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                <ActionFromClaimType earning={earning} type={claimType} />
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    page: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },

    card: {
        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    cardBody: {
        paddingTop: 16,
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,

        paddingHorizontal: 16,
        paddingBottom: 8,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardBodyText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        marginBottom: 4,
    },

    cardTextBold: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },

    section: {
        borderBottomColor: colors.LightGray,
        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
        borderBottomWidth: 1,

        paddingVertical: 12,
        paddingHorizontal: 16,

        backgroundColor: colors.LightGray20,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    sectionGroup: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',

        marginLeft: 16,

        flex: 1
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
});

export default EarningDetailsPreClaimPage;