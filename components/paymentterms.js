import React, { createRef, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { TextInput, View, Text, StyleSheet, LayoutAnimation, TouchableOpacity } from 'react-native';
import inputStyles from './form_inputs/inputStyles';
import { FormInputText, TextInputTypes } from './form_inputs/inputs';
import formStyles from '../styles/formStyles';
import VectorImage from 'react-native-vector-image';
import Themis from '../utilities/themis';
import { Alert, AlertBoxContext } from './alertbox';

const PaymentTermsValidators = {
    paymentTerms: Themis.validator
        .addRule(Themis.arrayRules.minLength(1, 'Please enter atleast one payment term')),

    percentage: Themis.validator
        .addRule(Themis.anyRules.exists('Percentage is required'))
        .addRule(Themis.inputRules.amount('Please enter a valid percentage'))
        .addRule(Themis.numberRules.min(0, 'Percentage must be greater than or equal to 0')),

    terms: Themis.validator
        .addRule(Themis.stringRules.minLength(2, 'Terms should be atleast two characters long'))
        .addRule(Themis.inputRules.text()),

    sum: Themis.validator
        .addRule(Themis.numberRules.max(100, 'Payment terms percentages must not add up to more than 100 and must be greater than 0')),
}

function validatePaymentTerms(paymentTerms) {
    const paymentTermsValidation = PaymentTermsValidators.paymentTerms.validate(paymentTerms);
    if (!paymentTermsValidation.isValid) return paymentTermsValidation;

    let paymentPercentageSum = 0;

    for (let i = 0; i < paymentTerms.length; i++) {
        const paymentTerm = paymentTerms[i];
        const percentageValidation = PaymentTermsValidators.percentage.validate(paymentTerm.percentage);
        if (!percentageValidation.isValid) return percentageValidation;

        const termsValidation = PaymentTermsValidators.terms.validate(paymentTerm.terms);
        if (!termsValidation.isValid) return termsValidation;

        paymentPercentageSum += parseFloat(paymentTerm.percentage);
    }

    const sumValidation = PaymentTermsValidators.sum.validate(paymentPercentageSum);
    if (!sumValidation.isValid) return sumValidation;

    return Themis.validResponse;
}

function PaymentTerm({ index, handleRemove, paymentTerm, onChangeValue }) {
    const handlePercentageChange = (value) => onChangeValue({ ...paymentTerm, percentage: value });
    const handleTermsChange = (value) => onChangeValue({ ...paymentTerm, terms: value });

    return (
        <React.Fragment>
            <View style={styles.paymentTermsWrapper}>
                <View style={styles.percentageWrapper}>
                    <FormInputText
                        value={paymentTerm.percentage}
                        onChange={handlePercentageChange}
                        label='Percentage'
                        inputType={TextInputTypes.numeric}
                        scrollIntoViewOnFocus={false}
                        maxLength={5}
                    />
                </View>
                <View style={styles.detailsWrapper}>
                    <FormInputText
                        value={paymentTerm.terms}
                        onChange={handleTermsChange}
                        label='Terms'
                        inputType={TextInputTypes.text}
                        scrollIntoViewOnFocus={false}
                    />
                </View>
                <TouchableOpacity testID={`paymentterms:${index}:remove`} activeOpacity={0.8} style={styles.removeButton} onPress={() => handleRemove()}>
                    <VectorImage source={require('../assets/icons/trash.svg')} />
                </TouchableOpacity>
            </View>
        </React.Fragment>
    )
};

const PaymentTermsInput = forwardRef(({ }, ref) => {
    const [paymentTerms, setPaymentTerms] = useState([{ percentage: null, terms: null }]);
    const [error, setError] = useState(null);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (error) setError(null);
    }, [paymentTerms]);

    useImperativeHandle(ref, () => ({
        validate: validate,
        getPaymentTerms: getPaymentTerms,
    }));

    const handleAdd = () => setPaymentTerms([...paymentTerms, { percentage: null, terms: null }]);
    const handleRemove = (index) => setPaymentTerms(paymentTerms.filter((item, i) => i != index));
    const handleValueChange = (index, value) => setPaymentTerms(paymentTerms.map((item, i) => i === index ? value : item));

    const validate = () => {
        const validationResponse = validatePaymentTerms(paymentTerms);
        if (validationResponse.isValid) return true;

        setError(validationResponse.message);
        createAlert(Alert.Error(validationResponse.message, 'Input Error'));
        return false;
    };

    const getPaymentTerms = () => paymentTerms.filter((item) => item.percentage && item.terms);

    return (
        <React.Fragment>
            <View style={styles.titleSection}>
                <Text style={formStyles.formSectionTitle}>Payment Terms</Text>
                {
                    paymentTerms.length < 10 &&
                    <TouchableOpacity testID={`paymentterms:add`} activeOpacity={0.8} style={{ marginTop: 2 }} onPress={() => handleAdd()}>
                        <VectorImage source={require('../assets/icons/plus-circle.svg')} />
                    </TouchableOpacity>
                }
            </View>
            {paymentTerms.map((paymentTerm, index) =>
            (<PaymentTerm
                key={index}
                index={index}
                paymentTerm={paymentTerm}
                handleRemove={() => handleRemove(index)}
                onChangeValue={(value) => handleValueChange(index, value)}
            />)
            )}
            {error && <Text style={inputStyles.error}>{error}</Text>}
        </React.Fragment>
    );
});

const styles = StyleSheet.create({
    titleSection: {
        flexDirection: 'row',

        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    paymentTermsWrapper: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between',
    },

    percentageWrapper: {
        width: 80,
        marginRight: 24,

        flexDirection: 'row',
        alignItems: 'center',
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

export default PaymentTermsInput;