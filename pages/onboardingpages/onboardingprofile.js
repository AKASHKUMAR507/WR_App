import React, { useState, useEffect, createRef, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, DeviceEventEmitter } from 'react-native';
import { Button, ButtonSizes, ButtonTypes } from '../../components/atoms/buttons';
import formStyles from '../../styles/formStyles';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FormInputWrapper from '../../components/forminputwrapper';
import useFormState from '../../hooks/formstate';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import PhoneInput from '../../components/phoneinput';
import { IdentityDocumentTypes } from '../../utilities/apollo';
import { SearchList } from '../../components/form_inputs/searchlists';
import { FormInputAttachments } from '../../components/form_inputs/attachments';
import { useCurrentOnboardingPageStore, useOnboardingInfoStore, useUserStore } from '../../stores/stores';
import { OnboardingPages } from '../../components/headeronboarding';
import Themis from '../../utilities/themis';

const OnboardingProfileValidators = {
    name: Themis.validator
        .addRule(Themis.inputRules.name('Please enter a valid name'))
        .addRule(Themis.stringRules.minLength(2, 'Name must be at least 2 characters long')),

    phone: Themis.validator
        .addRule(Themis.inputRules.phone('Please enter a valid phone number'))
}

function OnboardingProfilePage(props) {
    const navigation = useNavigation();

    const name = useFormState();
    const countryCode = useFormState();
    const phone = useFormState();

    const setCurrentOnboardingPage = useCurrentOnboardingPageStore(state => state.setCurrentOnboardingPage);
    
    const addOnboardingInfo = useOnboardingInfoStore(state => state.addOnboardingInfo);
    const onboardingInfo = useOnboardingInfoStore(state => state.onboardingInfo);

    const user = useUserStore(state => state.user);

    useFocusEffect(useCallback(() => {
        setCurrentOnboardingPage(OnboardingPages.Profile);
    }, []));

    useEffect(() => {
        prefillValues();
        attachValidators();
    }, []);

    const attachValidators = () => {
        name.attachValidator(OnboardingProfileValidators.name);
        phone.attachValidator(OnboardingProfileValidators.phone);
    }

    const prefillValues = () => {
        name.onChangeValue(onboardingInfo.name || user.name);
        phone.onChangeValue(onboardingInfo.phone);
        countryCode.onChangeValue(onboardingInfo.countryCode || '+91');
    }

    const validateOnboardingProfileForm = () => {
        return name.validate()
        && phone.validate()
    }

    const submitOnboardingProfileForm = () => {
        if (!validateOnboardingProfileForm()) return;

        addOnboardingInfo({
            name: name.value,
            email: user.email,
            phone: phone.value,
            countryCode: countryCode.value,
        });

        navigation.navigate('OnboardingAddress');
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={[formStyles.formContainer, { flexGrow: 1, justifyContent: 'space-between' }]}>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Personal Information</Text>
                <FormInputWrapper formState={name} component={<FormInputText label='Name' inputType={TextInputTypes.name}/>}/>
                <FormInputText editable={false} label='Email Address' value={user.email}/>
                <PhoneInput label='Phone Number' formStateCountryCode={countryCode} formStatePhoneNumber={phone}/>
            </View>
            <Button label='Continue' onPress={() => submitOnboardingProfileForm()}/>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
});

export default OnboardingProfilePage;