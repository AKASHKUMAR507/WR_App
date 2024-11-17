import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import { DealsCard, DealsCardSkeletonData } from '../bottomnavpages/deals';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContactTypes } from '../bottomnavpages/network';
import { GetBuyerDeals, GetSellerDeals } from '../../network/models/contacts';
import NoContentFound from '../../components/nocontentfound';
import SkeletonContainer from '../../components/skeletons';
import { FlashList } from '@shopify/flash-list';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import useRefreshScreens from '../../hooks/refreshscreens';

function ContactDealsListContainer({ dealsList }) {
    return (
        dealsList ?
        ( 
            dealsList.length > 0 ? 
            <FlashList data={dealsList} renderItem={({ item }) => <DealsCard deal={item}/>} estimatedItemSize={200} showsVerticalScrollIndicator={false}/> : 
            <NoContentFound title={'No Deals Found'} message={'Could not find any deals for this contact.'}/>
        ) :
        <SkeletonContainer child={<DealsCard deal={DealsCardSkeletonData}/>}/>
    )
}

function ContactDealsPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const refreshScreens = useRefreshScreens();

    const contactid = props.route?.params?.id;
    const contactType = props.route?.params?.type;

    const [dealsList, setDealsList] = useState();

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchDealsList();
    }, [refreshScreens.shouldRefresh]);

    const fetchDealsList = async () => {
        try {
            const response = contactType === ContactTypes.Buyer ? await GetBuyerDeals(contactid) : await GetSellerDeals(contactid);
            response.forEach(deal => deal.dealtype = contactType === ContactTypes.Buyer ? 'SELLING' : 'BUYING');
            setDealsList(response);
        }   
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <React.Fragment>
            <ContactDealsListContainer dealsList={dealsList}/>  
            {
                contactType === ContactTypes.Buyer && dealsList &&
                <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                    <Button size={ButtonSizes.medium} label='Create New Deal For Contact' onPress={() => navigation.navigate('ReferDeal', { buyerid: contactid })}/>
                </View>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    page: {
    },

    buttonContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: colors.White,
    },
});

export default ContactDealsPage;