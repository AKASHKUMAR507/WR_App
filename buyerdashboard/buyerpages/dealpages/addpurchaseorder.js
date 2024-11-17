import React, { useState, useEffect, createRef, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, DeviceEventEmitter } from 'react-native';
import { FormInputText, TextInputTypes } from '../../../components/form_inputs/inputs';
import { Button } from '../../../components/atoms/buttons';
import fontSizes from '../../../styles/fonts';
import { useNavigation } from '@react-navigation/native';
import { FormInputAttachments } from '../../../components/form_inputs/attachments';
import formStyles from '../../../styles/formStyles';
import KeyboardAwareScrollView from '../../../components/keyboardawarescrollview';
import colors from '../../../styles/colors';
import useFormState from '../../../hooks/formstate';
// import { DealTypes } from './dealdetails';
import { CreatePurchaseOrder, PoUpload } from '../../../network/models/deals';
import useRefreshScreens from '../../../hooks/refreshscreens';
import FormInputWrapper from '../../../components/forminputwrapper';
import Themis from '../../../utilities/themis';
import AmountInput from '../../../components/amountinput';
import useCurrentDeal from '../../../hooks/currentdeal';
import { Alert, AlertBoxContext } from '../../../components/alertbox';


const PurchaseOrderFormValidators = {
    purchaseOrderNo: Themis.validator
        .addRule(Themis.inputRules.text('Please enter a valid purchase order number'))
        .addRule(Themis.stringRules.minLength(2, 'purchase order number must be at least 2 characters long')),

    purchaseOrderValue: Themis.validator
        .addRule(Themis.inputRules.amount('Please enter a valid purchase order value')),

    attachmentList: Themis.validator
        .addRule(Themis.anyRules.exists('Please select at least one attachment'))
        .addRule(Themis.arrayRules.minLength(1, 'Please select at least one attachment')),
}

function AddPurchaseOrderForm(props) {
    const navigation = useNavigation();
    const refreshScreens = useRefreshScreens();

    const [currentDeal] = useCurrentDeal();
    const dealidFromStore = currentDeal.id;
    
    const quotationid = props.route.params.quotation.quotetobuyerid;
    const sellerid = props.route.params.quotation.sellerid;

    const purchaseOrderNo = useFormState();
    const purchaseOrderCurrency = useFormState('USD');
    const purchaseOrderValue = useFormState();

    const attachmentList = useFormState([]);

    const [loading, setLoading] = useState(false);
    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        attachValidators();
    }, []);

    const attachValidators = () => {
        purchaseOrderNo.attachValidator(PurchaseOrderFormValidators.purchaseOrderNo);
        purchaseOrderValue.attachValidator(PurchaseOrderFormValidators.purchaseOrderValue);

        attachmentList.attachValidator(PurchaseOrderFormValidators.attachmentList);
    }

    const validateQuotationForm = () => {
        return purchaseOrderNo.validate()
            && purchaseOrderCurrency.validate()
            && attachmentList.validate();
    }

    const submitQutationForm = async () => {
        if (!validateQuotationForm()) return;

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            await CreatePurchaseOrder({ poid: purchaseOrderNo.value, dealid: dealidFromStore, sellerid: sellerid, poamount: purchaseOrderValue.value, ponumber: purchaseOrderNo.value, quoteid: quotationid, paymentCurrency: purchaseOrderCurrency.value, attachments: attachmentList.value });

            refreshScreens.scheduleRefreshScreen('PurchaseOrders');
            createAlert(Alert.Success(`Purchase Order ${purchaseOrderNo.value} released successfully`, 'Purchase Order Released'));
            navigation.navigate('PurchaseOrders');
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
        finally {
            setLoading(false);
            DeviceEventEmitter.emit('enableInteraction');
        }
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={formStyles.formContainer}>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Purchase Order Details</Text>
                <FormInputWrapper formState={purchaseOrderNo} component={<FormInputText label='Purchase Order Number' inputType={TextInputTypes.text} />} />
                <AmountInput formStateAmount={purchaseOrderValue} formStateCurrency={purchaseOrderCurrency} label='Purchase Order Value' />
            </View>
            <FormInputWrapper formState={attachmentList} component={
                <FormInputAttachments label='Purchase Order Attachments' />
            } />
            <Button label={`Submit Purchase Order`} spinner={loading} onPress={() => submitQutationForm()} />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.White,

        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 8,
    },

    icon: {
        width: 48,
        height: 48,

        borderRadius: 24,

        backgroundColor: colors.LightGray,
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
});

export default AddPurchaseOrderForm;