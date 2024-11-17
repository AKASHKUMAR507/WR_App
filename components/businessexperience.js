import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import inputStyles from './form_inputs/inputStyles';
import VectorImage from 'react-native-vector-image';
import { FormInputText } from './form_inputs/inputs';
import { AlertBoxContext } from './alertbox';
import Themis from '../utilities/themis';
import { Checkbox } from './form_inputs/checkboxes';
import { FormInputDate } from './form_inputs/dateinputs';
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

const mapBusinessExp = (businessExp) => {
    return businessExp?.map((item) => ({
        associateid: item?.associateid || '',
        expid: item?.expid || '',
        experience: item.experience || '',
        companyName: item.companyName || '',
        startDate: item.startDate ? new Date(item.startDate) : '',
        endDate: item.endDate ? new Date(item.endDate) : '',
        description: item.description || '',
    })) || [];
};

function BusinessExperienceFormInput({ index, handleRemove, inputValue, inputTypes, onChangeValue }) {
    const [active, setActive] = useState(false);

    const handleTextChange = (value) => onChangeValue({ ...inputValue, experience: value });
    const handleCompanyNameChanage = (value) => onChangeValue({ ...inputValue, companyName: value })
    const handleStartDateChanage = (value) => onChangeValue({ ...inputValue, startDate: value })
    const handleEndDateChanage = (value) => onChangeValue({ ...inputValue, endDate: value })
    const handleDescriptionChanage = (value) => onChangeValue({ ...inputValue, description: value })

    return (
        <React.Fragment>
            <View style={{ height: 24 }} />
            <View style={styles.FormInputWrapper}>
                <View style={{ flexDirection: 'row' }}>

                    <View style={styles.detailsWrapper}>
                        <FormInputText value={inputValue.experience} onChange={handleTextChange} label={"Title"} placeholder={'Ex: Retails Sales Manager'} inputType={inputTypes} scrollIntoViewOnFocus={false} />
                        <FormInputText value={inputValue.companyName} onChange={handleCompanyNameChanage} label={'Company name'} placeholder={'Ex: Worldref'} inputType={inputTypes} scrollIntoViewOnFocus={false} />
                        <Checkbox active={active} onToggle={() => setActive(!active)} label='I am currently working in this role' />
                        <FormInputDate value={inputValue.startDate} onChange={handleStartDateChanage} label='Start date' />

                        {!active && (
                            <FormInputDate value={inputValue.endDate} onChange={handleEndDateChanage} label='End date' />
                        )}

                        <FormInputText value={inputValue.description} onChange={handleDescriptionChanage} label={'Description'} placeholder={'Ex: Retail'} inputType={inputTypes} scrollIntoViewOnFocus={false} multiline maxLength={2000} showCharacterCount />
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

const BusinessExperienceForm = forwardRef(({ label = 'Label', inputTypes, inputLabel, businessExp }, ref) => {
    const { socialProfile } = useSocialProfileStore();

    const [inputValue, setInputValue] = useState(mapBusinessExp(socialProfile?.businessExp));

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

    const handleAdd = () => setInputValue([...inputValue, { experience: null }]);
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
                    <BusinessExperienceFormInput
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

export default BusinessExperienceForm

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