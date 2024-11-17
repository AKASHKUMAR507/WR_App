import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, LayoutAnimation, FlatList, RefreshControl, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import fontSizes from '../../../styles/fonts';
import colors from '../../../styles/colors';
import SkeletonContainer from '../../../components/skeletons';
import NoContentFound from '../../../components/nocontentfound';
import useRefreshScreens from '../../../hooks/refreshscreens';
import { Alert, AlertBoxContext } from '../../../components/alertbox';
import MenuButton from '../../../components/atoms/menubutton';
import { ListPurchaseOrders } from '../../../network/models/purchaseorders';
import Chronos from '../../../utilities/chronos';
import { FlashList } from '@shopify/flash-list';
import ExpandableText from '../../../components/expandabletext';

function Tag({ label }) {
    return (
        <View style={styles.tag}>
            <Text style={styles.tagText}>{label}</Text>
        </View>
    )
}

const POSkeletonData = { poNumber: '', orderid: '', poDate: new Date(), modifieddate: new Date(), dealname: '', dealid: '', dealdescription: '', buyername: '', orderStatusList: [{}] };

function POCard({ po }) {
    const chronos = new Chronos();
    const navigation = useNavigation();

    return (
        <React.Fragment>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Tag label={`PO ${po.poNumber}`} />
                    <View style={[styles.row, {flex: 1}]}>
                        <Text style={styles.cardText}>Buyer</Text>
                        <View style={{ width: 8 }} />
                        <Text style={styles.cardTextBold}>{po.buyername}</Text>
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <Text numberOfLines={1} style={styles.cardTitle}>({po.dealid}) {po.dealname}</Text>
                    {/* <ExpandableText text={po.dealdescription} /> */}
                    <Text style={styles.cardText} numberOfLines={2}>{po.dealdescription}</Text>
                </View>
                <View style={[styles.cardFooter, styles.cardRowWrap]}>
                    <View style={styles.row}>
                        <Text style={styles.cardText}>PO Issued on</Text>
                        <View style={{ width: 8 }} />
                        <Text style={styles.cardTextBold}>{chronos.FormattedDateFromTimestamp(po.createddate)}</Text>
                    </View>
                    {
                        po.modifieddate &&
                        <View style={styles.row}>
                            <Text style={styles.cardText}>Last Updated at</Text>
                            <View style={{ width: 8 }} />
                            <Text style={styles.cardTextBold}>{chronos.FormattedDateTimeFromTimestamp(po.modifieddate)}</Text>
                        </View>
                    }
                </View>
            </View>
            {
                po.orderStatusList && po.orderStatusList.length > 0 &&
                <MenuButton label='View Tracking History' onPress={() => navigation.navigate('ViewPOTracking', { orderid: po.orderid, po: po })} />
            }
            <View style={styles.vspace} />
        </React.Fragment>
    )
}

function POListContainer({ poList }) {

    return (
        poList ?
            (
                poList.length > 0 ?
                    <FlashList data={poList} renderItem={({ item }) => <POCard po={item} />} keyExtractor={item => item.orderid.toString()} estimatedItemSize={200} showsVerticalScrollIndicator={false} /> :
                    <NoContentFound title={'No Purchase Orders found'} message={'Could not find any active purchase orders aganinst your account.'} />
            ) :
            <SkeletonContainer child={<POCard po={POSkeletonData} />} />
    )
}

function BrowsePage(props) {
    const [purchaseOrders, setPurchaseOrders] = useState();
    const createAlert = useContext(AlertBoxContext);
    const refreshScreens = useRefreshScreens();

    useEffect(() => {
        fetchPurchaseOrdersList();
    }, [refreshScreens.shouldRefresh]);

    const fetchPurchaseOrdersList = async () => {
        try {
            setPurchaseOrders();
            const purchaseOrdersList = await ListPurchaseOrders();
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const sortedPurchaseOrders = Chronos.SortObjectsByDate(purchaseOrdersList)
            setPurchaseOrders(sortedPurchaseOrders);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <POListContainer poList={purchaseOrders} />
    )
}

const styles = StyleSheet.create({
    page: {
    },

    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,

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
        marginTop: 16,
    },

    cardFooter: {
        marginTop: 16,
        marginBottom: 8,

        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    cardBodyText: {
        ...fontSizes.body_small,
        color: colors.DarkGray,

        marginTop: 12,
    },

    row: {
        // flexDirection: 'row',
        alignItems: 'flex-start',
    },

    cardRowWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    tag: {
        backgroundColor: colors.Primary,
        borderRadius: 16,

        paddingHorizontal: 16,
        paddingVertical: 4,

        marginRight: 8,
        marginBottom: 8,
    },

    tagText: {
        ...fontSizes.button_small,
        color: colors.White,
    },

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },
});

export default BrowsePage;