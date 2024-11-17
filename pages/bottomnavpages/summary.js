import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, DeviceEventEmitter, Image, Dimensions, TouchableOpacity, ActivityIndicator, LayoutAnimation } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import { useDealsFilterStore, useDealsModeStore, useEarningsFilterStore, useNetworkModeStore, useUserStore } from '../../stores/stores';
import { GetSummaryPage, GetUserInfo } from '../../network/models/user';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import AvatarPlaceholder from '../../components/avatarplaceholder';
import { DealModes, NetworkModes } from '../../components/modeselectors';
import { ListLiveDeals } from '../../network/models/browsedeals';
import Aphrodite from '../../utilities/aphrodite';
import { Skeleton } from '../../components/skeletons';
import { GetBuyersList, GetSellersList } from '../../network/models/contacts';
import VerifiedBadge from '../../components/atoms/verified';
import { useBuyersList, useEarningsOverview, useListLiveDeals, useSellersList, useSummaryPage } from '../../stores/fetchstore';
import { ListEarnings } from '../../network/models/earnings';

const DealFilterPresets = {
    ALL: {
        roletype: { ACTIVE: true, PASSIVE: true },
        dealstatus: { SUBMITTED: true, LIVE: true, QUOTED: true, PO_RELEASED: true, INVOICED: true, PARTIALLY_PAID: true, FULLY_PAID: true, DELIVERED: true, REJECTED: true, LOST: true, SUSPENDED: true }
    },
    LIVE: {
        roletype: { ACTIVE: true, PASSIVE: true },
        dealstatus: { SUBMITTED: false, LIVE: true, QUOTED: false, PO_RELEASED: false, INVOICED: false, PARTIALLY_PAID: false, FULLY_PAID: false, DELIVERED: false, REJECTED: false, LOST: false, SUSPENDED: false }
    },
    WON: {
        roletype: { ACTIVE: true, PASSIVE: true },
        dealstatus: { SUBMITTED: false, LIVE: false, QUOTED: false, PO_RELEASED: true, INVOICED: true, PARTIALLY_PAID: true, FULLY_PAID: true, DELIVERED: true, REJECTED: false, LOST: false, SUSPENDED: false }
    },
}

const EarningFilterPresets = {
    ALL: {
        dealtype: { BUYING: true, SELLING: true },
        claimstatus: { ELIGIBLE_FOR_CLAIM: true, NOT_ELIGIBLE_FOR_CLAIM: true, CLAIM_UNDER_PROCESS: true, SUCCESS_FEE_PAID: true, SUCCESS_FEE_NOT_PAID: true }
    },

    SUCCESS_FEE_PAID: {
        dealtype: { BUYING: true, SELLING: true },
        claimstatus: { ELIGIBLE_FOR_CLAIM: false, NOT_ELIGIBLE_FOR_CLAIM: false, CLAIM_UNDER_PROCESS: false, SUCCESS_FEE_PAID: true, SUCCESS_FEE_NOT_PAID: false }
    },

    SUCCESS_FEE_NOT_PAID: {
        dealtype: { BUYING: true, SELLING: true },
        claimstatus: { ELIGIBLE_FOR_CLAIM: false, NOT_ELIGIBLE_FOR_CLAIM: false, CLAIM_UNDER_PROCESS: false, SUCCESS_FEE_PAID: false, SUCCESS_FEE_NOT_PAID: true }
    },
    ELIGIBLE_FOR_CLAIM: {
        dealtype: { BUYING: true, SELLING: true },
        claimstatus: { ELIGIBLE_FOR_CLAIM: true, NOT_ELIGIBLE_FOR_CLAIM: false, CLAIM_UNDER_PROCESS: false, SUCCESS_FEE_PAID: false, SUCCESS_FEE_NOT_PAID: false }
    },
}

const EarningClaimTypes = {
    EligibleForClaim: 'Eligible For Claim',
    NotEligibleForClaim: 'Not Eligible For Claim',
    ClaimUnderProcess: 'Claim Under Process',
    SuccessFeeNotPaid: 'Success Fee Not Paid',
    SuccessFeePaid: 'Success Fee Paid',
}

function SellingDealsCard() {
    const summaryPageDetails = useSummaryPage(state => state.summaryPageDetails);
    const live = summaryPageDetails?.livesellingdealscount || 0;
    const won = summaryPageDetails?.wonsellingdealscount || 0;
    const liveAmount = summaryPageDetails?.livesellingdealsamount || 0;
    const wonAmount = summaryPageDetails?.wonsellingdealsamount || 0;

    const navigation = useNavigation();

    const setDealsMode = useDealsModeStore(state => state.setDealsMode);
    const setDealsFilter = useDealsFilterStore(state => state.setDealsFilter);

    const navigateSellingDeals = (preset) => {
        setDealsFilter(preset);
        setDealsMode(DealModes.Selling);
        navigation.navigate('MyDeals');
    }

    return (
        <View style={styles.card}>
            <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>My Selling Deals</Text>
                <Text style={styles.cardLink} onPress={() => navigateSellingDeals(DealFilterPresets.ALL)}>View All &gt;</Text>
            </View>
            <View style={styles.rowSep} />
            <View style={styles.cardRow}>
                <View style={styles.cardSubRow}>
                    <Text style={styles.cardSubtitle}>{Aphrodite.FormatNumbers(live)}</Text>
                    <View>
                        <Text style={styles.cardInfo}>Live Deals</Text>
                        <Text style={styles.cardLink} onPress={() => navigateSellingDeals(DealFilterPresets.LIVE)}>USD {Aphrodite.FormatNumbers(liveAmount)} &gt;</Text>
                    </View>
                </View>
                <View style={styles.cardSubRow}>
                    <Text style={styles.cardSubtitle}>{Aphrodite.FormatNumbers(won)}</Text>
                    <View>
                        <Text style={styles.cardInfo}>Deals Won</Text>
                        <Text style={styles.cardLink} onPress={() => navigateSellingDeals(DealFilterPresets.WON)}>USD {Aphrodite.FormatNumbers(wonAmount)} &gt;</Text>
                    </View>
                </View>
            </View>
            <View style={styles.rowSep} />
            <View style={styles.cardRow}>
                <View>
                    <Text style={styles.cardInfo}>Refer Deals.</Text>
                    <Text style={styles.cardInfo}>Earn Assured Success Fee.</Text>
                </View>
                <Button label="Refer Deal" size={ButtonSizes.medium} onPress={() => navigation.navigate('ReferDeal')} />
            </View>
        </View>
    )
}

function BuyingDealsCard() {
    const summaryPageDetails = useSummaryPage(state => state.summaryPageDetails);
    const navigation = useNavigation();
    const live = summaryPageDetails?.livebuyingdealscount || 0;
    const won = summaryPageDetails?.wonbuyingdealscount || 0;
    const liveAmount = summaryPageDetails?.livebuyingdealsamount || 0;
    const wonAmount = summaryPageDetails?.wonbuyingdealsamount || 0;

    const setDealsMode = useDealsModeStore(state => state.setDealsMode);
    const setDealsFilter = useDealsFilterStore(state => state.setDealsFilter);

    const navigateBuyingDeals = (preset) => {
        setDealsFilter(preset);
        setDealsMode(DealModes.Buying);
        navigation.navigate('MyDeals');
    }

    return (
        <View style={styles.card}>
            <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>My Buying Deals</Text>
                <Text style={styles.cardLink} onPress={() => navigateBuyingDeals(DealFilterPresets.ALL)}>View All &gt;</Text>
            </View>
            <View style={styles.rowSep} />
            <View style={styles.cardRow}>
                <View style={styles.cardSubRow}>
                    <Text style={styles.cardSubtitle}>{Aphrodite.FormatNumbers(live)}</Text>
                    <View>
                        <Text style={styles.cardInfo}>Live Deals</Text>
                        <Text style={styles.cardLink} onPress={() => navigateBuyingDeals(DealFilterPresets.LIVE)}>USD {Aphrodite.FormatNumbers(liveAmount)} &gt;</Text>
                    </View>
                </View>
                <View style={styles.cardSubRow}>
                    <Text style={styles.cardSubtitle}>{Aphrodite.FormatNumbers(won)}</Text>
                    <View>
                        <Text style={styles.cardInfo}>Deals Won</Text>
                        <Text style={styles.cardLink} onPress={() => navigateBuyingDeals(DealFilterPresets.WON)}>USD {Aphrodite.FormatNumbers(wonAmount)} &gt;</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

function EarningsCard(props) {
    const navigation = useNavigation();
    const earningsOverview = useEarningsOverview(state => state.earningsOverview);
    const setEarningsFilter = useEarningsFilterStore(state => state.setEarningsFilter);
    const [earningsList, setEarningsList] = useState([]);
    const createAlert = useContext(AlertBoxContext)

    const navigationEarning = (preset) => {
        setEarningsFilter(preset);
        navigation.navigate('EarningsList')
    }

    const fetchEarningsList = async () => {
        try {
            const earnings = await ListEarnings(EarningFilterPresets.ELIGIBLE_FOR_CLAIM);
            setEarningsList([...earnings]);
        }
        catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        fetchEarningsList();
    }, [])

    return (
        <View style={styles.card}>
            <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>My Earnings</Text>
                <Text style={styles.cardLink} onPress={() => navigationEarning(EarningFilterPresets.ALL)} >View All &gt;</Text>
            </View>
            <View style={styles.rowSepLarge} />
            <View style={styles.cardRow}>
                <View>
                    <Text style={styles.cardHeading}>USD {Aphrodite.FormatNumbers(earningsOverview?.totalearning || 0)}</Text>
                    <Text style={styles.cardLink} onPress={() => navigation.navigate('Earnings')} >Total Suceess Fee &gt;</Text>
                </View>
                <View>
                    <Text style={styles.cardHeading}>USD {Aphrodite.FormatNumbers(earningsOverview?.successfeespaid || 0)}</Text>
                    <Text style={styles.cardLink} onPress={() => navigationEarning(EarningFilterPresets.SUCCESS_FEE_PAID)} >Success Fee Paid &gt;</Text>
                </View>
            </View>
            <View style={styles.rowSepLarge} />
            <View style={styles.cardRow}>
                <View>
                    <Text style={styles.cardHeading}>USD {Aphrodite.FormatNumbers(earningsOverview?.successfeesnotpaid || 0)}</Text>
                    <Text style={styles.cardLink} onPress={() => navigationEarning(EarningFilterPresets.SUCCESS_FEE_NOT_PAID)} >Success Fee Not Claimed &gt;</Text>
                </View>
            </View>
            <View style={styles.rowSepLarge} />
            <View style={styles.cardRow}>
                <View>
                    <Text style={styles.cardTitle}>USD 5,000</Text>
                    <Text style={styles.cardInfo}>Eligible for Claim.</Text>
                </View>
                {
                    earningsList.length > 0 &&
                    <Button label="Claim Amount" size={ButtonSizes.medium} onPress={() => navigation.navigate('EarningDetailsPreClaim', { earning: earningsList[0], claimType: EarningClaimTypes.EligibleForClaim })} />
                }
            </View>
        </View>
    )
}
function NetworkCard() {
    const navigation = useNavigation();
    const buyersList = useBuyersList(state => state.buyersList);
    const sellersList = useSellersList(state => state.sellersList);
    const buyers = buyersList?.length || 0;
    const sellers = sellersList?.length || 0;

    const setNetworkMode = useNetworkModeStore(state => state.setNetworkMode);

    const navigateBuyers = () => {
        setNetworkMode(NetworkModes.Buyers);
        navigation.navigate('Network');
    }

    const navigateSellers = () => {
        setNetworkMode(NetworkModes.Sellers);
        navigation.navigate('Network');
    }

    const navigateReferBuyer = () => {
        setNetworkMode(NetworkModes.Buyers);
        navigation.navigate('AddContact');
    }

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [buyers, sellers]);

    return (
        <View style={styles.card}>
            <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>My Network</Text>
            </View>
            <View style={styles.rowSep} />
            <View style={styles.cardRow}>
                <View style={styles.cardSubRow}>
                    {
                        buyers === null ?
                            <View style={{ height: 68, marginHorizontal: 16, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <ActivityIndicator color={colors.DarkGray20} />
                            </View> :
                            <Text style={styles.cardSubtitle}>{Aphrodite.FormatNumbers(buyers)}</Text>
                    }
                    <TouchableOpacity activeOpacity={0.8} onPress={navigateBuyers}>
                        <Text style={styles.cardLink}>Buyers</Text>
                        <Text style={styles.cardLink}>Referred &gt;</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardSubRow}>
                    {
                        sellers === null ?
                            <View style={{ height: 68, marginHorizontal: 16, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <ActivityIndicator color={colors.DarkGray20} />
                            </View> :
                            <Text style={styles.cardSubtitle}>{Aphrodite.FormatNumbers(sellers)}</Text>
                    }
                    <TouchableOpacity activeOpacity={0.8} onPress={navigateSellers}>
                        <Text style={styles.cardLink}>Sellers</Text>
                        <Text style={styles.cardLink}>Referred &gt;</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.rowSep} />
            <View style={styles.cardRow}>
                <View>
                    <Text style={styles.cardInfo}>Refer Buyers, generate deals,</Text>
                    <Text style={styles.cardInfo}>and earn assured success fee.</Text>
                </View>
                <Button label="Refer Buyer" size={ButtonSizes.medium} onPress={navigateReferBuyer} />
            </View>
        </View>
    )
}

function ProfileCard({ onLayoutHeight = () => { } }) {
    const navigation = useNavigation();
    const user = useUserStore(state => state.user);

    const handleLayout = (event) => {
        onLayoutHeight(event.nativeEvent.layout.height);
    }

    if (!user) return null;

    return (
        <View onLayout={handleLayout} style={[styles.card, { paddingVertical: 12 }]}>
            <View style={styles.cardSubRow}>
                <AvatarPlaceholder style={styles.userIcon} seed={user.email} />
                <View>
                    <Text style={styles.cardTitle}>Welcome,</Text>
                    <View style={[styles.cardSubRow, { flexWrap: 'wrap', maxWidth: Dimensions.get('window').width - 144 }]}>
                        <Text numberOfLines={1} style={[styles.cardHeading, { marginRight: 8 }]}>{user.name}</Text>
                        {user.verifiedcheck && <VerifiedBadge />}
                    </View>
                    <View style={styles.rowSep} />
                    <Text style={styles.cardLink} onPress={() => navigation.navigate('Profile')}>View Profile &gt;</Text>
                </View>
            </View>
        </View>
    )
}

function BrowseLiveDealsCard() {
    const listLiveDeals = useListLiveDeals(state => state.listLiveDeals);
    const navigation = useNavigation();
    const liveDeals = listLiveDeals?.length || 0;

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [liveDeals]);

    return (
        <View style={[styles.card, { backgroundColor: colors.Secondary, borderBottomColor: colors.Secondary, borderTopColor: colors.Secondary }]}>
            <View style={[styles.cardRow, { alignItems: 'flex-end' }]}>
                <View>
                    <Text style={styles.cardTitle}>Live Deals</Text>
                    {
                        liveDeals === null ?
                            <View style={{ height: 68, justifyContent: 'center', alignItems: 'flex-start', marginLeft: 24 }}>
                                <ActivityIndicator color={colors.Warning} />
                            </View> :
                            <Text style={styles.cardSubtitle}>{Aphrodite.FormatNumbers(liveDeals)}</Text>
                    }
                    <View style={styles.rowSep} />
                    <Text style={styles.cardInfo}>We think these deals</Text>
                    <Text style={styles.cardInfo}>might interest you.</Text>
                    <Button label="Browse Live Deals" size={ButtonSizes.medium} bgStyle={styles.liveDealsButtonStyles} onPress={() => navigation.navigate('Browse')} />
                </View>
                <Image source={require('../../assets/images/summary/LiveDeals.png')} style={styles.cardImage} />
            </View>
        </View>
    )
}

function SummaryPage(props) {
    const navigation = useNavigation();
    const createAlert = useContext(AlertBoxContext);

    const { fetchSummaryPage, loadSummaryPage } = useSummaryPage();
    const { fetchListLiveDeal, loadListLiveDeals } = useListLiveDeals();
    const { fetchSellersList, loadSellersList } = useSellersList();
    const { fetchBuyersList, loadBuyerList } = useBuyersList();
    const { fetchEarningsOverview, loadEarningsOverview } = useEarningsOverview();

    const [profileCardHeight, setProfileCardHeight] = useState(0);

    useFocusEffect(useCallback(() => {
        fetchBuyersList();
        fetchSellersList();
        fetchListLiveDeal();
        fetchSummaryPage();
        fetchEarningsOverview();

        loadListLiveDeals();
        loadSellersList();
        loadBuyerList();
        loadSummaryPage();
        loadEarningsOverview();
    }, []));

    const handleScroll = (event) => {
        event.nativeEvent.contentOffset.y > profileCardHeight * 0.7 ? navigation.setOptions({ userIconShown: true }) : navigation.setOptions({ userIconShown: false });
    }

    return (
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
            <ProfileCard onLayoutHeight={setProfileCardHeight} />
            <NetworkCard />
            <BrowseLiveDealsCard />
            <SellingDealsCard />
            <BuyingDealsCard />
            {/* <EarningsCard /> */}
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

    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        flexWrap: 'wrap'
    },

    cardSubRow: {
        flexDirection: 'row',
        alignItems: 'center',

        marginRight: 8,
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardImage: {
        resizeMode: 'contain',
        height: Dimensions.get('window').width * 0.4,
        width: Dimensions.get('window').width * 0.4,
    },

    cardSubtitle: {
        ...fontSizes.heading_xxlarge,
        color: colors.Black,
        marginRight: 12,
    },

    cardHeading: {
        ...fontSizes.heading_large,
        color: colors.Black,
    },

    cardInfo: {
        ...fontSizes.body_small,
        color: colors.Black,
    },

    cardLink: {
        ...fontSizes.heading_xsmall,
        color: colors.Primary,
    },

    rowSep: {
        height: 8,
    },

    rowSepLarge: {
        height: 16,
    },

    userIcon: {
        width: 96,
        height: 96,

        borderRadius: 48,

        backgroundColor: colors.DarkGray20,

        marginRight: 16,
    },

    liveDealsButtonStyles: {
        backgroundColor: colors.Black,
        borderColor: colors.Black,

        marginLeft: -2,
        marginTop: 16
    }
});

export default SummaryPage;