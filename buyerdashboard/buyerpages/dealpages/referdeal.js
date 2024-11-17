import React, { useState, useEffect, createRef, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, DeviceEventEmitter } from 'react-native';
import { FormInputText, TextInputTypes } from '../../../components/form_inputs/inputs';
import { Button, ButtonSizes, ButtonTypes } from '../../../components/atoms/buttons';
import fontSizes from '../../../styles/fonts';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FormInputAttachments } from '../../../components/form_inputs/attachments';
import { SearchList } from '../../../components/form_inputs/searchlists';
import formStyles from '../../../styles/formStyles';
import KeyboardAwareScrollView from '../../../components/keyboardawarescrollview';
import { FormInputDate } from '../../../components/form_inputs/dateinputs';
import colors from '../../../styles/colors';
import AvatarPlaceholder from '../../../components/avatarplaceholder';
import CountryCitySearch from '../../../components/countrycitysearch';
import useFormState from '../../../hooks/formstate';
import { CreateDeal } from '../../../network/models/deals';
import { DeliveryTerms } from '../../../utilities/apollo';
import FormInputWrapper from '../../../components/forminputwrapper';
import Themis from '../../../utilities/themis';
import { Alert, AlertBoxContext } from '../../../components/alertbox';
// import LineItemsInput from '../../../components/lineitems';
import useRefreshScreens from '../../../hooks/refreshscreens';

function ContactCard({ contact, selected, style }) {
    return (
        <View style={[styles.card, { ...style }, selected && { borderBottomColor: colors.DarkGray20, borderTopColor: colors.DarkGray20, borderBottomWidth: 1, borderTopWidth: 1 }]}>
            <AvatarPlaceholder seed={contact.mailid} />
            <View style={styles.cardBody}>
                <Text numberOfLines={1} style={styles.cardTitle}>{contact.buyername}</Text>
                <Text numberOfLines={1} style={styles.cardText}>{contact.compname}</Text>
            </View>
        </View>
    )
}

const DealRoles = {
    Active: 'Active',
    Passive: 'Passive'
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const DealFormValidators = {
    dealName: Themis.validator
        .addRule(Themis.inputRules.text('Please enter a valid deal name'))
        .addRule(Themis.stringRules.minLength(5, 'Deal name must be at least 5 characters long')),

    dealDescription: Themis.validator
        .addRule(Themis.inputRules.text('Please enter a valid description'))
        .addRule(Themis.stringRules.minLength(10, 'Description must be at least 10 characters long')),

    dealClosingDate: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a closing date'))
        .addRule(Themis.dateRules.min(tomorrow, 'Deal must be valid for atleast a day')),

    deliveryTerms: Themis.validator
        .addRule(Themis.anyRules.exists('Please select delivery terms')),

    deliveryCity: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a delivery city')),

    deliveryCountry: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a delivery country')),
}

function ReferDealForm(props) {
    const frame = useSafeAreaFrame();
    const navigation = useNavigation();

    const refreshScreens = useRefreshScreens();

    const dealName = useFormState();
    const dealDescription = useFormState();
    const dealClosingDate = useFormState();

    const deliveryTerms = useFormState();
    const deliveryCity = useFormState();
    const deliveryCountry = useFormState();

    const dealRole = useFormState(DealRoles.Active);
    const attachmentList = useFormState([]);

    const [loading, setLoading] = useState(false);
    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        attachValidators();
    }, []);

    const attachValidators = () => {
        dealName.attachValidator(DealFormValidators.dealName);
        dealDescription.attachValidator(DealFormValidators.dealDescription);
        dealClosingDate.attachValidator(DealFormValidators.dealClosingDate);

        deliveryTerms.attachValidator(DealFormValidators.deliveryTerms);
        deliveryCity.attachValidator(DealFormValidators.deliveryCity);
        deliveryCountry.attachValidator(DealFormValidators.deliveryCountry);
    }

    const validateDealForm = () => {
        return dealName.validate()
            && dealDescription.validate()
            && dealClosingDate.validate()
            && deliveryTerms.validate()
            && deliveryCountry.validate()
            && deliveryCity.validate();
    }

    const submitDealForm = async () => {
        if (!validateDealForm()) return;

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            await CreateDeal({ dealname: dealName.value, description: dealDescription.value, closingdate: dealClosingDate.value, deliveryterms: deliveryTerms.value, deliverycity: deliveryCity.value, deliveryplace: deliveryCountry.value, roletype: dealRole.value, attachments: attachmentList.value });
            createAlert(Alert.Success(`Deal ${dealName.value} has been submitted successfully`, 'Deal Submitted'));

            refreshScreens.scheduleRefreshScreen('MyDeals');
            navigation.navigate('MyDeals');
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
        <React.Fragment>
            <KeyboardAwareScrollView contentContainerStyle={formStyles.formContainer}>
                <View style={formStyles.formSection}>
                    <Text style={formStyles.formSectionTitle}>Deal Details</Text>
                    <FormInputWrapper formState={dealName} component={<FormInputText label='Deal Name' inputType={TextInputTypes.text} />} />
                    <FormInputWrapper formState={dealDescription} component={<FormInputText inputType={TextInputTypes.multiline} label='Deal Description' multiline showCharacterCount maxLength={1000} />} />
                    <FormInputWrapper formState={dealClosingDate} component={<FormInputDate label='Deal Closing Date' minDateOffsetDays={1} />} />
                </View>
                <View style={formStyles.formSection}>
                    <Text style={formStyles.formSectionTitle}>Delivery Details</Text>
                    <FormInputWrapper formState={deliveryTerms} component={
                        <SearchList label='Delivery Terms' options={DeliveryTerms} searchable={false} />
                    } />
                    <CountryCitySearch
                        formStateCity={deliveryCity}
                        formStateCountry={deliveryCountry}

                        countryLabel='Select Delivery Country'
                        cityLabel='Select Delivery City/Port'
                        cityPlaceholder='Select City/Port'
                        cityErrorMessage='Please Select a City/Port'
                    />
                </View>
                {/* <View style={formStyles.formSection}>
                    <LineItemsInput />
                </View> */}
                <FormInputWrapper formState={attachmentList} component={
                    <FormInputAttachments label='Deal Attachments' optional />
                } />
                <Button label={`Create Deal`} spinner={loading} onPress={() => submitDealForm()} />
            </KeyboardAwareScrollView>
        </React.Fragment>
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

export default ReferDealForm;