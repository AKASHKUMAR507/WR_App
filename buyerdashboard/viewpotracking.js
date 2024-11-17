import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, LayoutAnimation, RefreshControl, Dimensions, LogBox, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';
import colors from '../styles/colors';
import Chronos from '../utilities/chronos';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PurchaseOrderDetails } from '../network/models/purchaseorders';
import fontSizes from '../styles/fonts';
import Timeline from 'react-native-timeline-flatlist';
import { useNavigation } from '@react-navigation/native';
import { wrapText } from '../utilities/helper';
import { InfoBannerForOrder } from './info';
import { PurchaseOrderCard } from './buyerpages/orderpages/orderdetailspage';
import DialogBox from '../components/modal';
import SkeletonContainer from '../components/skeletons';
import FloatingButton from './flotingbutton';
import inputStyles from '../components/form_inputs/inputStyles';
import styles from '../styles/potrackingstyles';
import VectorImage from 'react-native-vector-image';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
const PoSkeletonData = { buyername: "", createddate: "", dealdescription: "", dealid: "", dealname: "", deliverydate: "", modifieddate: "", orderstatus: "", dealStatus: "", poDate: "", poNumber: "" }

function OrderStatusCard({ poBuyerDetails }) {
    const chronos = new Chronos();

    const formattedString = (str) => { return str?.replace('-', '') }

    return (
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', }}>
                <View style={{ width: Dimensions.get('window').width * 0.5 }}>
                    <Text style={{ ...fontSizes.heading_small, color: colors.Black }}>Expected Delivery Date</Text>
                    <Text style={styles.cardText}>{chronos.FormattedNumericDateFromTimestamp(poBuyerDetails.variableStatus?.expectedDeliveryDate)}</Text>
                    {poBuyerDetails.orderbl?.deliveryterm && <Text style={styles.cardText}>{poBuyerDetails.orderbl?.deliveryterm}{`\n`}{poBuyerDetails.orderbl?.city} - {poBuyerDetails.orderbl?.country}</Text>}
                </View>
                <View style={{ width: Dimensions.get('window').width * 0.5, gap: 0 }}>
                    <Text style={{ ...fontSizes.heading_small, color: colors.Black }}>Order Status</Text>
                    <Text style={styles.cardText}>{formattedString(poBuyerDetails.variableStatus?.orderTrackingStatus)}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <View style={{ width: Dimensions.get('window').width * 0.5, gap: 0 }}>
                    <Text style={{ ...fontSizes.heading_small, color: colors.Black, marginTop: 8 }}>Baseline Delivery Date</Text>
                    <Text style={styles.cardText}>{chronos.FormattedNumericDateFromTimestamp(poBuyerDetails.variableStatus?.baselineDeliveryDate)}</Text>
                </View>
                <View style={{ width: Dimensions.get('window').width * 0.5, gap: 0 }}>
                    <Text style={{ ...fontSizes.heading_small, color: colors.Black }}>Zero Date</Text>
                    <Text style={styles.cardText}>{poBuyerDetails.variableStatus?.zeroDate ? chronos.FormattedNumericDateFromTimestamp(poBuyerDetails.variableStatus?.zeroDate) : 'Not Provided'}</Text>
                </View>
            </View>
        </View>
    )
}

const Time = ({ baselineDate, currentDate, publish, totalVariation }) => {
    const chronos = new Chronos();

    return (
        <View>
            {
                (currentDate && publish) ?
                    <Text style={[styles.timeStyle1, { color: colors.Success }]}>{chronos.FormattedNumericDateFromTimestamp(currentDate)}</Text> :
                    <Text style={[styles.timeStyle2, { color: colors.DarkGray }]}>{chronos.FormattedNumericDateFromTimestamp(totalVariation)}</Text>
            }
            <Text style={[styles.timeStyle2, { color: colors.DarkGray }]}>{chronos.FormattedNumericDateFromTimestamp(baselineDate)}</Text>
        </View>
    )
}

const Title = ({ generalStatus, currentStatus, publish }) => {
    return (
        <View style={styles.titleContainer}>
            <Text style={[styles.titleStyle, { color: (currentStatus && publish) ? colors.Success : colors.DarkGray }]}>{wrapText(generalStatus, 35)}</Text>
        </View>
    )
}

const Description = ({ baselineStatus, currentStatus, comments, attachments, publish }) => {
    const navigation = useNavigation();
    return (
        <View>
            <Text style={styles.currentStatusTextStyle}>{publish ? currentStatus : baselineStatus}</Text>
            {comments && <Text style={styles.commentStyleText}>({comments})</Text>}
            {
                attachments.length > 0 &&
                <TouchableOpacity style={styles.attachmentStyle} activeOpacity={0.8} onPress={() => navigation.navigate('ViewAttachments', { attachments: attachments, pageTitle: 'View PO Attachments' })}>
                    <Image source={require('../assets/images/attachment.png')} style={styles.attachmentIconStyle} />
                    <Text style={styles.attachmentTextStyle}>View Attachments</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

function POCard({ orderBlBs, poItem }) {
    const chronos = new Chronos();
    const [openModal, setOpenModal] = useState(false)
    const [currentPlan, setCurrentPlan] = useState(false)
    const [text, setText] = useState(null);

    const normalizePo = {
        buyername: poItem.buyername,
        createddate: poItem.createddate,
        dealdescription: poItem.dealdescription,
        dealid: poItem.dealid,
        dealname: poItem.dealname,
        deliverydate: poItem.deliverydate,
        modifieddate: poItem.modifieddate,
        orderstatus: poItem.orderstatus,
        dealStatus: poItem.dealStatus,
        poDate: poItem.poDate,
        poNumber: poItem.poNumber,
        orderHeldUp: poItem.orderHeldUp,
        orderHeldUpReason: poItem.heldUPReason,
    }

    const totalVariationInNumber = Math.abs(parseInt(poItem?.variableStatus?.totalVariation))

    const timelineData = orderBlBs && orderBlBs.length > 0
        ? orderBlBs.map((item, index) => ({
            time: <Time baselineDate={item?.baselinedate} currentDate={item?.currentstatusdate} publish={item?.publishtouser} totalVariation={chronos.ExtendedDays(item?.baselinedate, parseInt(poItem?.variableStatus?.totalVariation))} />,
            title: <Title generalStatus={item?.genstatus} currentStatus={item?.currentstatus} publish={item?.publishtouser} variationDays={poItem?.variableStatus?.totalVariation} />,
            description: <Description baselineStatus={item?.baselinestatus} currentStatus={item?.currentstatus} publish={item?.publishtouser} comments={item?.comments} attachments={item?.baselineAttachments} />,
            lineColor: (index < orderBlBs.filter(item => item.publishtouser).length - 1) ? colors.Success : colors.DarkGray40,
            circleColor: (item?.currentstatus && item?.publishtouser) ? colors.Success : colors.DarkGray40,
        }))
        : [];


    return (
        <React.Fragment>
            <PurchaseOrderCard poItem={normalizePo} heldUp={false} infoMessage={poItem.variableStatus?.heldUPReason} />

            <View style={{paddingBottom: 24}}>
                <OrderStatusCard po={orderBlBs} poBuyerDetails={poItem} />

                {(totalVariationInNumber > 0) && <Text style={{ paddingHorizontal: 0, textAlign: 'center', ...fontSizes.heading_small, color: colors.DarkGray }}>Total Variation from Baseline <Text style={{ color: colors.Black }}>{Math.abs(parseInt(poItem.variableStatus?.totalVariation))} Days</Text></Text>}
                <InfoBannerForOrder
                    po={poItem.variableStatus}
                    onDelExt={() => (setOpenModal(true), setText('Delivery extension due to delayed fulfillment caused by reasons attributable to the Buyer, such as late payments, approvals and clearances. Check the tracker for more details.'))}
                    onDelay={() => (setOpenModal(true), setText('Delay due to reasons attributable to WorldRef, and/or its suppliers'))}
                />

                <DialogBox visible={openModal} label={text} onRequestClose={() => setOpenModal(false)} />
                <DialogBox visible={openModal} label={text} onRequestClose={() => setOpenModal(false)} />
            </View>

            <View style={styles.vspace} />

            <View style={{ paddingHorizontal: 16, flexDirection: 'row', gap: 16, paddingTop: 24, paddingBottom: 16, alignItems: 'baseline' }}>
                <View style={{ height: 22, width: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.DarkGray40, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: 12, width: 12, borderRadius: 8, backgroundColor: colors.DarkGray40 }}></View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                    <View>
                        <Text style={[inputStyles.inputLabel, { ...fontSizes.heading_small }]}>Current Plan</Text>
                        <Text style={[inputStyles.inputLabel, { ...fontSizes.body_small }]}>Baseline Plan</Text>
                    </View>
                    <View style={{ paddingTop: 4 }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setCurrentPlan(true)}>
                            <VectorImage tintColor={colors.Success} source={require('../assets/icons/info-circle.svg')} />
                        </TouchableOpacity>
                        <DialogBox visible={currentPlan} onRequestClose={() => setCurrentPlan(false)} >
                            <View style={{ paddingBottom: 16, gap: 8, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Text style={inputStyles.inputLabel}>Current Plan <Text style={{ color: colors.DarkGray }}>is dynamic order execution plan which gets updated as per real-time completion of milestones.</Text></Text>
                                <Text style={inputStyles.inputLabel}>Baseline Plan <Text style={{ color: colors.DarkGray }}>is order execution plan available at zero date</Text></Text>
                            </View>
                        </DialogBox>
                    </View>
                </View>
            </View>

            <Timeline
                data={timelineData}
                timeContainerStyle={{ minWidth: 72 }}
                listViewContainerStyle={{ paddingHorizontal: 16 }}
                detailContainerStyle={{ marginTop: -14, paddingVertical: 4 }}
                columnFormat='single-column-left'
                showTime
                lineWidth={4}
                lineColor={'lineColor'}
                circleStyle={'circleColor'}
                circleSize={20}
                circleColor={colors.DarkGray}
                innerCircle={'dot'}
                titleStyle={{ paddingRight: 32 }}
                separator
                separatorStyle={{ backgroundColor: colors.DarkGray40, marginBottom: -2 }}
                options={{
                    style: { paddingVertical: 16 }
                }}
                isUsingFlatlist={true}
            />
        </React.Fragment>
    )
}

function ViewPOTrackingPage(props) {
    const { orderid } = props.route.params;
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef(null);
    const listRef = useRef(null)

    const [purchaseOrderStatusList, setPurchaseOrderStatusList] = useState({});
    const [buyerDetails, setBuyerDetails] = useState({});
    const [showButton, setShowButton] = useState(true);
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        fetchPurchaseOrdersDetails();
    }, [orderid])

    const fetchPurchaseOrdersDetails = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const purchaseOrdersDetails = await PurchaseOrderDetails(orderid);
        const sortedPurchaseOrdersDetails = Chronos.SortArrayOfObjectByKey(purchaseOrdersDetails?.orderbl?.bs, 'statustrackingid', false);
        setPurchaseOrderStatusList(sortedPurchaseOrdersDetails);

        const buyerDetailsObject = {
            dealname: purchaseOrdersDetails.dealname,
            dealid: purchaseOrdersDetails.dealid,
            dealdescription: purchaseOrdersDetails.dealdescription,
            buyername: purchaseOrdersDetails.buyername,
            poNumber: purchaseOrdersDetails.poNumber,
            poDate: purchaseOrdersDetails.poDate,
            createddate: purchaseOrdersDetails.createddate,
            modifieddate: purchaseOrdersDetails.modifieddate,
            deliverydate: purchaseOrdersDetails.deliverydate,
            orderstatus: purchaseOrdersDetails.orderstatus,
            dealStatus: purchaseOrdersDetails.dealStatus,
            orderbl: {
                modifiedby: purchaseOrdersDetails?.orderbl?.modifiedby,
                modifieddate: purchaseOrdersDetails?.orderbl?.modifieddate,
                creatededdate: purchaseOrdersDetails?.orderbl?.creatededdate,
                comments: purchaseOrdersDetails?.orderbl?.comments,
                estimateddeliverydate: purchaseOrdersDetails?.orderbl?.estimateddeliverydate,
                deliveryterm: purchaseOrdersDetails?.orderbl?.deliveryterm,
                city: purchaseOrdersDetails?.orderbl?.city,
                country: purchaseOrdersDetails?.orderbl?.country,
                publishtouser: purchaseOrdersDetails?.orderbl?.publishtouser
            },
            variableStatus: {
                orderstatus: purchaseOrdersDetails.orderstatus,
                orderCompletionPercent: purchaseOrdersDetails.orderCompletionPercent,
                orderTrackingStatus: purchaseOrdersDetails.orderTrackingStatus,
                deliveryPlace: purchaseOrdersDetails.deliveryPlace,
                totalVariation: purchaseOrdersDetails.totalVariation,
                deliveryExtension: purchaseOrdersDetails.deliveryExtension,
                delay: purchaseOrdersDetails.delay,
                zeroDate: purchaseOrdersDetails.zeroDate,
                expectedDeliveryDate: purchaseOrdersDetails.expectedDeliveryDate,
                baselineDeliveryDate: purchaseOrdersDetails.baselineDeliveryDate,
                heldUPReason: purchaseOrdersDetails.heldUPReason,
                city: purchaseOrdersDetails.city,
                country: purchaseOrdersDetails.country,
                deliveryterm: purchaseOrdersDetails.deliveryterm,
                orderHeldUp: purchaseOrdersDetails.orderHeldUp
            }
        }
        setBuyerDetails(buyerDetailsObject)
    }

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };


    const handleScroll = (event) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        const isAtTop = contentOffset.y <= 0;
        setShowButton(!isAtBottom);
        setShowTop(!isAtTop);
    };

    return (
        Object.keys(purchaseOrderStatusList).length > 0 ? (
            <React.Fragment>
                <ScrollView ref={scrollViewRef} onScroll={handleScroll} contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false} >
                    <POCard poItem={buyerDetails} orderBlBs={purchaseOrderStatusList} />
                </ScrollView>
                {showButton && <FloatingButton style={{ transform: [{ rotate: '90deg' }] }} onPress={scrollToBottom} />}
                {showTop && <FloatingButton onPress={scrollToTop} />}
            </React.Fragment>
        ) : (
            <SkeletonContainer child={<PurchaseOrderCard poItem={PoSkeletonData} />} />
        )
    )
}

export default ViewPOTrackingPage;