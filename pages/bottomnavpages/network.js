import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, TouchableOpacity, LayoutAnimation, DeviceEventEmitter } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import shadows from '../../styles/shadows';
import { NetworkModeSelector, NetworkModes } from '../../components/modeselectors';
import { useNetworkModeStore } from '../../stores/stores';
import NoContentFound from '../../components/nocontentfound';
import { FlashList } from '@shopify/flash-list';
import { GetBuyersList, GetSellersList } from '../../network/models/contacts';
import SkeletonContainer from '../../components/skeletons';
import AvatarPlaceholder from '../../components/avatarplaceholder';
import useRefreshScreens from '../../hooks/refreshscreens';
import { Alert, AlertBoxContext } from '../../components/alertbox';

const ContactTypes = {
    Buyer: 'Buyer',
    Seller: 'Seller'
}

function NormaliseContact(contact, contactType) {
    if (!contact) return null;

    return {
        type: contactType,
        id: contactType === ContactTypes.Buyer ? contact.buyerid : contact.sellerid,
        name: contactType === ContactTypes.Buyer ? contact.buyername : contact.sellername,
        contact: {
            email: contact.mailid,
            countryCode: contact.countrycode,
            mobile: contact.phoneno,
        },
        address: {
            line1: contact.addressline1,
            line2: contact.addressline2,
            city: contact.city,
            country: contact.country,
            pincode: contact.pincode,
        },
        company: {
            name: contact.compname,
            department: contact.department,
            designation: contact.designation,
            website: contact.website,
        },
        attachments: contactType === ContactTypes.Buyer ? contact.buyerAttachments || [] : contact.sellerAttachments || [],
    }
}

const ContactCardSkeletonData = { name: '', contact: { email: '' }, company: { name: '' } };

function ContactCard({ contact }) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity testID={`${contact.name}:contact`} style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('ContactDetails', { contact: contact })}>
            <AvatarPlaceholder seed={contact.contact.email}/>
            <View style={styles.cardBody}>
                <Text numberOfLines={1} style={styles.cardTitle}>{contact.name}</Text>
                <Text numberOfLines={1} style={styles.cardText}>{contact.company.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

function ContactsListContainer({ contactsList }) {
    return (
        contactsList ?
        ( 
            contactsList.length > 0 ? 
            <FlashList data={contactsList} renderItem={({ item }) => <ContactCard contact={item}/>} estimatedItemSize={112} showsVerticalScrollIndicator={false}/> : 
            <NoContentFound title={'No Contacts Found'} message={'Could not find any contacts matching your current preferences.'}/>
        ) :
        <SkeletonContainer childcount={20} child={<ContactCard contact={ContactCardSkeletonData}/>}/>
    )
}

function NetworkPage(props) {
    const navigation = useNavigation();
    const refreshScreens = useRefreshScreens();

    const networkMode = useNetworkModeStore(state => state.networkMode);
    const setNetworkMode = useNetworkModeStore(state => state.setNetworkMode);

    const createAlert = useContext(AlertBoxContext);

    const [contactsList, setContactsList] = useState();

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        networkMode === NetworkModes.Buyers ? fetchBuyersList() : fetchSellersList();
    }, [networkMode, refreshScreens.shouldRefresh]);

    const fetchBuyersList = async () => {
        setContactsList();

        try {
            const buyerList = await GetBuyersList();
            normaliseContactsList(buyerList, ContactTypes.Buyer);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const fetchSellersList = async () => {
        setContactsList();

        try {
            const sellerList = await GetSellersList();
            normaliseContactsList(sellerList, ContactTypes.Seller);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const normaliseContactsList = (contactsList, contactType) => {
        const normalisedContactList = [];
        contactsList.map((contact) => normalisedContactList.push(NormaliseContact(contact, contactType)));
        setContactsList([...normalisedContactList]);
    }

    return (
        <React.Fragment>
            <NetworkModeSelector mode={networkMode} onChangeMode={(mode) => setNetworkMode(mode)}/>
            <ContactsListContainer contactsList={contactsList}/>  
            <View style={{ height: 64 }}/>
            <View style={styles.buttonContainer}>
                <Button size={ButtonSizes.medium} label={`Refer ${networkMode}`} onPress={() => navigation.navigate('AddContact')}/>
            </View>
        </React.Fragment> 
    )
}

const styles = StyleSheet.create({
    page: {
    },

    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 12,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,

        flexDirection: 'row',
        alignItems: 'center',
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

export default NetworkPage;
export { ContactTypes, NormaliseContact, ContactCard };