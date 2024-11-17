import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import inputStyles from './form_inputs/inputStyles';
import VectorImage from 'react-native-vector-image';
import { FormInputText } from './form_inputs/inputs';
import { AlertBoxContext } from './alertbox';
import Themis from '../utilities/themis';
import { useSocialProfileStore } from '../stores/fetchstore';

const SocialProfileValidation = {
    inputValue: Themis.validator
        .addRule(Themis.inputRules.text()),
}

function ValidateSocialProfile(inputValue) {
    const inputValueValidation = SocialProfileValidation.inputValue.validate(inputValue);
    if (!inputValueValidation.isValid) return inputValueValidation;

    return Themis.validResponse;
}

function SocialProfileForm({ index, handleRemove, inputValue, inputTypes, onChangeValue, inputLabel = 'Input Label' }) {

    const handleTextChange = (value) => onChangeValue({ ...inputValue, socialmediaprofile: value });

    return (
        <React.Fragment>
            <View style={styles.FormInputWrapper}>
                <View style={styles.detailsWrapper}>
                    <FormInputText value={inputValue.socialmediaprofile} onChange={handleTextChange} label={''} placeholder={'https://www.linkedin.com/'} inputType={inputTypes} scrollIntoViewOnFocus={false} />
                </View>

                <TouchableOpacity testID={`${index}:remove`} activeOpacity={0.8} style={styles.removeButton} onPress={() => handleRemove()}>
                    <VectorImage source={require('../assets/icons/trash.svg')} />
                </TouchableOpacity>

            </View>
        </React.Fragment>
    )
};

const SocialProfileFormInput = forwardRef(({ label = 'Label', inputTypes, inputLabel }, ref) => {
    const { socialProfile } = useSocialProfileStore();

    const [inputValue, setInputValue] = useState(
        socialProfile?.socialMediaProfiles?.map((item) => ({
            socialmediaprofile: item?.socialmediaprofile,
            smpid: item?.smpid || '',
            associateid: item?.associateid || ''
        })) || []
    );
    const [error, setError] = useState(null);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (error) setError(null);
    }, [inputValue]);


    useImperativeHandle(ref, () => ({
        validate: validate,
        getInputValue: getInputValue,
    }))

    const handleAdd = () => setInputValue([...inputValue, { socialmediaprofile: null }]);
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
                    <SocialProfileForm
                        key={index}
                        index={index}
                        inputTypes={inputTypes}
                        inputValue={inputValue}
                        inputLabel={inputLabel}
                        handleRemove={() => handleRemove(index)}
                        onChangeValue={(value) => handleValueChange(index, value)}
                    />
                ))}
                {error && <Text style={inputStyles.error}>{error}</Text>}
            </View>
        </React.Fragment>
    )
})

export default SocialProfileFormInput

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