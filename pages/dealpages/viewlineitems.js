import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import MenuButton from '../../components/atoms/menubutton';
import Chronos from '../../utilities/chronos';
import CountryFlag from '../../components/atoms/countryflag';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExpandableText from '../../components/expandabletext';

function LineItemsCard({ lineitem }) {
    const navigation = useNavigation();
    const chronos = new Chronos();
    
    return (
        <React.Fragment>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardText}>Deliver By</Text>
                        <Text style={styles.cardTextBold}>{chronos.FormattedDateFromTimestamp(lineitem.deliveryby)}</Text>
                    </View>
                    <View style={styles.edits}>
                        <Text style={styles.cardText}>{lineitem.lineitem_type}</Text>
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>({lineitem.hsn_code}) {lineitem.item_name}</Text>
                    <ExpandableText textStyles={styles.cardBodyText} text={lineitem.item_desc} />
                </View>
                {(lineitem.outputunitrate && lineitem.outputtotal) &&
                    <View style={[styles.cardFooter, { marginBottom: 8 }]}>
                        <View>
                            <Text style={styles.cardText}>Unit Rate</Text>
                            <Text style={styles.cardTextBold}>{lineitem.outputunitrate}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardText}>Total Unit Rate</Text>
                            <Text style={styles.cardTextBold}>{lineitem.outputtotal}</Text>
                        </View>
                    </View>
                }
                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.cardText}>Quantity</Text>
                        <Text style={styles.cardTextBold}>{lineitem.quantity} {lineitem.uom}</Text>
                    </View>
                    <View>
                        <Text style={styles.cardTextBold}>Country of Origin</Text>
                        <CountryFlag country={lineitem.coo} />
                    </View>
                </View>
            </View>
            {
                lineitem?.lineItemAttachmentsqoutetobuyer?.length > 0 &&
                <MenuButton label='View Line Item Attachments' onPress={() => navigation.navigate('ViewAttachments', { attachments: lineitem?.lineItemAttachmentsqoutetobuyer, pageTitle: 'View Line Item Attachments' })} />
            }
            <View style={styles.vspace} />
        </React.Fragment>
    )
}

function ViewLineItemsPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const lineitems = props.route.params.lineitems;

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
            {lineitems.map((lineitem, index) => <LineItemsCard key={index} lineitem={lineitem} />)}
        </ScrollView>
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

    cardBodyText: {
        ...fontSizes.body_small,
        color: colors.DarkGray,

        marginTop: 12,
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

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },
});

export default ViewLineItemsPage;
