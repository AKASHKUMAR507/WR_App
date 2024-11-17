import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, DeviceEventEmitter, LayoutAnimation, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes } from '../components/atoms/buttons';
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';
import DealStatusPill from '../components/dealstatuspill';
import MenuButton from '../components/atoms/menubutton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chronos from '../utilities/chronos';
import { AddLiveDealToBuying, LiveDealDetails } from '../network/models/browsedeals';
import CountryFlag from '../components/atoms/countryflag';
import { useUserStore } from '../stores/stores';
import useRefreshScreens from '../hooks/refreshscreens';
import { DealTypes } from './dealpages/dealdetails';
import { Alert, AlertBoxContext } from '../components/alertbox';

function Tag({ label }) {
    return (
        <View style={styles.tag}>
            <Text style={styles.tagText}>{label}</Text>
        </View>
    )
}

function DealsCard({ rfq }) {
    const navigation = useNavigation();
    const chronos = new Chronos();

    return (
        <View>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardText}>{chronos.FormattedDateFromTimestamp(rfq.createddate)}</Text>
                    <View style={styles.row}>
                        <Text style={styles.cardText}>Closes</Text>
                        <View style={{ width: 8 }}/>
                        <Text style={styles.cardTextBold}>{chronos.FormattedDateFromTimestamp(rfq.rfqclosingdate)}</Text>
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{rfq.name}</Text>
                    <Text style={styles.cardBodyText}>{rfq.description}</Text>
                </View>
                <View style={styles.cardRowWrap}>
                    { rfq?.dealtags?.map((tag, index) => <Tag key={index} label={tag.tagname}/>) }
                </View>
                {   
                    rfq.prefsourceoforigin.length > 0 &&
                    <View style={styles.cardBody}>
                        <Text style={styles.cardTextBold}>Preferred Source of Origin</Text>
                        <View style={styles.cardRowWrap}>
                            { rfq.prefsourceoforigin.map((country, index) => <CountryFlag key={index} country={country}/>) }
                        </View>
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
            <MenuButton disabled={!rfq.attachments} label='View Deal Attachments' onPress={() => navigation.navigate('ViewAttachments', { attachments: rfq.attachments, pageTitle: 'View Live Deal Attachments' })}/>
            <MenuButton disabled={!rfq.lineitems} label='View Line Items' onPress={() => navigation.navigate('ViewLineItems')}/>
        </View>
    )
}

function ViewLiveDealsPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const refreshScreens = useRefreshScreens();

    const user = useUserStore(state => state.user);

    const [rfqDetails, setRfqDetails] = useState();

    const [loading, setLoading] = useState(false);
    const [rfqAssigned, setRfqAssigned] = useState(false);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchRfqDetails();
    }, []);

    const fetchRfqDetails = async () => {
        try {
            const rfqID = props.route?.params?.rfqid;
            const dealDetailsResponse = await LiveDealDetails(rfqID);

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setRfqDetails(dealDetailsResponse[0]);
            setRfqAssigned(dealDetailsResponse[0].rfqassigned);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const addDealToBuying = async () => {
        setLoading(true);

        try {
            await AddLiveDealToBuying({ rfqtosellerid: rfqDetails.rfqid, userrefid: user.userrefid })
            
            refreshScreens.scheduleRefreshScreen('Browse');
            refreshScreens.scheduleRefreshScreen('MyDeals');
            setRfqAssigned(true);

            createAlert(Alert.Success(`${rfqDetails.name} added to your Buying Deals`, 'Deal Added Successfully'));
        }
        catch(error) {
            createAlert(Alert.Error(error.message));
        }
        finally {
            setLoading(false);
        }
    }

    if (!rfqDetails) {
        return (
            <View style={styles.centerContentContainer}>
                <ActivityIndicator color={colors.DarkGray}/>
            </View>
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
            { rfqDetails && <DealsCard rfq={rfqDetails}/> }
            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                { 
                    rfqAssigned ?
                    <Button size={ButtonSizes.medium} label='View in Buying Deals' onPress={() => navigation.navigate('DealDetails', { dealid: rfqDetails.dealid, rfqid: rfqDetails.rfqid, role: DealTypes.Buying })}/> :
                    <Button size={ButtonSizes.medium} spinner={loading} label='Add to Buying Deals' onPress={() => addDealToBuying()}/>
                }
            </View>
        </ScrollView>   
    )
}

const styles = StyleSheet.create({
    page: {
        flexGrow: 1,
        justifyContent: 'space-between',
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

        marginTop: 12,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    cardTextRight: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,

        textAlign: 'right',
    },

    longTextContainer: {
        width: Dimensions.get('window').width * 0.5,
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
    }
});

export default ViewLiveDealsPage;