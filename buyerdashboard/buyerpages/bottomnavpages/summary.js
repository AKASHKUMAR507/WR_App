import React, { useState, useContext, useEffect, useRef, useCallback, } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, LayoutAnimation } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from '../../../components/atoms/buttons';
import fontSizes from '../../../styles/fonts';
import colors from '../../../styles/colors';
import { useMroHubDealsFilterStore, useUserStore } from '../../../stores/stores';
import messaging from '@react-native-firebase/messaging';
import { FlashList } from '@shopify/flash-list';
import DealsFilter from '../../dealsfilter';
import Search from '../../search';
import DealStatusPill, { StatusTypeFromStatus, statusTypes } from '../../../components/dealstatuspill';
import ExpandableText from '../../../components/expandabletext';
import Chronos from '../../../utilities/chronos';
import VectorImage from 'react-native-vector-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProgressBar from '../../progressbar';
import InfoBanner from '../../info';
import FloatingButton from '../../flotingbutton';
import SkeletonContainer from '../../../components/skeletons';
import NoContentFound from '../../../components/nocontentfound';
import { ListPurchaseOrders } from '../../../network/models/purchaseorders';
import useRefreshScreens from '../../../hooks/refreshscreens';
import { Alert, AlertBoxContext } from '../../../components/alertbox';
import Pandora from '../../../utilities/pandora';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import useLatestStatus from '../../../utilities/ordercurrentstatus';
import { usePushNotificationsDataStore } from '../../../stores/datastores';

{/* <VectorImage style={styles.cvLine} source={require('../../../assets/icons/circleVerticleLine.svg')} /> */ }

const PoSkeletonData = { orderid: 0, dealid: "", dealname: "", dealStatus: "", dealdescription: "", buyername: "", poNumber: "", poDate: "", createddate: "", modifieddate: "", deliverydate: "", orderstatus: "" }

const PoLength = (poList, status) => {
    if (!status) return poList?.length;
    return poList?.filter(item => item.dealStatus === status).length;
};

const GetPOStatus = (status) => {
    switch (true) {
        case status.INPROGRESS:
            return 'INPROGRESS';
        case status.DELIVERED:
            return 'DELIVERED';
        case status.CANCELLED:
            return 'CANCELLED';
        case status.DRAFT:
            return 'DRAFT';
        case status.LIVE:
            return 'LIVE';
        case status.ORDER_CONFIRMED:
            return 'ORDER_CONFIRMED';
        case status.ORDER_PLACED:
            return 'ORDER_PLACED';
        case status.ALL:
            return 'ALL';
    }
};

const POSearch = (data, query, fieldsToSearch = ['dealid', 'dealname', 'dealdescription', 'poNumber']) => {
    if (!data) return data;
    if (!query) return data;

    const normalizeQuery = query.replace(/\s+/g, ' ').toLowerCase().toString();

    return data.filter(item => {
        return fieldsToSearch.some(field => {
            const value = item[field];
            return value && value.toLowerCase().includes(normalizeQuery);
        });
    });
};

const ProgressMenuButton = (props) => {
    const chronos = new Chronos();

    return (
        <React.Fragment>
            <TouchableOpacity disabled={props.disabled} onPress={props.onPress} activeOpacity={0.8} style={[styles.menuBottom]}>
                <View style={styles.menuButtonRow}>
                    <Text style={styles.cardTitle}>{chronos.FormattedNumericDateFromTimestamp(props.baselineDate)}</Text>
                    <VectorImage style={styles.cvLine} source={require('../../../assets/icons/circleVerticleLine.svg')} />
                    <Text style={styles.cardProgressTitleBold} numberOfLines={1}>{props.baselineStatus}</Text>
                    <VectorImage source={require('../../../assets/icons/chevron-right.svg')} />
                </View>
            </TouchableOpacity>
            <ProgressBar progress={props.progress} />
        </React.Fragment>
    )
}

const POCard = ({ poItem }) => {
    const navigation = useNavigation();
    const chronos = new Chronos();
    const poStatus = StatusTypeFromStatus(poItem?.dealStatus);

    const opacity = useSharedValue(0.5);

    useEffect(() => {
        if (poStatus) {
            opacity.value = withRepeat(
                withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        } else {
            opacity.value = 1;
        }
    }, [poStatus]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const handleNavigation = ({ route }) => {
        Pandora.TriggerFeedback(Pandora.FeedbackType.Soft)
        navigation.navigate(route ? route : 'OrderDetailsPage', { po: poItem, orderid: poItem?.orderid })
    }

    const { currentstatus, currentstatusdate } = useLatestStatus(poItem)

    return (
        <React.Fragment>
            <TouchableOpacity onPress={handleNavigation} activeOpacity={0.8} style={styles.card}>
                <View style={styles.cardRow}>
                    <View style={[styles.cardRow, styles.cardRowGap]}>
                        <Text style={styles.cardTextBold}>PO <Text style={{ color: colors.DarkGray }}>{poItem?.poNumber}</Text></Text>
                        <Text style={[styles.cardTextBold, { color: colors.DarkGray }]}>{chronos.FormattedNumericDateFromTimestamp(poItem?.poDate)}</Text>
                    </View>
                    <View style={styles.cardRow}>
                        <DealStatusPill status={poStatus} />
                        {poStatus == 'In Progress' && <Animated.View style={[styles.active, { backgroundColor: colors.Success }, animatedStyle]} />}
                    </View>
                </View>

                <ExpandableText text={`Deal# ${poItem?.dealid} | ${poItem?.dealdescription}`} numberOfLines={2} textStyles={{ color: colors.DarkGray }} />
                {poStatus == 'In Progress' && <Text style={[styles.cardTextBold, styles.cardItem]}>Expected By <Text style={{ color: colors.DarkGray }}>{chronos.FormattedNumericDateFromTimestamp(poItem?.expectedDeliveryDate) || ""}</Text></Text>}
                {poItem?.orderHeldUp && <InfoBanner info={"Order Held Up"} message={poItem?.heldUPReason} />}
            </TouchableOpacity>

            <ProgressMenuButton baselineDate={currentstatusdate} baselineStatus={currentstatus} progress={parseInt(poItem.orderCompletionPercent, 10) || 0} onPress={() => handleNavigation({ route: "OrderDetailsPage" })} />
            <View style={styles.vspace} />
        </React.Fragment>
    )
}

const POOrderContainer = ({
    poList,
    listRef,
    onScroll
}) => {
    const insets = useSafeAreaInsets();
    const poFilter = useMroHubDealsFilterStore(state => state.dealsFilter)

    const poFilterBasedOnTheStatus = (status) => {
        if (status == 'ALL') return poList;
        return poList.filter(item => item.dealStatus === status);
    }

    return (
        poList ? (
            poList?.length > 0 ?
                <FlashList ref={listRef} data={poFilterBasedOnTheStatus(GetPOStatus(poFilter.dealstatus))} estimatedItemSize={200} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }} renderItem={(item, index) => <POCard key={index} poItem={item.item} />} onScroll={onScroll} scrollEventThrottle={500} /> :
                <NoContentFound title={'PO Not Found.'} message={`Sorry, we couldn’t find the purchase order.`} />
        ) : (
            <SkeletonContainer child={<POCard poItem={PoSkeletonData} />} />
        )
    )
}

function SummaryPage(props) {
    const navigation = useNavigation();
    const [value, setValue] = useState(null);
    const listRef = useRef(null);
    const [showFloatingButton, setShowFloatingButton] = useState(false);
    const notificationNav = usePushNotificationsDataStore(state => state.notificationNav)
    const setNavigation = usePushNotificationsDataStore(state => state.setNavigation)

    const [poList, setPoList] = useState([]);
    const [filterData, setFilterData] = useState([]);

    const createAlert = useContext(AlertBoxContext);
    const refreshScreens = useRefreshScreens();

    useFocusEffect(
        useCallback(() => {
            loadPOList();
        }, [loadPOList])
    );

    useEffect(() => {
        if (notificationNav) {
            navigation.navigate('NotificationPage')
            setNavigation(null)
        }
    }, [notificationNav])

    useEffect(() => {
        searchPO();
    }, [value, poList, !value])

    const scrollToTop = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowFloatingButton(offsetY > 0);
    };

    const loadPOList = async () => {
        try {
            setPoList();
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const purchaseOrdersList = await ListPurchaseOrders();
            const sortedPurchaseOrders = Chronos.SortArrayOfObjectByKey(purchaseOrdersList, 'dealid');
            setPoList(sortedPurchaseOrders);
        } catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const searchPO = () => {
        if (!value) {
            setFilterData(poList)
        } else {
            setTimeout(() => {
                const fData = POSearch(poList, value);
                setFilterData(fData);
            }, 500)
        }
    }

    return (
        <React.Fragment>
            <Search value={value} onChange={(text) => setValue(() => text)} />
            <DealsFilter num={PoLength(poList)} ip={PoLength(poList, "INPROGRESS")} del={PoLength(poList, "DELIVERED")} />
            <POOrderContainer poList={filterData} listRef={listRef} onScroll={handleScroll} />
            {showFloatingButton && <FloatingButton onPress={scrollToTop} />}
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 24,
    },

    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingVertical: 4,

        flexWrap: 'wrap'
    },

    cardRowGap: {
        columnGap: 12
    },

    cardItem: {
        paddingTop: 8,
    },
    cardTitle: {
        ...fontSizes.body_xsmall,
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
        textAlign: 'center',
        ...fontSizes.body_xsmall,
        color: colors.Black,
    },

    cardProgressTitleBold: {
        maxWidth: Dimensions.get('window').width * 0.7,
        textAlign: 'left',
        ...fontSizes.body_xsmall,
        color: colors.Black,
        overflow: 'hidden',
        flexWrap: 'wrap'
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

    active: {
        backgroundColor: colors.Primary,
        height: 8,
        width: 8,
        borderRadius: 8
    },

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },

});

export default SummaryPage;
export { POCard, ProgressMenuButton }