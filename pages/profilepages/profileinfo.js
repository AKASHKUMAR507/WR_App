import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, DeviceEventEmitter, ActivityIndicator, LayoutAnimation } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import { useUserStore } from '../../stores/stores';
import AvatarPlaceholder from '../../components/avatarplaceholder';
import formStyles from '../../styles/formStyles';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import useFormState from '../../hooks/formstate';
import useRefreshScreens from '../../hooks/refreshscreens';
import Themis from '../../utilities/themis';
import FormInputWrapper from '../../components/forminputwrapper';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import CountryCitySearch from '../../components/countrycitysearch';
import PhoneInput from '../../components/phoneinput';
import { Button } from '../../components/atoms/buttons';
import { SearchList } from '../../components/form_inputs/searchlists';
import { FormInputAttachments } from '../../components/form_inputs/attachments';
import { IdentityDocumentTypes } from '../../utilities/apollo';
import { DownloadFile } from '../../network/models/files';
import { AddProfileInfo } from '../../network/models/user';
import RNFS from 'react-native-fs';

const ProfileFormValidators = {
    name: Themis.validator
        .addRule(Themis.inputRules.name('Please enter a valid name'))
        .addRule(Themis.stringRules.minLength(2, 'Name must be at least 2 characters long')),

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

    identityDocumentNumber: Themis.validator
        .makeOptional()
        .addRule(Themis.inputRules.text('Please enter a valid identity document number')),

    identityDocument: Themis.validator
        .addRule(Themis.arrayRules.minLength(1, 'Please attach an identity document'))
}

function ProfileInfoPage(props) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const refreshScreens = useRefreshScreens();

    const user = useUserStore(state => state.user);

    const [loading, setLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const onValueChange = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setHasUnsavedChanges(true);
    }

    const name = useFormState(user.name, onValueChange);
    const countryCode = useFormState(user.extcountry || '+91', onValueChange);
    const phone = useFormState(user.mobilenumber, onValueChange);

    const addressLine1 = useFormState(user.addressline1, onValueChange);
    const addressLine2 = useFormState(user.addressline2, onValueChange);
    const country = useFormState(user.country, onValueChange);
    const city = useFormState(user.city, onValueChange);
    const pincode = useFormState(user.pincode, onValueChange);

    const companyName = useFormState(user.company, onValueChange);
    const department = useFormState(user.department, onValueChange);
    const designation = useFormState(user.designation, onValueChange);
    const companyWebsite = useFormState(user.website, onValueChange);

    const identityDocumentType = useFormState(user.iddoctype, onValueChange);
    const identityDocumentNumber = useFormState(user.idnumber, onValueChange);
    const identityDocument = useFormState([], onValueChange);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        attachValidators();
        attachCurrentIDDocument();
    }, []);

    const attachCurrentIDDocument = async () => {
        try {
            if (!user.idcardfileid) return;

            const file = await DownloadFile(user.idcardfileid, user.idcardoriginalfile);
            identityDocument.onChangeValue([{ name: user.idcardoriginalfile, uri: file.path, size: file.size }], true);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const attachValidators = () => {
        name.attachValidator(ProfileFormValidators.name);
        phone.attachValidator(ProfileFormValidators.phone);

        addressLine1.attachValidator(ProfileFormValidators.address);
        addressLine2.attachValidator(ProfileFormValidators.addressOptional);
        country.attachValidator(ProfileFormValidators.country);
        city.attachValidator(ProfileFormValidators.city);
        pincode.attachValidator(ProfileFormValidators.pincode);

        companyName.attachValidator(ProfileFormValidators.companyName);
        department.attachValidator(ProfileFormValidators.department);
        designation.attachValidator(ProfileFormValidators.designation);
        companyWebsite.attachValidator(ProfileFormValidators.companyWebsite);

        identityDocumentNumber.attachValidator(ProfileFormValidators.identityDocumentNumber);
        identityDocument.attachValidator(ProfileFormValidators.identityDocument);
    }

    const validateProfileForm = () => {
        return name.validate()
            && phone.validate()
            && addressLine1.validate()
            && addressLine2.validate()
            && country.validate()
            && city.validate()
            && pincode.validate()
            && companyName.validate()
            && department.validate()
            && designation.validate()
            && companyWebsite.validate()
            && identityDocumentNumber.validate()
            && (user.idcardfileid && identityDocument.validate());
    }

    const submitProfileForm = async () => {
        if (!validateProfileForm()) return;

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            const attachments = identityDocument.value[0].uri.includes(RNFS.CachesDirectoryPath) ? [] : identityDocument.value;
            await AddProfileInfo({ name: name.value, mobile_ext: countryCode.value, mobilenumber: phone.value, addressline1: addressLine1.value, addressline2: addressLine2.value, country: country.value, city: city.value, pincode: pincode.value, company: companyName.value, department: department.value, designation: designation.value, website: companyWebsite.value, iddoctype: identityDocumentType.value, idnumber: identityDocumentNumber.value, attachments: attachments });

            createAlert(Alert.Success('Profile updated successfully'));
            refreshScreens.scheduleRefreshScreen('Profile');
            navigation.goBack();
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
            <KeyboardAwareScrollView contentContainerStyle={[formStyles.formContainer, Platform.select({ ios: {}, android: { paddingBottom: insets.bottom ? insets.bottom + 32 : 16 } })]}>
                <View style={styles.imageSection}>
                    <AvatarPlaceholder style={styles.profileImage} seed={user.email} />
                </View>
                <View style={formStyles.formSection}>
                    <Text style={formStyles.formSectionTitle}>Personal Details</Text>
                    <FormInputWrapper formState={name} component={<FormInputText label='Name' inputType={TextInputTypes.name} />} />
                    <FormInputText label='Email Address' value={user.email} inputType={TextInputTypes.email} editable={false} />
                    <PhoneInput label='Phone Number' formStateCountryCode={countryCode} formStatePhoneNumber={phone} />
                </View>
                <View style={formStyles.formSection}>
                    <Text style={formStyles.formSectionTitle}>Address Details</Text>
                    <FormInputWrapper formState={addressLine1} component={<FormInputText label='Address Line 1' inputType={TextInputTypes.text} />} />
                    <FormInputWrapper formState={addressLine2} component={<FormInputText label='Address Line 2' optional inputType={TextInputTypes.text} />} />
                    <CountryCitySearch formStateCity={city} formStateCountry={country} cityPrefill={user.city} />
                    <FormInputWrapper formState={pincode} component={<FormInputText label='Pin Code/Zip Code' optional inputType={TextInputTypes.text} maxLength={16} />} />
                </View>
                <View style={formStyles.formSection}>
                    <Text style={formStyles.formSectionTitle}>Company Details</Text>
                    <FormInputWrapper formState={companyName} component={<FormInputText label='Company Name' inputType={TextInputTypes.text} />} />
                    <FormInputWrapper formState={department} component={<FormInputText label='Department' optional inputType={TextInputTypes.text} />} />
                    <FormInputWrapper formState={designation} component={<FormInputText label='Designation' optional inputType={TextInputTypes.text} />} />
                    <FormInputWrapper formState={companyWebsite} component={<FormInputText label='Company Website' optional inputType={TextInputTypes.url} />} />
                </View>
                <View style={formStyles.formSection}>
                    <Text style={formStyles.formSectionTitle}>Identity Document</Text>
                    <FormInputWrapper formState={identityDocumentType} component={<SearchList label='Identity Document Type' optional options={IdentityDocumentTypes} />} />
                    <FormInputWrapper formState={identityDocumentNumber} component={<FormInputText label='Identity Document Number' optional inputType={TextInputTypes.text} />} />
                    <FormInputWrapper formState={identityDocument} component={<FormInputAttachments label='Identity Document' optional maxLength={1} />} />
                </View>
            </KeyboardAwareScrollView>
            {
                hasUnsavedChanges &&
                <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                    <Button label={`Save Profile Info Changes`} spinner={loading} onPress={() => submitProfileForm()} />
                </View>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    imageSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    profileImage: {
        width: 96,
        height: 96,
        borderRadius: 48,

        backgroundColor: colors.DarkGray20,
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 8,
    },

    buttonContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
    },
});

export default ProfileInfoPage;