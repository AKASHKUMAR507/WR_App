import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import MenuButton from '../../components/atoms/menubutton';
import { useBankDetailsStore, useBankType, useViewKeyInfo } from '../../stores/fetchstore';

function EarningDetailsPostClaim(props) {
    const navigation = useNavigation();

    const fetchViewKeyInfo = useViewKeyInfo(state => state.fetchViewKeyInfo);
    const fetchBankDetails = useBankDetailsStore(state => state.fetchBankDetails);
    const loadBankType = useBankType(state => state.loadBankType);

    const user = useViewKeyInfo(state => state.viewKeyInfo)
    const bankDetails = useBankDetailsStore(state => state.bankDetails)
    const bankType = useBankType(state => state.bankType);

    const associateName = user?.name
    const associateID = user?.associateid
    const indentityDocType = user?.iddoctype
    const indentityDocNumber = user?.idnumber
    const associateAddress = { addressLine1: user?.addressline1, addressLine2: user?.addressline2, city: user?.city, country: user?.country, pin: user?.pincode }

    const bankName = bankDetails?.bankname
    const accountNumber = bankDetails?.accountnumber
    const ifscCode = bankDetails?.ifsccode
    const swiftCode = bankDetails?.swiftcode
    const bankAddress = { addressLine1: bankDetails?.addressline1, addressLine2: bankDetails?.addressline2, city: bankDetails?.city, country: bankDetails?.country, pin: bankDetails?.pin }

    useFocusEffect(useCallback(() => {
        fetchViewKeyInfo();
        fetchBankDetails();
        loadBankType();
    }, []))

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.row}>
                    <Text style={styles.cardText}>Claim No.</Text>
                    <View style={{ width: 8 }} />
                    <Text style={styles.cardTextBold}>505</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cardText}>Claim Date</Text>
                    <View style={{ width: 8 }} />
                    <Text style={styles.cardTextBold}>26 August, 2023</Text>
                </View>
            </View>
            <View style={styles.vspace} />
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Associate Details</Text>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Associate Name</Text>
                    <Text style={styles.cardBodyText}>{associateName}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Associate ID</Text>
                    <Text style={styles.cardBodyText}>{associateID}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Identity Document</Text>
                    <View style={styles.sectionGroup}>
                        <Text style={styles.cardBodyText}>{indentityDocType}</Text>
                        <Text style={styles.cardBodyText}>{indentityDocNumber}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Associate Address</Text>
                    <View style={styles.sectionGroup}>
                        <Text style={styles.cardBodyText}>{associateAddress.addressLine1}</Text>
                        <Text style={styles.cardBodyText}>{associateAddress.addressLine2}</Text>
                        <Text style={styles.cardBodyText}>{associateAddress.city} {associateAddress.country} {associateAddress.pin} </Text>
                    </View>
                </View>
            </View>
            <View style={styles.vspace} />
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Payment Details</Text>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Account Number</Text>
                    <Text style={styles.cardBodyText}>{accountNumber}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Bank Name</Text>
                    <Text style={styles.cardBodyText}>{bankName}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Bank Address</Text>
                    <View style={styles.sectionGroup}>
                        <Text style={styles.cardBodyText}>{bankAddress.addressLine1}</Text>
                        <Text style={styles.cardBodyText}>{bankAddress.addressLine2}</Text>
                        <Text style={styles.cardBodyText}>{bankAddress.city} {bankAddress.country} {bankAddress.pin}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>{bankType === 'national' ? "IFSC Code" : "SWIFT Code"}</Text>
                    <Text style={styles.cardBodyText}>{bankType === 'national' ? ifscCode : swiftCode}</Text>
                </View>
            </View>
            <View style={styles.vspace} />
           
            {/* <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Transaction Details</Text>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Transaction Method</Text>
                    <Text style={styles.cardBodyText}>Telegraphic Transfer</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Transaction ID</Text>
                    <Text style={styles.cardBodyText}>2019UIC3583</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Transaction Date</Text>
                    <Text style={styles.cardBodyText}>27 July, 2023</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>From Bank</Text>
                    <Text style={styles.cardBodyText}>State Bank of India</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Transaction Amount</Text>
                    <Text style={styles.cardBodyText}>USD 8,234</Text>
                </View>
            </View> */}
       
            <View style={styles.vspace} />
        </View>
    )
}

function EarningDetailsPostClaimPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
            <EarningDetailsPostClaim />
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

export default EarningDetailsPostClaimPage;