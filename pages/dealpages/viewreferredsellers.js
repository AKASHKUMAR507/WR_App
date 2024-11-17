import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, DeviceEventEmitter, TouchableOpacity, ActivityIndicator, LayoutAnimation } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import MenuButton from '../../components/atoms/menubutton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DealTypes } from './dealdetails';
import Aphrodite from '../../utilities/aphrodite';
import Chronos from '../../utilities/chronos';
import NoContentFound from '../../components/nocontentfound';
import { ContactCard, ContactTypes, NormaliseContact } from '../bottomnavpages/network';
import AvatarPlaceholder from '../../components/avatarplaceholder';
import { SearchListSheetChild } from '../../components/form_inputs/searchlists';
import { GetSellersList } from '../../network/models/contacts';
import DrawerSheet, { DrawerSheetObject } from '../../components/drawersheet';
import { useDrawerSheetStore, useNetworkModeStore } from '../../stores/stores';
import { NetworkModes } from '../../components/modeselectors';
import useRefreshScreens from '../../hooks/refreshscreens';
import useCurrentDeal from '../../hooks/currentdeal';
import { ReferSeller } from '../../network/models/deals';
import { Alert, AlertBoxContext } from '../../components/alertbox';

function ContactCardListElement({ contact, selected, style }) {
    return (
        <View style={[styles.card, {...style}, selected && { borderBottomColor: colors.DarkGray20, borderTopColor: colors.DarkGray20, backgroundColor: colors.DarkGray20 }]}>
            <AvatarPlaceholder seed={contact.contact.email}/>
            <View style={styles.cardBody}>
                <Text numberOfLines={1} style={styles.cardTitle}>{contact.name}</Text>
                <Text numberOfLines={1} style={styles.cardText}>{contact.company.name}</Text>
            </View>
        </View>
    )
}

const ProvisionalContactStatus = {
    Pending: 'Pending',
    Failed: 'Failed',
}

function ProvisionalContactCard({ contact, dealid, rfqid, onSuccess }) {
    const [status, setStatus] = useState(ProvisionalContactStatus.Pending);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        referSeller();
    }, []);

    const referSeller = async () => {
        if (status === ProvisionalContactStatus.Failed) return;

        try {
            await ReferSeller({ dealid: dealid, rfqid: rfqid, sellerid: contact.id });
            onSuccess();
        }
        catch (error) {
            createAlert(Alert.Error(error.message));

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setStatus(ProvisionalContactStatus.Failed);
        }
    }

    const handleRetry = () => {
        if (status === ProvisionalContactStatus.Pending) return;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setStatus(ProvisionalContactStatus.Pending);
        referSeller();
    }

    return (
        <TouchableOpacity testID={`${contact.name}:contact:provisional`} activeOpacity={0.8} onPress={handleRetry} style={[styles.card, { backgroundColor: colors.LightGray20 }]}>
            <AvatarPlaceholder seed={contact.contact.email}/>
            <View style={styles.cardBody}>
                <Text numberOfLines={1} style={styles.cardTitle}>{contact.name}</Text>
                <Text numberOfLines={1} style={styles.cardText}>{contact.company.name}</Text>
                {
                    status === ProvisionalContactStatus.Failed ?
                    <View style={styles.cardRow}>
                        <Text style={[styles.cardInfo, { color: colors.Error }]}>Failed. Tap to Retry.</Text>
                    </View> :
                    <View style={styles.cardRow}>
                        <ActivityIndicator size={'small'} color={colors.DarkGray80}/>
                        <Text style={[styles.cardInfo, { marginLeft: 8 }]}>Referring Seller</Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
    )
}

function GenerateNormalisedContacts(contacts) {
    const normalisedContacts = contacts.map((contact) => contact = NormaliseContact(contact.sellerDetails, ContactTypes.Seller));
    return normalisedContacts;
}

function ViewReferredSellersPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const refreshScreens = useRefreshScreens();

    const [currentDeal] = useCurrentDeal();
    const currentRFQ = currentDeal.currentRFQ;

    const rfqId = currentRFQ.rfqid;
    const dealId = currentDeal.id;

    const addDrawerSheet = useDrawerSheetStore(state => state.addDrawerSheet);
    const openDrawerSheet = useDrawerSheetStore(state => state.openDrawerSheet);
    const closeDrawerSheet = useDrawerSheetStore(state => state.closeDrawerSheet);
    const removeDrawerSheet = useDrawerSheetStore(state => state.removeDrawerSheet);

    const setNetworkMode = useNetworkModeStore(state => state.setNetworkMode);

    const [sellers, setSellers] = useState([]);
    const [referredSellers, setReferredSellers] = useState(GenerateNormalisedContacts(currentRFQ.referredsellers));

    const [provisionalSellers, setProvisionalSellers] = useState([]);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchSellersList();
    }, [refreshScreens.shouldRefresh]);

    useEffect(() => {
        createUpdateDrawerSheet();
    }, [sellers, referredSellers, provisionalSellers]);

    const fetchSellersList = async () => {
        try {
            const sellersResponse = await GetSellersList();
            const normalisedSellers = sellersResponse.map((seller) => NormaliseContact(seller, ContactTypes.Seller));
            setSellers(normalisedSellers);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const createUpdateDrawerSheet = () => {
        addDrawerSheet(new DrawerSheetObject(
            'referSellerSheet',
            <SearchListSheetChild
                searchable={true}
                label={'Select Seller to Refer'}
                options={sellers}
                value={[...referredSellers, ...provisionalSellers]}
                onValueChange={handleValueChange}
                valueComparator={(option, values) => values.some((value) => value.id === option.id)}
                listHeader={
                    <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
                        <Button label='Add New Seller' size={ButtonSizes.small} onPress={addSeller}/>
                    </View>
                }
                listComponent={<ContactCardListElement />}
                dataKey='contact'
                onSearch={() => {}}
            />,
            () => {},
            () => {},
            true, 
            false
        ));
    }

    const handleAdd = () => {
        openDrawerSheet('referSellerSheet');
    }

    const handleValueChange = (value) => {
        closeDrawerSheet('referSellerSheet');

        if (!referredSellers.some((seller) => seller.id === value.id) && !provisionalSellers.some((seller) => seller.id === value.id)) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setProvisionalSellers([...provisionalSellers, value]);
        }
    }

    const handleReferSuccess = (contact) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setProvisionalSellers(provisionalSellers.filter((seller) => seller.id !== contact.id));
        setReferredSellers([...referredSellers, contact]);

        refreshScreens.scheduleRefreshScreen('DealDetails');
    }

    const addSeller = () => {
        setNetworkMode(NetworkModes.Sellers);
        navigation.navigate('AddContact', { fromScreen: 'ViewReferredSellers' });
    }

    return (
        <React.Fragment>
            {
                [...referredSellers, ...provisionalSellers].length > 0 ?
                <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
                    { provisionalSellers.map((seller, index) => <ProvisionalContactCard key={index} contact={seller} onSuccess={() => handleReferSuccess(seller)} dealid={dealId} rfqid={rfqId}/>) }
                    { referredSellers.map((seller, index) => <ContactCard key={index} contact={seller}/>) }
                </ScrollView> :
                <NoContentFound title={'No Sellers Referred'} message={'Refer Sellers for this RFQ and earn Success Fee. View Fee Sharing Info for more details.'}/>
            } 
            {
                !currentDeal.isInactiveDeal &&
                <React.Fragment>
                    <View style={{ paddingBottom: insets.bottom + 64 }}/>
                    <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                        <Button size={ButtonSizes.medium} label='Refer New Seller' onPress={handleAdd}/>
                    </View>
                </React.Fragment>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    page: {
    },

    card: {
        backgroundColor: colors.White,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 16,
        paddingVertical: 12,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    icon: {
        width: 48,
        height: 48,

        borderRadius: 24,

        backgroundColor: colors.LightGray,
    },

    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',

        marginTop: 8,
    },

    cardBody: {
        marginLeft: 16,
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        maxWidth: 320,
    },

    cardInfo: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
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

export default ViewReferredSellersPage;