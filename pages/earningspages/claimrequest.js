import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import MenuButton from '../../components/atoms/menubutton';
import { Checkbox } from '../../components/form_inputs/checkboxes';
import { Button } from '../../components/atoms/buttons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useBankDetailsStore, useBankType, useViewKeyInfo } from '../../stores/fetchstore';

function ClaimRequestDetails({claimAmount}) {
    const navigation = useNavigation();

    const fetchUser = useViewKeyInfo(state => state.fetchViewKeyInfo);
    const user = useViewKeyInfo(state => state.viewKeyInfo)

    const fetchBankDetails = useBankDetailsStore(state => state.fetchBankDetails);
    const bankDetails = useBankDetailsStore(state => state.bankDetails)

    const loadBankType = useBankType(state => state.loadBankType);
    const bankType = useBankType(state => state.bankType);

    useFocusEffect(useCallback(()=> {
        fetchUser();
        fetchBankDetails();
        loadBankType();
    },[]))
    
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.row}>
                    <Text style={styles.cardText}>Claim Amount</Text>
                    <View style={{ width: 8 }}/>
                    <Text style={styles.cardTextBold}>USD {claimAmount || 0}</Text>
                </View>
            </View>
            <View style={styles.vspace}/>
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Associate Details</Text>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Associate Name</Text>
                    <Text style={styles.cardBodyText}>{user?.name}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Associate ID</Text>
                    <Text style={styles.cardBodyText}>{user?.associateid}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Identity Document</Text>
                    <View style={styles.sectionGroup}>
                        <Text style={styles.cardBodyText}>{user?.iddoctype}</Text>
                        <Text style={styles.cardBodyText}>{user?.idnumber}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Associate Address</Text>
                    <View style={styles.sectionGroup}>
                        <Text style={styles.cardBodyText}>{user?.addressline1}</Text>
                        <Text style={styles.cardBodyText}>{`${user?.addressline2 || ''} ${user?.city}`}</Text>
                        <Text style={styles.cardBodyText}>{`${user?.city} ${user?.country} ${user?.pincode}`}</Text>
                    </View>
                </View>
                <MenuButton label='Update Associate Details' onPress={() => navigation.navigate('ProfileInfo')} />
            </View>
            <View style={styles.vspace}/>
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Payment Details</Text>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Account Number</Text>
                    <Text style={styles.cardBodyText}>{bankDetails?.accountnumber}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Bank Name</Text>
                    <Text style={styles.cardBodyText}>{bankDetails?.bankname}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Bank Address</Text>
                    <View style={styles.sectionGroup}>
                        <Text style={styles.cardBodyText}>{bankDetails?.addressline1}</Text>
                        <Text style={styles.cardBodyText}>{bankDetails?.addressline2}</Text>
                        <Text style={styles.cardBodyText}>{`${bankDetails?.city} ${bankDetails?.country} ${bankDetails?.pin}`}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>{bankType === 'national' ? "IFSC Code" : "SWIFT Code"}</Text>
                    <Text style={styles.cardBodyText}>{bankType === 'national' ? bankDetails?.ifsccode : bankDetails?.swiftcode}</Text>
                </View>
                <MenuButton label='Update Payment Details' onPress={() => navigation.navigate('BankAccount')} />
            </View>
            <View style={styles.vspace}/>
        </View>
    )
}

function ClaimConfirmation() {
    const navigation = useNavigation();

    const [confirmed, setConfirmed] = useState(false);

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.section} activeOpacity={0.8} onPress={() => setConfirmed(!confirmed)}>
                <Checkbox label='' active={confirmed} />
                <Text style={styles.confirmationText}>
                    I hereby declare that the information provided above is correct. WorldRef shall not be held accountable for any loss of the payment due to any discrepancy or mistakes in the above information, or due to any other issue at my end. By checking the 'I Agree' option, I authorise WorldRef to generate an invoice on my behalf.
                </Text>
            </TouchableOpacity>
            <View style={{ padding: 16 }}>
                <Button label='Submit Claim Request' disabled={!confirmed} onPress={() => navigation.navigate('EarningDetailsPostClaim')}/>
            </View>
            <View style={styles.vspace}/>
        </View>
    )
}

function ClaimRequestPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
            <ClaimRequestDetails/>
            <ClaimConfirmation/>
        </ScrollView>   
    )
}

const styles = StyleSheet.create({
    page: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },

    card: {
        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    cardBody: {
        paddingTop: 16,
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,

        paddingHorizontal: 16,
        paddingBottom: 8,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardBodyText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        marginBottom: 4,
    },

    cardTextBold: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    confirmationText: {
        ...fontSizes.body_small,
        color: colors.Black,

        marginRight: 40, 
        marginTop: 4, 
        
        textAlign: 'justify'
    },

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },

    section: {
        borderBottomColor: colors.LightGray,
        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
        borderBottomWidth: 1,

        paddingVertical: 12,
        paddingHorizontal: 16,

        backgroundColor: colors.LightGray20,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    sectionGroup: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',

        marginLeft: 16,
        
        flex: 1
    },
});

export default ClaimRequestPage;