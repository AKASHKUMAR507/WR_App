import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import MenuButton from '../../components/atoms/menubutton';
import Chronos from '../../utilities/chronos';
import Aphrodite from '../../utilities/aphrodite';
import NoContentFound from '../../components/nocontentfound';

const EstimatedItem = ({ estimatedItem, currency }) => {
    return (
        <View>
            <View style={styles.estimatedCard}>
                <View>
                    <Text style={styles.estimatedCardTitle}>{estimatedItem.category}</Text>
                    <Text style={styles.estimatedCardText}>{estimatedItem.description}</Text>
                </View>

                <View style={{ gap: 4 }}>
                    <View style={styles.estimatedCardTextBody}>
                        <Text style={styles.estimatedCardBodyText}>Percentage (%)</Text>
                        <Text style={styles.estimatedCardBodyText}>Total</Text>
                    </View>
                    <View style={styles.estimatedCardTextBody}>
                        <Text style={styles.estimatedValueText}>{estimatedItem.percentage}</Text>
                        <Text style={styles.estimatedValueText}>{currency} {Aphrodite.FormatNumbers(estimatedItem.total)}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const EstimatedCard = (props) => {
    const estimatedItem = props.route.params.estimatedItem;
    const currency = props.route.params.currency

    return (
        <React.Fragment>
            {
                estimatedItem.length > 0 ?
                    <ScrollView>
                        {estimatedItem.map((item) => <EstimatedItem estimatedItem={item} key={item.itemid} currency={currency} />)}
                        <View style={styles.vspace} />
                    </ScrollView> :
                    <NoContentFound title={'No Quotations Found'} message={'No Quotations available for this deal. Sellers can add new Quotations.'} />
            }

        </React.Fragment>
    )
}

function QuotationDetails({ quotation }) {
    const navigation = useNavigation();
    const chronos = new Chronos();

    const currency = quotation.outputcurrency || quotation.inputcurrency || quotation.currency;
    const paymentterms = quotation.paymentTerms || quotation.paymentterms;

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
                <View style={styles.vspace} />
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>Seller Details</Text>
                    <View style={styles.section}>
                        <Text style={styles.cardTextBold}>Seller</Text>
                        <View style={styles.sectionGroup}>
                            <Text style={styles.cardBodyText}>{quotation.sellerDetails.sellername}</Text>
                            {quotation.sellerDetails.department && <Text style={styles.cardBodyText}>{quotation.sellerDetails.department}</Text>}
                            {quotation.sellerDetails.designation && <Text style={styles.cardBodyText}>{quotation.sellerDetails.designation}</Text>}
                            <Text style={styles.cardBodyText}>{quotation.sellerDetails.compname}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cardTextBold}>Seller Address</Text>
                        <View style={styles.sectionGroup}>
                            {
                                quotation.sellerDetails.addressline1 && <Text style={styles.cardBodyText}>{quotation.sellerDetails.addressline1}</Text>
                            }
                            {
                                quotation.sellerDetails.addressline2 && <Text style={styles.cardBodyText}>{quotation.sellerDetails.addressline2}</Text>
                            }
                            <Text style={styles.cardBodyText}>{Aphrodite.FormatCommaSeparatedString(quotation.sellerDetails.city, quotation.sellerDetails.state, quotation.sellerDetails.country, quotation.sellerDetails.pincode)}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cardTextBold}>Seller Contact</Text>
                        <View style={styles.sectionGroup}>
                            <Text style={styles.cardBodyText}>{quotation.sellerDetails.countrycode} {quotation.sellerDetails.phoneno}</Text>
                            <Text style={styles.cardBodyText}>{quotation.sellerDetails.mailid}</Text>
                        </View>
                    </View>
                    {
                        quotation.sellerDetails.companywebsite &&
                        <View style={styles.section}>
                            <Text style={styles.cardTextBold}>Company Website</Text>
                            <View style={styles.sectionGroup}>
                                <Text style={styles.cardBodyText}>{quotation.sellerDetails.companywebsite}</Text>
                            </View>
                        </View>
                    }
                </View>
                <View style={styles.vspace} />
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>Quotation Details</Text>
                    <View style={styles.section}>
                        <Text style={styles.cardTextBold}>Offer Value</Text>
                        <Text style={styles.cardBodyText}>{currency} {Aphrodite.FormatNumbers(quotation.offervalue || quotation.finalestimatedoffervalue)}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cardTextBold}>Offer Validity</Text>
                        <Text style={styles.cardBodyText}>{chronos.FormattedDateFromTimestamp(quotation.offervalidity)}</Text>
                    </View>
                    {
                        quotation.shipmentmode &&
                        <View style={styles.section}>
                            <Text style={styles.cardTextBold}>Shipment Mode</Text>
                            <View style={styles.sectionGroup}>
                                <Text style={styles.cardBodyText}>{quotation.shipmentmode}</Text>
                            </View>
                        </View>
                    }
                    <View style={styles.section}>
                        <Text style={styles.cardTextBold}>Delivery Terms</Text>
                        <View style={styles.sectionGroup}>
                            <Text style={styles.cardBodyText}>{quotation.deliveryterms}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cardTextBold}>Delivery Place</Text>
                        <View style={styles.sectionGroup}>
                            <Text style={styles.cardBodyText}>{quotation.destinationcity}, {quotation.destinationcountry}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cardTextBold}>Warranty</Text>
                        <View style={styles.sectionGroup}>
                            <Text style={styles.cardBodyText}>{quotation.warrantydesc || 'Not Available'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.vspace} />
                {
                    paymentterms &&
                    <React.Fragment>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Payment Details</Text>
                            {
                                paymentterms.map((paymentTerm, index) => (
                                    <View key={index} style={styles.section}>
                                        <Text style={styles.cardTextBold}>{paymentTerm.percent} %</Text>
                                        <View style={styles.sectionGroup}>
                                            <Text style={styles.cardBodyText}>{paymentTerm.description}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                        <View style={styles.vspace} />
                    </React.Fragment>
                }
            </View>

            <MenuButton disabled={quotation?.estimateditems?.length > 0 ? false : true} label='Estimated Items' onPress={() => navigation.navigate('EstimatedCard', { estimatedItem: quotation?.estimateditems, currency: quotation.outputcurrency })} />

            {
                quotation.sellerDetails.sellerAttachments.length > 0 &&
                <MenuButton label='View Line Items' onPress={() => navigation.navigate('ViewLineItems', { lineitems: quotation.lineitems })} />
            }
            {
                quotation.quoteAttachments && quotation.quoteAttachments.length > 0 &&
                <MenuButton label='View Quotation Attachments' onPress={() => navigation.navigate('ViewAttachments', { attachments: quotation.quoteAttachments, pageTitle: 'View Quotation Attachments' })} />
            }
            <View style={styles.vspace} />
        </View>
    )
}

function ViewQuotationDetailsPage(props) {
    const insets = useSafeAreaInsets();

    const quotation = props.route?.params?.quotation;

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
            <QuotationDetails quotation={quotation} />
        </ScrollView>
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

        textTransform: 'capitalize',
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

    estimatedCard: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 24,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,

        gap: 12
    },

    estimatedCardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    estimatedCardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    estimatedCardTextBody: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    estimatedCardBodyText: {
        ...fontSizes.heading_xsmall,
        color: colors.Black80,
    },

    estimatedValueText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },
    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },
});

export default ViewQuotationDetailsPage;
export { EstimatedCard }
