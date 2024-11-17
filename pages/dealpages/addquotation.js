import React, { useState, useEffect, createRef, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, DeviceEventEmitter } from 'react-native';
import PageWrapper from '../../components/pagewrapper';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import { Button, ButtonSizes, ButtonTypes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FormInputAttachments } from '../../components/form_inputs/attachments';
import { SearchList } from '../../components/form_inputs/searchlists';
import formStyles from '../../styles/formStyles';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import { FormInputDate } from '../../components/form_inputs/dateinputs';
import { Dropdown } from '../../components/form_inputs/dropdowns';
import { Radio } from '../../components/form_inputs/radios';
import colors from '../../styles/colors';
import { GetBuyersList, GetSellersList } from '../../network/models/contacts';
import AvatarPlaceholder from '../../components/avatarplaceholder';
import { useNetworkModeStore } from '../../stores/stores';
import { NetworkModes } from '../../components/modeselectors';
import CountryCitySearch from '../../components/countrycitysearch';
import useFormState from '../../hooks/formstate';
import { DeliveryTerms, ModesOfPayment } from '../../utilities/apollo';
import { DealTypes } from './dealdetails';
import { CreateQuotation } from '../../network/models/deals';
import useRefreshScreens from '../../hooks/refreshscreens';
import FormInputWrapper from '../../components/forminputwrapper';
import Themis from '../../utilities/themis';
import AmountInput from '../../components/amountinput';
import useCurrentDeal from '../../hooks/currentdeal';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import PaymentTermsInput from '../../components/paymentterms';
import { useSellersList } from '../../stores/fetchstore';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

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

const QuotationFormValidators = {
    selectedBuyingDeal: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a deal')),

    selectedSeller: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a seller')),

    quotationNo: Themis.validator
        .addRule(Themis.inputRules.text('Please enter a valid quotation number'))
        .addRule(Themis.stringRules.minLength(2, 'Quotation number must be at least 2 characters long')),

    quotationValue: Themis.validator
        .addRule(Themis.inputRules.amount('Please enter a valid quotation value')),

    quotationDate: Themis.validator
        .addRule(Themis.anyRules.exists('Please enter a valid quotation date'))
        .addRule(Themis.dateRules.max(tomorrow, 'Quotation date cannot be in the future')),

    quotationValidityDate: Themis.validator
        .addRule(Themis.anyRules.exists('Please enter a valid quotation validity date'))
        .addRule(Themis.dateRules.min(new Date(), 'Quotation should be valid for atleast a day')),

    quotationWarranty: Themis.validator
        .makeOptional()
        .addRule(Themis.inputRules.text('Please enter a valid warranty information'))
        .addRule(Themis.stringRules.minLength(2, 'Warranty information must be at least 2 characters long')),

    deliveryTerms: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a delivery term')),

    deliveryCity: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a delivery city')),

    deliveryCountry: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a delivery country')),

    attachmentList: Themis.validator
        .addRule(Themis.anyRules.exists('Please select at least one attachment'))
        .addRule(Themis.arrayRules.minLength(1, 'Please select at least one attachment')),
}

function AddQuotationForm(props) {
    const frame = useSafeAreaFrame();
    const navigation = useNavigation();
    const refreshScreens = useRefreshScreens();
    const fetchSellerList = useSellersList(state => state.fetchSellersList)
    const sellersList = useSellersList(state => state.sellersList)

    const [currentDeal] = useCurrentDeal();
    const dealidFromStore = currentDeal.id;
    const rfqidFromStore = currentDeal.selectedRFQ.rfqid;

    const [buyingDealsList, setBuyingDealsList] = useState([]);

    const selectedBuyingDeal = useFormState();
    const selectedSeller = useFormState();

    const quotationNo = useFormState();
    const quotationCurrency = useFormState('USD');
    const quotationValue = useFormState();
    const quotationDate = useFormState();
    const quotationValidityDate = useFormState();
    const quotationWarranty = useFormState();

    const paymentTermsRef = useRef(null);

    const deliveryTerms = useFormState();
    const deliveryCity = useFormState();
    const deliveryCountry = useFormState();

    const attachmentList = useFormState([]);

    const [loading, setLoading] = useState(false);

    const setNetworkMode = useNetworkModeStore(state => state.setNetworkMode);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchSellerList();
        attachValidators();

        if (!dealidFromStore) fetchBuyingDealsList();
    }, [refreshScreens.shouldRefresh]);

    const fetchBuyingDealsList = async () => {
        try {

        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const addSeller = () => {
        setNetworkMode(NetworkModes.Sellers);
        navigation.navigate('AddContact', { fromScreen: 'AddQuotation' });
    }

    const attachValidators = () => {
        selectedBuyingDeal.attachValidator(QuotationFormValidators.selectedBuyingDeal);
        selectedSeller.attachValidator(QuotationFormValidators.selectedSeller);

        quotationNo.attachValidator(QuotationFormValidators.quotationNo);
        quotationValue.attachValidator(QuotationFormValidators.quotationValue);
        quotationDate.attachValidator(QuotationFormValidators.quotationDate);
        quotationValidityDate.attachValidator(QuotationFormValidators.quotationValidityDate);
        quotationWarranty.attachValidator(QuotationFormValidators.quotationWarranty);

        deliveryTerms.attachValidator(QuotationFormValidators.deliveryTerms);
        deliveryCity.attachValidator(QuotationFormValidators.deliveryCity);
        deliveryCountry.attachValidator(QuotationFormValidators.deliveryCountry);

        attachmentList.attachValidator(QuotationFormValidators.attachmentList);
    }

    const validateQuotationForm = () => {
        return (dealidFromStore || selectedBuyingDeal.validate())
            && selectedSeller.validate()
            && quotationNo.validate()
            && quotationValue.validate()
            && quotationDate.validate()
            && quotationValidityDate.validate()
            && quotationWarranty.validate()
            && paymentTermsRef.current?.validate()
            && deliveryTerms.validate()
            && deliveryCountry.validate()
            && deliveryCity.validate()
            && attachmentList.validate();
    }

    const submitQutationForm = async () => {
        if (!validateQuotationForm()) return;

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');
            await CreateQuotation({ dealid: dealidFromStore || selectedBuyingDeal.value.id, rfqid: rfqidFromStore, sellerid: selectedSeller.value.sellerid, deliveryterms: deliveryTerms.value, paymentterms: paymentTermsRef.current?.getPaymentTerms(), offervalue: quotationValue.value, offervalidity: quotationValidityDate.value, currency: quotationCurrency.value, warrantydesc: quotationWarranty.value, sellerofferreferencenumber: quotationNo.value, sellerquotationdate: quotationDate.value, destinationcountry: deliveryCountry.value, destinationcity: deliveryCity.value, attachments: attachmentList.value });

            refreshScreens.scheduleRefreshScreen('DealDetails');
            createAlert(Alert.Success(`Quotation ${quotationNo.value} submitted successfully`, 'Quotation Submitted'));
            navigation.navigate('DealDetails', { dealid: dealidFromStore || selectedBuyingDeal.value.id, role: DealTypes.Buying });
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
            {
                !dealidFromStore &&
                <View style={formStyles.formSection}>
                    <Text style={formStyles.formSectionTitle}>Deal Details</Text>
                    <FormInputWrapper formState={selectedBuyingDeal} component={
                        <SearchList
                            label='Select Deal'
                            options={buyingDealsList}
                            listComponent={<ContactCard style={{ marginHorizontal: 16 }} />}
                            renderComponent={<ContactCard />}
                            dataKey='contact'
                        />
                    } />
                </View>
            }
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Seller Details</Text>
                <FormInputWrapper formState={selectedSeller} component={
                    <SearchList
                        label='Select Seller'
                        options={sellersList}
                        listComponent={<ContactCard style={{ marginHorizontal: 16 }} />}
                        listHeader={
                            <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
                                <Button label='Add New Seller' size={ButtonSizes.small} onPress={addSeller} />
                            </View>
                        }
                        renderComponent={<ContactCard />}
                        dataKey='contact'
                        persistent
                    />
                } />
            </View>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Quotation Details</Text>
                <FormInputWrapper formState={quotationNo} component={<FormInputText label='Quotation / Offer Number' inputType={TextInputTypes.text} />} />
                <AmountInput formStateAmount={quotationValue} formStateCurrency={quotationCurrency} label='Quotation Value' />
                <FormInputWrapper formState={quotationDate} component={<FormInputDate label='Seller Quotation Date' maxDateOffsetDays={0} />} />
                <FormInputWrapper formState={quotationValidityDate} component={<FormInputDate label='Quotation Validity' minDateOffsetDays={1} />} />
                <FormInputWrapper formState={quotationWarranty} component={<FormInputText label='Warranty Information' inputType={TextInputTypes.multiline} multiline showCharacterCount maxLength={250} />} />
            </View>
            <View style={formStyles.formSection}>
                <PaymentTermsInput ref={paymentTermsRef} />
            </View>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Delivery Details</Text>
                <FormInputWrapper formState={deliveryTerms} component={<SearchList searchable={false} label='Delivery Terms' options={DeliveryTerms} />} />
                <CountryCitySearch
                    formStateCountry={deliveryCountry}
                    formStateCity={deliveryCity}
                    countryLabel='Select Delivery Country'
                    cityLabel='Select Delivery City/Port'
                    cityPlaceholder='Select City/Port'
                />
            </View>
            <FormInputWrapper formState={attachmentList} component={
                <FormInputAttachments label='Quotation Attachments' />
            } />
            <Button label={`Submit Quotation`} spinner={loading} onPress={() => submitQutationForm()} />
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

export default AddQuotationForm;