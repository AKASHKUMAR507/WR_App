import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, DeviceEventEmitter, ActivityIndicator, LayoutAnimation, Linking } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import fontSizes from '../../../styles/fonts';
import colors from '../../../styles/colors';
import DealStatusPill, { StatusTypeFromStatus, statusTypes } from '../../../components/dealstatuspill';
import MenuButton from '../../../components/atoms/menubutton';
import Chronos from '../../../utilities/chronos';
import { useUserStore } from '../../../stores/stores';
import useRefreshScreens from '../../../hooks/refreshscreens';
import { ContactTypes, NormaliseContact } from '../../../pages/bottomnavpages/network';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useCurrentDeal from '../../../hooks/currentdeal';
import ExpandableText from '../../../components/expandabletext';
import { Alert, AlertBoxContext } from '../../../components/alertbox';
import { data } from '../../../utilities/data';
import { MroHubDealDetails } from '../../../network/models/mrohubdeal';
import DealManagerCard from '../../../components/dealmanagercard';

const DealTypes = {
    Buying: 'Buying',
    Selling: 'Selling',
}

function DealTypeFromString(dealtype = '') {
    return dealtype.toLowerCase() === 'buying' ? DealTypes.Buying : DealTypes.Selling;
}

function IsStatusInactive(status) {
    return (status === statusTypes.Lost || status === statusTypes.Rejected || status === statusTypes.Suspended)
}

function NormaliseRFQDetails(rfq, type) {
    const normalisedRFQ = {
        name: rfq.name,
        description: rfq.description,
        createddate: rfq.createddate,
        closingdate: rfq.dealclosuredate,
        revid: rfq.revid,
        deliveryplace: rfq.deliveryplace,
        deliverycity: rfq.deliverycity,
        deliveryterms: rfq.deliveryterms,
    }

    normalisedRFQ.rfqid = (type === DealTypes.Buying) ? rfq.id : rfq.rfqid;
    normalisedRFQ.lineitems = (type === DealTypes.Buying) ? rfq.lineItems : rfq.rfqlineItems;
    normalisedRFQ.attachments = (type === DealTypes.Buying) ? rfq.rfqtosellerattachments : rfq.rfqAttachments;
    normalisedRFQ.tags = (type === DealTypes.Buying) ? [] : (rfq.rfqtosellertags || []);

    if (type === DealTypes.Buying) normalisedRFQ.referredsellers = rfq.referseller;
    return normalisedRFQ;
}

function Tag({ label }) {
    return (
        <View style={styles.tag}>
            <Text style={styles.tagText}>{label}</Text>
        </View>
    )
}

function RFQCard({ rfq, role, status, type, isInactiveDeal, dealid, prNumber, dealcreateddate = null, history = [] }) {
    const [currentDeal, setCurrentDeal] = useCurrentDeal();

    const navigation = useNavigation();
    const chronos = new Chronos();

    const createAlert = useContext(AlertBoxContext);

    const roletype = StatusTypeFromStatus(role);
    const dealstatus = StatusTypeFromStatus(status);

    let poNumber;
    if (currentDeal.purchaseOrdersList && currentDeal.purchaseOrdersList.length > 0) {
        poNumber = currentDeal.purchaseOrdersList[currentDeal.purchaseOrdersList.length - 1].ponumber;
    }

    const onViewReferredSellers = () => {
        setCurrentDeal({ ...currentDeal, currentRFQ: rfq });
        navigation.navigate('ViewReferredSellers');
    }

    return (
        <View>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardText}>{chronos.FormattedDateFromTimestamp(rfq.assignmentdate || rfq.createddate || dealcreateddate)}</Text>
                    <Text style={styles.cardText}>Closes<Text style={styles.cardTextBold}> {chronos.FormattedDateFromTimestamp(rfq.closingdate)}</Text></Text>
                </View>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardText}>Deal<Text style={styles.cardTextBold}> {dealid}</Text></Text>
                        <Text style={styles.cardText}>RFQ<Text style={styles.cardTextBold}> {rfq.rfqid}</Text></Text>
                        {prNumber && <Text style={styles.cardText}>PR No<Text style={styles.cardTextBold}> {prNumber || "Not Specified"}</Text></Text>}
                        {poNumber && <Text style={styles.cardText}>PO No<Text style={styles.cardTextBold}> {poNumber || "Not Specified"}</Text></Text>}
                    </View>
                    <View style={styles.statusPills}>
                        <DealStatusPill status={roletype} />
                        <DealStatusPill status={dealstatus} />
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <View style={styles.cardRow}>
                        {
                            type === DealTypes.Selling && history.length - 1 > 0 &&
                            <View style={styles.edits}>
                                <Text style={styles.cardText}>{history.length - 1} Revisions, Last edit on {chronos.FormattedDateFromTimestamp(rfq.createddate)}</Text>
                            </View>
                        }
                    </View>
                    <Text style={styles.cardTitle}>{rfq.name}</Text>
                    <ExpandableText text={rfq.description} textStyles={styles.cardBodyText} />
                </View>
                {
                    rfq.tags.length > 0 &&
                    <View style={styles.cardRowWrap}>
                        {rfq.tags.map((tag, index) => <Tag key={index} label={tag.tagname} />)}
                    </View>
                }
                <View>
                    {
                        rfq.deliverycity && rfq.deliveryplace &&
                        <View style={[styles.cardFooter, { marginBottom: 16 }]}>
                            <Text style={styles.cardTextBold}>Place of Delivery</Text>
                            <View style={styles.longTextContainer}>
                                <Text style={styles.cardTextRight}>{rfq.deliverycity}, {rfq.deliveryplace}</Text>
                            </View>
                        </View>
                    }
                    <View style={styles.cardFooter}>
                        <Text style={styles.cardTextBold}>Delivery Terms</Text>
                        <View style={styles.longTextContainer}>
                            <Text style={styles.cardTextRight}>{rfq.deliveryterms || 'Not Specified'}</Text>
                        </View>
                    </View>
                </View>
            </View>

           { <View style={styles.cardBodyHorizontal}>
                <DealManagerCard name={"Akash"} mobile={"989328883"} email={'akash@gmail.com'} />
            </View>}

            {type === DealTypes.Selling && history.length - 1 > 0 && <MenuButton label='View Revisions History' onPress={() => createAlert(Alert.Info('This feature is coming soon. Please stay tuned to updates on the app.', 'Coming Soon'))} />}
            {type === DealTypes.Buying && <MenuButton label='View Referred Sellers' onPress={() => onViewReferredSellers()} />}
            {rfq.lineitems?.length > 0 && <MenuButton label='View Line Items' onPress={() => navigation.navigate('ViewLineItems', { lineitems: rfq.lineitems })} />}
            {rfq.attachments?.length > 0 && <MenuButton label='View Attachments' onPress={() => navigation.navigate('ViewAttachments', { attachments: rfq.attachments, pageTitle: 'View RFQ Attachments' })} />}
            <View style={styles.vspace} />
        </View>
    )
}

function DealDetailsPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const refreshScreens = useRefreshScreens();

    const user = useUserStore(state => state.user);
    const [currentDeal, setCurrentDeal, clearCurrentDeal] = useCurrentDeal();

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        clearCurrentDeal();
    }, []);

    useEffect(() => {
        fetchDealDetails();
    }, [refreshScreens.shouldRefresh]);

    const fetchDealDetails = async () => {
        try {
            const dealid = props.route?.params?.dealid;
            const draft = props.route?.params?.draft;
            const rfqid = props.route?.params?.rfqid || null;

            const dealDetails = await MroHubDealDetails({ dealid: dealid, draft: draft == 0 ? false : true });
            populateDataFromDealDetails(dealDetails, rfqid);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const populateDataFromDealDetails = (dealDetails, rfqid) => {
        const dealtype = DealTypeFromString(dealDetails.dealtype);

        const dealInfo = {
            buyerid: dealDetails.buyerid,
            associateid: dealDetails.associateid,
            role: dealDetails.roletype,
            status: dealDetails.dealstatus,
            name: dealDetails.dealname,
            description: dealDetails.description,
            id: dealDetails.dealid,
            tags: dealDetails.dealtags,
            attachments: dealDetails.dealAttachments,
            dealType: dealtype,
            prNumber: dealDetails.prNumber,
            closingdate: dealDetails.closingdate,
            createddate: dealDetails.createddate,

            deliveryTerms: dealDetails.deliveryterms,
            deliveryPlace: dealDetails.deliveryplace,
            deliveryCity: dealDetails.deliverycity,

            spclTerms: dealDetails.spclterms,
            otherNotes: dealDetails.othernotes,
            rejectedReason: dealDetails.rejectedReason,
            otherReason: dealDetails.otherReason,
            prNumber: dealDetails.prNumber,

            dealTags: dealDetails.dealtags,
            lineItems: dealDetails.lineItems,

            dealmanager: {
                id: dealDetails.dealmanagerid,
                name: dealDetails.dealmanagername,
            },
            isInactiveDeal: IsStatusInactive(StatusTypeFromStatus(dealDetails.dealstatus)),
            buyerInformation: NormaliseContact(dealDetails.buyerDetails, ContactTypes.Buyer),
            currentRFQ: null,
            selectedRFQ: null,
            rfqList: [],
            quotationList: [],
            purchaseOrdersList: [],
            invoicesList: [],
            notifications: [],
        }

        const rfqList = dealtype === DealTypes.Buying ? dealDetails.rfqtosellerlist : dealDetails.rfqlist;
        dealInfo.rfqList = Chronos.SortObjectsByDate(rfqList.map((rfq) => NormaliseRFQDetails(rfq, dealtype)));
        dealInfo.currentRFQ = dealInfo.rfqList.find((rfq) => rfq.rfqid === rfqid) || dealInfo.rfqList[0];
        dealInfo.selectedRFQ = dealInfo.currentRFQ;

        dealInfo.quotationList = dealtype === DealTypes.Buying ? dealDetails.quotelist : dealDetails.quotationtobuyers;
        dealInfo.purchaseOrdersList = dealtype === DealTypes.Buying ? dealDetails.wrPurchaseOrder : dealDetails.buyerPurchaseOrder;
        dealInfo.invoicesList = dealtype === DealTypes.Buying ? dealDetails.sellerinvoicelist : dealDetails.wrinvoicelist;
        dealInfo.notifications = Chronos.SortObjectsByDate(dealDetails.notificationlist);


        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCurrentDeal(dealInfo);
    }

    const chatOnWhatsapp = () => {
        const whatsappPhoneNumber = '918090304020';
        const messageText = `Hello, ${user.name}(${user.userrefid}) here.\nI have a query regarding my deal ${currentDeal.name} (${currentDeal.id}).`;

        const url = `whatsapp://send?text=${messageText}&phone=${whatsappPhoneNumber}`;

        Linking.canOpenURL(url)
            .then(() => Linking.openURL(`whatsapp://send?text=${messageText}&phone=${whatsappPhoneNumber}`))
            .catch(() => createAlert(Alert.Error('Please make sure that whatsapp is installed on your device', 'Whatsapp Redirect Failed')));
    }

    if (!currentDeal) {
        return (
            <View style={styles.centerContentContainer}>
                <ActivityIndicator color={colors.DarkGray} />
            </View>
        )
    }

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
            <RFQCard
                role={currentDeal.role}
                status={currentDeal.status}
                rfq={currentDeal.selectedRFQ}
                type={currentDeal.dealType}
                isInactiveDeal={currentDeal.isInactiveDeal}
                dealid={currentDeal.id}
                prNumber={currentDeal.prNumber}
                dealcreateddate={currentDeal.createddate}
                history={currentDeal.rfqList}
            />

            {
                currentDeal.dealType === DealTypes.Buying && currentDeal.rfqList.length > 1 &&
                <React.Fragment>
                    <MenuButton label='View All RFQs For Deal' onPress={() => navigation.navigate('ViewRFQs')} />
                    <View style={styles.vspace} />
                </React.Fragment>
            }
            <MenuButton label='View RFQ' onPress={() => navigation.navigate('ViewRfq')} />
            <MenuButton label='View Quotations' onPress={() => navigation.navigate('ViewQuotations')} />
            <MenuButton disabled={currentDeal.quotationList.length === 0} label='View Purchase Orders' onPress={() => navigation.navigate('ViewPurchaseOrders')} />
            <MenuButton disabled={currentDeal.purchaseOrdersList.length === 0} label='View Deal Invoices' onPress={() => navigation.navigate('ViewInvoices')} />
            <MenuButton label='Document Hub' onPress={() => navigation.navigate('ViewAttachments', { attachments: data, pageTitle: 'View MROHub Attachments' })} />

            {
                currentDeal.notifications && currentDeal.notifications.length > 0 &&
                <MenuButton label='View Deal History' onPress={() => navigation.navigate('ViewDealHistory', { notifications: currentDeal.notifications })} />
            }
            <View style={styles.vspace} />
            {/* <MenuButton disabled={currentDeal.isInactiveDeal} label='Chat with Deal Manager' onPress={() => createAlert(Alert.Info('This feature is coming soon, please stay tuned for updates to the app.', 'Coming Soon'))}  /> */}
            {/* onPress={() => navigation.navigate('Chat', { deal: currentDeal.id, dealmanager: currentDeal.dealmanager })} */}

            <MenuButton disabled={currentDeal.isInactiveDeal} label='Chat with WorldRef (Whatsapp)' onPress={() => chatOnWhatsapp()} />
            <View style={styles.vspace} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    page: {
    },

    centerContentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        alignItems: 'baseline',

        marginBottom: 16,
    },

    cardBody: {
        marginVertical: 16,
    },

    cardBodyHorizontal: {
        paddingHorizontal: 16,
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardTextRight: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,

        textAlign: 'right',
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

    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginBottom: 8,
        marginTop: -16,
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

    longTextContainer: {
        width: Dimensions.get('window').width * 0.5,
    },

    rfqId: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,

        marginBottom: 12,
    },
});

export default DealDetailsPage;
export { DealTypes, DealTypeFromString, RFQCard };