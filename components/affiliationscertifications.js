import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import inputStyles from './form_inputs/inputStyles';
import VectorImage from 'react-native-vector-image';
import { FormInputText } from './form_inputs/inputs';
import { AlertBoxContext } from './alertbox';
import Themis from '../utilities/themis';
import { Checkbox } from './form_inputs/checkboxes';
import { FormInputDate } from './form_inputs/dateinputs';
import { useUserStore } from '../stores/stores';
import { useSocialProfileStore } from '../stores/fetchstore';

const SocialProfileValidation = {
    inputValue: Themis.validator
        .addRule(Themis.inputRules.text()),
}

let inputValueLength;

function ValidateSocialProfile(inputValue) {
    const inputValueValidation = SocialProfileValidation.inputValue.validate(inputValue);
    if (!inputValueValidation.isValid) return inputValueValidation;

    return Themis.validResponse;
}

const mapCertifications = (certifications) => {
    return certifications?.map((item) => ({
        cretid: item?.cretid || '',
        associateid: item?.associateid || '',
        certification: item?.certification,
        organization: item?.organization,
        issueDate: item.issueDate ? new Date(item.issueDate) : '',
        credentialId: item?.credentialId,
        credentialUrl: item?.credentialUrl
    })) || [];
};

function AffiliationsCertificationsFormInput({ index, handleRemove, inputValue, inputTypes, onChangeValue }) {
    const handleNameChange = (value) => onChangeValue({ ...inputValue, certification: value })
    const handleIssueOrgChange = (value) => onChangeValue({ ...inputValue, organization: value });
    const handleIssueDateChange = (value) => onChangeValue({ ...inputValue, issueDate: value }, true);
    const handleCredentialIdChange = (value) => onChangeValue({ ...inputValue, credentialId: value });
    const handleCredentialURL = (value) => onChangeValue({ ...inputValue, credentialUrl: value });

    return (
        <React.Fragment>
            <View style={{ height: 16 }} />
            <View style={styles.FormInputWrapper}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.detailsWrapper}>
                        <FormInputText value={inputValue.certification} onChange={handleNameChange} label={"Name"} placeholder={'Ex: Microsoft certified'} inputType={inputTypes} scrollIntoViewOnFocus={false} />
                        <FormInputText value={inputValue.organization} onChange={handleIssueOrgChange} label={"Issing organization"} placeholder={'Ex: Microsoft'} inputType={inputTypes} scrollIntoViewOnFocus={false} />
                        <FormInputDate value={inputValue.issueDate} onChange={handleIssueDateChange} label='Issue date' />
                        <FormInputText value={inputValue.credentialId} onChange={handleCredentialIdChange} label={'Credential ID'} inputType={inputTypes} scrollIntoViewOnFocus={false} />
                        <FormInputText value={inputValue.credentialUrl} onChange={handleCredentialURL} label={'Credential URL'} inputType={inputTypes} scrollIntoViewOnFocus={false} />
                    </View>

                    <View>
                        {
                            inputValueLength > 1 && (
                                <TouchableOpacity testID={`${index}:remove`} activeOpacity={0.8} style={styles.removeButton} onPress={() => handleRemove()}>
                                    <VectorImage source={require('../assets/icons/trash.svg')} />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            </View>
            <View style={{ height: 24 }} />
        </React.Fragment>
    )
};

const AffiliationsCertificationsForm = forwardRef(({ label = 'Label', inputTypes, inputLabel }, ref) => {
    const { socialProfile } = useSocialProfileStore();

    // const [inputValue, setInputValue] = useState(
    //     socialProfile?.certifications?.map((item) => (
    //         {
    //             cretid: item?.cretid || '',
    //             associateid: item?.associateid || '',
    //             certification: item?.certification,
    //             organization: item?.organization,
    //             issueDate: item.issueDate ? new Date(item.issueDate) : '',
    //             credentialId: item?.credentialId,
    //             credentialUrl: item?.credentialUrl
    //         }
    //     )) || []
    // );
    const [inputValue, setInputValue] = useState(mapCertifications(socialProfile?.certifications));

    const [error, setError] = useState(null);

    const createAlert = useContext(AlertBoxContext);

    inputValueLength = inputValue.length;

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (error) setError(null);
    }, [inputValue]);


    useImperativeHandle(ref, () => ({
        validate: validate,
        getInputValue: getInputValue,
    }))

    const handleAdd = () => setInputValue([...inputValue, { certification: null }]);
    const handleRemove = (index) => setInputValue(inputValue.filter((item, i) => i != index));
    const handleValueChange = (index, value) => setInputValue(inputValue.map((item, i) => i === index ? value : item));

    const validate = () => {
        const validationResponse = ValidateSocialProfile(inputValue);
        if (validationResponse.isValid) return true;

        setError(validationResponse.message);
        createAlert(Alert.Error(validationResponse.message, 'Input Error'));
        return false;
    };

    const getInputValue = () => inputValue;

    return (
        <React.Fragment>
            <View style={{ paddingVertical: 8 }}>
                <View style={styles.titleSection}>
                    <Text style={inputStyles.inputLabel}>{label}</Text>
                    {
                        inputValue.length < 10 &&
                        <TouchableOpacity testID={`socialprofile:add`} activeOpacity={0.8} style={{}} onPress={() => handleAdd()}>
                            <VectorImage source={require('../assets/icons/plus-circle.svg')} />
                        </TouchableOpacity>
                    }
                </View>
                {inputValue.map((inputValue, index) => (
                    <AffiliationsCertificationsFormInput
                        key={index}
                        index={index}
                        inputTypes={inputTypes}
                        inputValue={inputValue}
                        handleRemove={() => handleRemove(index)}
                        onChangeValue={(value) => handleValueChange(index, value)}
                    />
                ))}
                {error && <Text style={inputStyles.error}>{error}</Text>}
            </View>
        </React.Fragment>
    )
})

export default AffiliationsCertificationsForm

const styles = StyleSheet.create({
    titleSection: {
        flexDirection: 'row',

        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    FormInputWrapper: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between',
    },

    detailsWrapper: {
        flex: 1,
    },

    removeButton: {
        alignItems: 'center',
        justifyContent: 'center',

        marginLeft: 16,
        paddingTop: 8,
    },
});