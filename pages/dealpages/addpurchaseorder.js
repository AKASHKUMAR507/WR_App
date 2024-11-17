import { DeviceEventEmitter, LayoutAnimation, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import formStyles from '../../styles/formStyles';
import FormInputWrapper from '../../components/forminputwrapper';
import { SearchList } from '../../components/form_inputs/searchlists';
import AmountInput from '../../components/amountinput';
import useFormState from '../../hooks/formstate';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import { FormInputAttachments } from '../../components/form_inputs/attachments';
import { Button, ButtonSizes, ButtonTypes } from '../../components/atoms/buttons';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import { GetSellersList, SellerForPO } from '../../network/models/contacts';
import AvatarPlaceholder from '../../components/avatarplaceholder';
import colors from '../../styles/colors';
import { useNetworkModeStore } from '../../stores/stores';
import { NetworkModes } from '../../components/modeselectors';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import fontSizes from '../../styles/fonts';
import Themis from '../../utilities/themis';
import { ListBuyingDeals, ListSellingDeals } from '../../network/models/deals';
import DealStatusPill, { StatusTypeFromStatus } from '../../components/dealstatuspill';
import Chronos from '../../utilities/chronos';
import useCurrentDeal from '../../hooks/currentdeal';
import { PoUpload } from '../../network/models/deals';
import useRefreshScreens from '../../hooks/refreshscreens';

const dealsFilters = {
    roletype: { ACTIVE: true, PASSIVE: true },
    dealstatus: { SUBMITTED: true, LIVE: true, QUOTED: true, PO_RELEASED: true, INVOICED: true, PARTIALLY_PAID: true, FULLY_PAID: true, DELIVERED: true, REJECTED: true, LOST: true, SUSPENDED: true }
};

function dealsListObject(deal) {
    return {
        "closingdate": deal.closingdate,
        "createddate": deal.createddate,
        "dealid": deal.dealid,
        "dealname": deal.dealname.replace(/\s+/g, ' ').trim(),
        "dealstatus": deal.dealstatus,
        "roletype": deal.roletype,
        "dealtype": deal.dealtype,
        "description": deal.description.replace(/\s+/g, ' ').trim(),
    }
}

function ContactCard({ contact, selected, style }) {
    return (
        <View style={[styles.card, { ...style }, selected && { borderBottomColor: colors.DarkGray20, borderTopColor: colors.DarkGray20, borderBottomWidth: 1, borderTopWidth: 1 }]}>
            <AvatarPlaceholder seed={contact.sellerid} />
            <View style={styles.cardBody}>
                <Text numberOfLines={1} style={styles.cardTitle}>{contact.sellername}</Text>
                <Text numberOfLines={1} style={styles.cardText}>{contact.compname || 'Delhi India 110006'}</Text>
            </View>
        </View>
    )
}

const PurchaseOrderFormValidation = {
    selectedDeal: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a deal')),
    selectedSeller: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a seller')),
    purchaseOrderAmount: Themis.validator
        .addRule(Themis.inputRules.amount('Please enter a purchase order amount')),
    purchaseOrderNumber: Themis.validator
        .addRule(Themis.inputRules.text('Please enter a purchase order number')),
    uploadPurchaseOrded: Themis.validator
        .addRule(Themis.anyRules.exists('Please select at least one attachment'))
        .addRule(Themis.arrayRules.minLength(1, 'Please select at least one attachment')),
}

const AddPurchaseOrdersPage = () => {
    const navigation = useNavigation()
    const [currentDeal] = useCurrentDeal();
    const chronos = new Chronos()
    const refreshScreens = useRefreshScreens();
    const selectedDeal = useFormState(currentDeal?.id.toString());
    const selectedSeller = useFormState();
    const purchaseCurrency = useFormState("USD");
    const purchaseOrderAmount = useFormState();
    const purchaseOrderNumber = useFormState();
    const attachmentList = useFormState([]);
    const [poSellerList, setSellerPoList] = useState([]);

    const podate = chronos.FormattedDateFromTimestamp(new Date())

    const [loading, setLoading] = useState(false);

    const setNetworkMode = useNetworkModeStore(state => state.setNetworkMode);

    const createAlert = useContext(AlertBoxContext);

    const attachValidators = () => {
        selectedDeal.attachValidator(PurchaseOrderFormValidation.selectedDeal);
        selectedSeller.attachValidator(PurchaseOrderFormValidation.selectedSeller);
        purchaseOrderAmount.attachValidator(PurchaseOrderFormValidation.purchaseOrderAmount);
        purchaseOrderNumber.attachValidator(PurchaseOrderFormValidation.purchaseOrderNumber);
        attachmentList.attachValidator(PurchaseOrderFormValidation.uploadPurchaseOrded);
    }

    const validatePurchaseOrderForm = () => {
        return (selectedDeal.validate())
            && selectedSeller.validate()
            && purchaseOrderAmount.validate()
            && purchaseOrderNumber.validate()
            && attachmentList.validate()
    }

    const po_SellerList = async () => {
        try {
            const response = await SellerForPO(selectedDeal.value);
            console.log(response.data)
            setSellerPoList(response.data)
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        po_SellerList();
        attachValidators();
    }, []);

    const submitPurchaseOrderForm = async () => {
        if (!validatePurchaseOrderForm()) return

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            await PoUpload({ dealid: selectedDeal.value, sellerid: selectedSeller.value.sellerid, poamount: purchaseOrderAmount.value, ponumber: purchaseOrderNumber.value, quoteid: currentDeal.quotationList[0].quotetobuyerid, paymentCurrency: purchaseCurrency.value, attachments: attachmentList.value, podate: podate })

            refreshScreens.scheduleRefreshScreen('DealDetails');
            createAlert(Alert.Success(`Purchase Order has been submitted successfully`, 'Purchase Order Submitted'));
            navigation.navigate('DealDetails', { dealid: currentDeal?.id, role: currentDeal?.dealType });
        } catch (error) {
            createAlert(Alert.Error(error.message));
        } finally {
            setLoading(false);
            DeviceEventEmitter.emit('enableInteraction');
        }
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={formStyles.formContainer} >
            <View style={formStyles.formSection}>
                <FormInputWrapper formState={selectedDeal} component={<FormInputText label='Select Deal' inputType={TextInputTypes.text} editable={false} />} />
            </View>

            <View style={formStyles.formSection}>
                <FormInputWrapper formState={selectedSeller} component={
                    <SearchList
                        label='Select Seller'
                        options={poSellerList}
                        listComponent={<ContactCard style={{ marginHorizontal: 16 }} />}
                        renderComponent={<ContactCard />}
                        dataKey='contact'
                        persistent
                    />
                } />
            </View>
            <AmountInput formStateAmount={purchaseOrderAmount} formStateCurrency={purchaseCurrency} label='Purchase Order Amount' />
            <FormInputWrapper formState={purchaseOrderNumber} component={<FormInputText label='Purchase Order Number' inputType={TextInputTypes.text} />} />

            <FormInputWrapper formState={attachmentList} component={
                <FormInputAttachments label='Upload Purchase Order' />
            } />
            <Button label={`Submit Purchase Order`} spinner={loading} onPress={() => submitPurchaseOrderForm()} />
        </KeyboardAwareScrollView>
    )
}

export default AddPurchaseOrdersPage

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
    idText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },
    cardBodyText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        marginTop: 4,
    },
    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },
    dealCardBody: {
        borderBottomColor: colors.LightGray,

        borderBottomWidth: 1,

        paddingBottom: 16
    },
    dealCardStatusBody: {
        marginVertical: 4,

        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dealIdBody: {
        flexDirection: 'row',

        alignItems: 'center',

        columnGap: 8,
    },
    dealDateBody: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
