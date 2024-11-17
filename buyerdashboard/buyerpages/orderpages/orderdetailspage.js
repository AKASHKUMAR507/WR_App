import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import colors from '../../../styles/colors';
import Chronos from '../../../utilities/chronos';
import MenuButton from '../../../components/atoms/menubutton';
import DealStatusPill, { StatusTypeFromStatus } from '../../../components/dealstatuspill';
import InfoBanner, { InfoBannerForOrder } from '../../info';
import fontSizes from '../../../styles/fonts';
import ExpandableText from '../../../components/expandabletext';

const PurchaseOrderCard = ({ poItem }) => {
    const chronos = new Chronos();
    const poStatus = StatusTypeFromStatus(poItem?.dealStatus);
    
    return (
        <React.Fragment>
            <View style={styles.card}>
                <View style={[styles.cardRow, { alignItems: 'flex-start' }]}>
                    <View style={{ width: Dimensions.get('screen').width * 0.6 }}>
                        <ExpandableText text={poItem.dealdescription} numberOfLines={2} textStyles={styles.cardTextBold} />
                    </View>
                    <DealStatusPill status={poStatus} />
                </View>

                <View style={styles.cardItem}>
                    <View style={[styles.cardRow]}>
                        <Text style={styles.cardTitleBold}>PO No</Text>
                        <Text style={styles.cardTitleBold}>{poItem?.poNumber}</Text>
                    </View>

                    <View style={styles.cardRow}>
                        <Text style={styles.cardTitleBold}>PO Date</Text>
                        <Text style={styles.cardTitleBold}>{chronos.FormattedNumericDateFromTimestamp(poItem?.poDate)}</Text>
                    </View>

                    <View style={styles.cardRow}>
                        <Text style={styles.cardTitleBold}>Deal ID</Text>
                        <Text style={styles.cardTitleBold}>{poItem.dealid}</Text>
                    </View>
                </View>
                {poItem?.orderHeldUp && <InfoBanner info={'Order Held Up'} message={poItem?.orderHeldUpReason} />}
                {poItem?.finalPayment && <InfoBanner message={poItem?.finalPayment} />}
            </View>
            <View style={styles.vspace} />
        </React.Fragment>
    )
}

const OrderDetailsPage = (props) => {
    const navigation = useNavigation();
    const { po } = props.route.params;

    const contact = {
        name: po?.dealmanager?.name,
        email: po?.dealmanager?.email,
        phone: po?.dealmanager?.mobilenumber,
    }

    const handleNavigation = (route, params) => { navigation.navigate(route, params ? { ...params } : undefined); }

    return (
        <View style={styles.container}>
            <PurchaseOrderCard poItem={po} />
            {/* <MenuButton label='View Purchase Order Item' disabled  onPress={() => handleNavigation('ViewBuyerQuoteLineItem')} /> */}
            <MenuButton label='View Order Tracking' disabled={!po?.orderStatusList} onPress={() => handleNavigation('ViewPOTracking', { orderid: po?.orderid, po: po })} />
            <MenuButton label='Contact Deal Manager' disabled={!po?.dealmanager} onPress={() => handleNavigation('DealManagerPage', { contact: contact })} />
            <MenuButton label='Escalate Issue' onPress={() => handleNavigation('EscalateIssuePage', {orderid: po.orderid, dealid: po.dealid})} />
        </View>
    )
}

export default OrderDetailsPage
export { PurchaseOrderCard }
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 24,
    },

    cardRow: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        flexWrap: 'wrap'
    },

    cardRowGap: {
        columnGap: 12
    },

    cardItem: {
        paddingTop: 16,
        paddingBottom: 8
    },
    cardTitle: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardTextBold: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardTitleBold: {
        ...fontSizes.heading_small,
        color: colors.DarkGray,
    },

    cardBodyText: {
        ...fontSizes.body_small,
        color: colors.DarkGray,

        marginTop: 12,
    },

    menuBottom: {
        paddingHorizontal: 16,
        paddingVertical: 10,

        borderTopWidth: 0.5,
        borderTopColor: colors.DarkGray,
    },

    menuButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    cvLine: {
        resizeMode: 'contain',

        marginLeft: 4,
        marginRight: 4,
    },

    vspace: {
        height: 16,
        backgroundColor: colors.LightGray,
    },
})