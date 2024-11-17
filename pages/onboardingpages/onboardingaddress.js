import React, { useState, useEffect, createRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { Button, ButtonSizes, ButtonTypes } from '../../components/atoms/buttons';
import formStyles from '../../styles/formStyles';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FormInputWrapper from '../../components/forminputwrapper';
import useFormState from '../../hooks/formstate';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import CountryCitySearch from '../../components/countrycitysearch';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCurrentOnboardingPageStore, useOnboardingInfoStore } from '../../stores/stores';
import { OnboardingPages } from '../../components/headeronboarding';
import Themis from '../../utilities/themis';

const OnboardingAddressValidators = {
    addressLine1: Themis.validator
        .addRule(Themis.inputRules.text('Please enter a valid address'))
        .addRule(Themis.stringRules.minLength(2, 'Address must be at least 2 characters long')),

    addressLine2: Themis.validator
        .makeOptional()
        .addRule(Themis.inputRules.text('Please enter a valid address')),

    city: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a city')),

    country: Themis.validator
        .addRule(Themis.anyRules.exists('Please select a country')),

    pincode: Themis.validator
        .addRule(Themis.inputRules.pincode('Please enter a valid pincode')),
}

function OnboardingAddressPage(props) {
    const navigation = useNavigation();

    const addressLine1 = useFormState();
    const addressLine2 = useFormState();

    const city = useFormState();
    const country = useFormState();
    const pincode = useFormState();

    const setCurrentOnboardingPage = useCurrentOnboardingPageStore(state => state.setCurrentOnboardingPage);
    
    const addOnboardingInfo = useOnboardingInfoStore(state => state.addOnboardingInfo);
    const onboardingInfo = useOnboardingInfoStore(state => state.onboardingInfo);

    useFocusEffect(useCallback(() => {
        setCurrentOnboardingPage(OnboardingPages.Address);
    }, []));

    useEffect(() => {
        prefillValues();
        attachValidators();
    }, []);

    const attachValidators = () => {
        addressLine1.attachValidator(OnboardingAddressValidators.addressLine1);
        addressLine2.attachValidator(OnboardingAddressValidators.addressLine2);
        city.attachValidator(OnboardingAddressValidators.city);
        country.attachValidator(OnboardingAddressValidators.country);
        pincode.attachValidator(OnboardingAddressValidators.pincode);
    }

    const prefillValues = () => {
        addressLine1.onChangeValue(onboardingInfo.addressLine1);
        addressLine2.onChangeValue(onboardingInfo.addressLine2);
        city.onChangeValue(onboardingInfo.city);
        country.onChangeValue(onboardingInfo.country);
        pincode.onChangeValue(onboardingInfo.pincode);
    }

    const validateOnboardingAddressForm = () => {
        return addressLine1.validate()
        && addressLine2.validate()
        && country.validate()
        && city.validate()
        && pincode.validate();
    }

    const saveOnboardingAddressForm = () => {
        if (!validateOnboardingAddressForm()) return;

        addOnboardingInfo({
            addressLine1: addressLine1.value,
            addressLine2: addressLine2.value,
            city: city.value,
            country: country.value,
            pincode: pincode.value,
        });

        navigation.navigate('OnboardingIndustries');
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={[formStyles.formContainer, { flexGrow: 1, justifyContent: 'space-between' }]}>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Address Details</Text>
                <FormInputWrapper formState={addressLine1} component={<FormInputText label='Address Line 1' inputType={TextInputTypes.text}/>}/>
                <FormInputWrapper formState={addressLine2} component={<FormInputText label='Address Line 2' inputType={TextInputTypes.text} optional/>}/>
                <CountryCitySearch formStateCity={city} formStateCountry={country} cityPrefill={onboardingInfo.city}/>
                <FormInputWrapper formState={pincode} component={<FormInputText label='Pin Code/Zip Code' inputType={TextInputTypes.text} maxLength={16}/>}/>
            </View>
            <View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={formStyles.formActionContainer}>
                    <Text style={formStyles.formAction}>Return to Profile Information</Text>
                </TouchableOpacity>
                <Button label='Continue' onPress={() => saveOnboardingAddressForm()}/>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
});

export default OnboardingAddressPage;