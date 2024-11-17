import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, DeviceEventEmitter } from 'react-native';
import PageWrapper from '../../components/pagewrapper';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FormInputAttachments } from '../../components/form_inputs/attachments';
import { useNetworkModeStore } from '../../stores/stores';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import formStyles from '../../styles/formStyles';
import CountryCitySearch from '../../components/countrycitysearch';
import PhoneInput from '../../components/phoneinput';
import useFormState from '../../hooks/formstate';
import useRefreshScreens from '../../hooks/refreshscreens';
import { CreateContact } from '../../network/models/contacts';
import { NetworkModes } from '../../components/modeselectors';
import FormInputWrapper from '../../components/forminputwrapper';
import Themis from '../../utilities/themis';
import { Alert, AlertBoxContext } from '../../components/alertbox';

function ContactTypeFromNetworkMode(networkMode) {
    switch (networkMode) {
        case NetworkModes.Buyers: return 'buyer';
        case NetworkModes.Sellers: return 'seller';
    }
}

const ContactFromValidators = {
    name: Themis.validator
        .addRule(Themis.inputRules.name('Please enter a valid name'))
        .addRule(Themis.stringRules.minLength(2, 'Name must be at least 2 characters long')),

    email: Themis.validator
        .addRule(Themis.inputRules.email('Please enter a valid email address')),

    phone: Themis.validator
        .addRule(Themis.inputRules.phone('Please enter a valid phone number')),

    address: Themis.validator
        .addRule(Themis.inputRules.text('Please enter a valid address')),

    addressOptional: Themis.validator
        .makeOptional()
        .addRule(Themis.inputRules.text('Please enter a valid address')),

    country: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a country')),

    city: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a city')),

    pincode: Themis.validator
        .makeOptional()
        .addRule(Themis.inputRules.pincode('Please enter a valid pincode')),

    companyName: Themis.validator
        .addRule(Themis.inputRules.text('Please enter a valid company name'))
        .addRule(Themis.stringRules.minLength(2, 'Company name must be at least 2 characters long')),

    department: Themis.validator
        .makeOptional()
        .addRule(Themis.inputRules.text('Please enter a valid department')),

    designation: Themis.validator
        .makeOptional()
        .addRule(Themis.inputRules.text('Please enter a valid designation')),

    companyWebsite: Themis.validator
        .makeOptional()
        .addRule(Themis.inputRules.url('Please enter a valid company website')),
}

function AddContactForm(props) {
    const frame = useSafeAreaFrame();
    const navigation = useNavigation();
    const refreshScreens = useRefreshScreens();

    const networkMode = useNetworkModeStore(state => state.networkMode);
    const fromScreen = props.route?.params?.fromScreen || 'Network';

    useLayoutEffect(() => {
        navigation.setOptions({ title: `Refer ${networkMode}` });
    }, []);

    const [loading, setLoading] = useState(false);

    const name = useFormState();
    const email = useFormState();
    const countryCode = useFormState('+91');
    const phone = useFormState();

    const addressLine1 = useFormState();
    const addressLine2 = useFormState();
    const city = useFormState();
    const country = useFormState();
    const pincode = useFormState();

    const companyName = useFormState();
    const department = useFormState();
    const designation = useFormState();
    const companyWebsite = useFormState();
    const attachmentsList = useFormState([]);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        attachValidators();
    }, []);

    const attachValidators = () => {
        name.attachValidator(ContactFromValidators.name);
        email.attachValidator(ContactFromValidators.email);
        phone.attachValidator(ContactFromValidators.phone);

        addressLine1.attachValidator(ContactFromValidators.address);
        addressLine2.attachValidator(ContactFromValidators.addressOptional);
        country.attachValidator(ContactFromValidators.country);
        city.attachValidator(ContactFromValidators.city);
        pincode.attachValidator(ContactFromValidators.pincode);

        companyName.attachValidator(ContactFromValidators.companyName);
        department.attachValidator(ContactFromValidators.department);
        designation.attachValidator(ContactFromValidators.designation);
        companyWebsite.attachValidator(ContactFromValidators.companyWebsite);
    }

    const validateContactForm = () => {
        return name.validate()
        && email.validate()
        && phone.validate()
        && addressLine1.validate()
        && addressLine2.validate()
        && country.validate()
        && city.validate()
        && pincode.validate()
        && companyName.validate()
        && department.validate()
        && designation.validate()
        && companyWebsite.validate();
    }

    const submitContactForm = async () => {
        if (!validateContactForm()) return;

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            await CreateContact({ type: ContactTypeFromNetworkMode(networkMode), name: name.value, mailid: email.value, phoneno: phone.value, countrycode: countryCode.value, addressline1: addressLine1.value, addressline2: addressLine2.value, city: city.value, country: country.value, pincode: pincode.value, compname: companyName.value, department: department.value, designation: designation.value, companywebsite: companyWebsite.value, attachments: attachmentsList.value });

            refreshScreens.scheduleRefreshScreen(fromScreen);
            createAlert(Alert.Success(`${name.value} has been added to your ${networkMode} network.`, `${networkMode} Referred`));
            navigation.navigate(fromScreen);
        }
        catch(error) {
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
                <Text style={formStyles.formSectionTitle}>Contact Details</Text>
                <FormInputWrapper formState={name} component={<FormInputText label='Name' inputType={TextInputTypes.name}/>}/>
                <FormInputWrapper formState={email} component={<FormInputText label='Email Address' inputType={TextInputTypes.email}/>}/>
                <PhoneInput label='Phone Number' formStateCountryCode={countryCode} formStatePhoneNumber={phone}/>
            </View>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Address Details</Text>
                <FormInputWrapper formState={addressLine1} component={<FormInputText label='Address Line 1' inputType={TextInputTypes.text}/>}/>
                <FormInputWrapper formState={addressLine2} component={<FormInputText label='Address Line 2' optional inputType={TextInputTypes.text}/>}/>
                <CountryCitySearch formStateCity={city} formStateCountry={country}/>
                <FormInputWrapper formState={pincode} component={<FormInputText label='Pin Code/Zip Code' optional inputType={TextInputTypes.text} maxLength={16}/>}/>
            </View>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Company Details</Text>
                <FormInputWrapper formState={companyName} component={<FormInputText label='Company Name' inputType={TextInputTypes.text}/>}/>
                <FormInputWrapper formState={department} component={<FormInputText label='Department' optional inputType={TextInputTypes.text}/>}/>
                <FormInputWrapper formState={designation} component={<FormInputText label='Designation' optional inputType={TextInputTypes.text}/>}/>
                <FormInputWrapper formState={companyWebsite} component={<FormInputText label='Company Website' optional inputType={TextInputTypes.url}/>}/>
            </View>
            <FormInputWrapper formState={attachmentsList} component={
                <FormInputAttachments label='Contact Attachments' optional/>
            }/>
            <Button label={`Refer Contact`} spinner={loading} onPress={() => submitContactForm()}/>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
});

export default AddContactForm;