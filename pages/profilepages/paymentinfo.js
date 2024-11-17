import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MenuButton from '../../components/atoms/menubutton'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { useBankDetailsStore, useBankType } from '../../stores/fetchstore'

const PaymentInfo = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const setBankType = useBankType(state => state.setBankType);

    const fetchBankDetails = useBankDetailsStore(state => state.fetchBankDetails)

    useEffect(() => {
        fetchBankDetails();
    }, [isFocused])

    const handleBank = () =>{
        setBankType('national');
        navigation.navigate("BankAccount");
    }
    const wireTransfer = () =>{
        setBankType("international");
        navigation.navigate("BankAccount");
    }

    return (
        <View style={styles.container}>
            <MenuButton label='Bank Account' onPress={handleBank} />
            <MenuButton label='T/T or Wire Transfer' onPress={wireTransfer} />
        </View>
    )
}

export default PaymentInfo

const styles = StyleSheet.create({
    container: {
        // marginVertical: 20,
    },
})