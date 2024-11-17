import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import formStyles from '../../styles/formStyles';
import FormInputWrapper from '../../components/forminputwrapper';
import { SearchList } from '../../components/form_inputs/searchlists';
import AmountInput from '../../components/amountinput';
import useFormState from '../../hooks/formstate';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import { FormInputAttachments } from '../../components/form_inputs/attachments';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import useRefreshScreens from '../../hooks/refreshscreens';
import { GetSellersList } from '../../network/models/contacts';
import AvatarPlaceholder from '../../components/avatarplaceholder';
import colors from '../../styles/colors';
import { useNetworkModeStore } from '../../stores/stores';
import { NetworkModes } from '../../components/modeselectors';
import { useNavigation } from '@react-navigation/native';
import fontSizes from '../../styles/fonts';
import Themis from '../../utilities/themis';
import { AddInvoice, ListBuyingDeals } from '../../network/models/deals';
import useCurrentDeal from '../../hooks/currentdeal';
import Chronos from '../../utilities/chronos';


function ContactCard({ contact, selected, style }) {
    return (
        <View style={[styles.card, { ...style }, selected && { borderBottomColor: colors.DarkGray20, borderTopColor: colors.DarkGray20, borderBottomWidth: 1, borderTopWidth: 1 }]}>
            <AvatarPlaceholder seed={contact.mailid} />
            <View style={styles.cardBody}>
                <Text numberOfLines={1} style={styles.cardTitle}>{contact.sellername}</Text>
                <Text numberOfLines={1} style={styles.cardText}>{contact.compname}</Text>
            </View>
        </View>
    )
}

const PurchaseOrderFormValidation = {
    selectedDeal: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a deal')),
    selectedSeller: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a seller')),
    invoiceAmount: Themis.validator
        .addRule(Themis.inputRules.amount('Please enter a invoice amount')),
    invoiceNumber: Themis.validator
        .addRule(Themis.inputRules.text('Please enter a invoice number')),
    uploadInvoice: Themis.validator
        .addRule(Themis.anyRules.exists('Please select at least one attachment'))
        .addRule(Themis.arrayRules.minLength(1, 'Please select at least one attachment')),
}

const AddInvoices = () => {
    const [currentDeal] = useCurrentDeal();
    const chronos = new Chronos();

    const navigation = useNavigation()

    const refreshScreens = useRefreshScreens();

    const selectedDeal = useFormState(currentDeal?.id.toString());
    const selectedSeller = useFormState();
    const invoiceCurrency = useFormState("USD");
    const invoiceAmount = useFormState();
    const invoiceNumber = useFormState();
    const attachmentList = useFormState([]);
    const [sellerList, setSellerList] = useState([]);
    const invoiceDate = new Date();

    const [loading, setLoading] = useState(false);

    const setNetworkMode = useNetworkModeStore(state => state.setNetworkMode);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchSellerList();
        attachValidators();
    }, [refreshScreens.shouldRefresh]);

    const attachValidators = () => {
        selectedDeal.attachValidator(PurchaseOrderFormValidation.selectedDeal);
        selectedSeller.attachValidator(PurchaseOrderFormValidation.selectedSeller);
        invoiceAmount.attachValidator(PurchaseOrderFormValidation.invoiceAmount);
        invoiceNumber.attachValidator(PurchaseOrderFormValidation.invoiceNumber);
        attachmentList.attachValidator(PurchaseOrderFormValidation.uploadInvoice);
    }

    const validateInvoiceForm = () => {
        return (selectedDeal.validate())
            && selectedSeller.validate()
            && invoiceAmount.validate()
            && invoiceNumber.validate()
            && attachmentList.validate()
    }

    const fetchSellerList = async () => {
        try {
            const sellerListResponse = await GetSellersList();
            setSellerList(sellerListResponse);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const submitInvoiceForm = async () => {
        if(!validateInvoiceForm()) return

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            await AddInvoice({ dealid: selectedDeal.value, sellerid: selectedSeller.value.sellerid, invoiceamount: invoiceAmount.value, invoicenumber: invoiceNumber.value, invoicedate: new Date(), paymentCurrency: invoiceCurrency.value, attachments: attachmentList.value, })
            refreshScreens.scheduleRefreshScreen('DealDetails');
            createAlert(Alert.Success(`Invoice has been submitted successfully`, 'Invoice Submitted'));
            navigation.navigate('DealDetails', { dealid: currentDeal?.id, role: currentDeal?.dealType });
        } catch (error) {
            createAlert(Alert.Error(error.message));
            console.log(error)
        } finally {
            setLoading(false);
            DeviceEventEmitter.emit('enableInteraction');
        }
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={formStyles.formContainer} >
            <View style={formStyles.formSection}>
                <FormInputWrapper formState={selectedDeal} component={<FormInputText label='Select Deal' inputType={TextInputTypes.text} editable={false} /> } />
            </View>

            <View style={formStyles.formSection}>
                <FormInputWrapper formState={selectedSeller} component={
                    <SearchList
                        label='Select Seller'
                        options={sellerList}
                        listComponent={<ContactCard style={{ marginHorizontal: 16 }} />}
                        renderComponent={<ContactCard />}
                        dataKey='contact'
                        persistent
                    />
                } />
            </View>
            <AmountInput formStateAmount={invoiceAmount} formStateCurrency={invoiceCurrency} label='Invoice Amount' />
            <FormInputWrapper formState={invoiceNumber} component={<FormInputText label='Invoice Number' inputType={TextInputTypes.text} />} />

            <FormInputWrapper formState={attachmentList} component={
                <FormInputAttachments label='Upload  Invoice' />
            } />
            <Button label={`Submit Invoice`} spinner={loading} onPress={() => submitInvoiceForm()} />
        </KeyboardAwareScrollView>
    )

}

export default AddInvoices

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