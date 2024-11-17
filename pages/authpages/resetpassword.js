import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, DeviceEventEmitter } from 'react-native';
import PageWrapper from '../../components/pagewrapper';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import VectorImage from 'react-native-vector-image';
import { useNavigation } from '@react-navigation/native';
import authPageStyles from './authpageStyles';
import { Checkbox } from '../../components/form_inputs/checkboxes';
import { ResetPassword } from '../../network/models/auth';
import useFormState from '../../hooks/formstate';
import FormInputWrapper from '../../components/forminputwrapper';
import Themis from '../../utilities/themis';
import { Alert, AlertBoxContext } from '../../components/alertbox';

const ResetPasswordFormValidators = {
    password: Themis.validator
        .addRule(Themis.anyRules.exists('Please enter a password')),

    otp: Themis.validator
        .addRule(Themis.inputRules.otp('Please enter a valid OTP')),
}

function ResetPasswordPage(props) {
    const navigation = useNavigation();

    const email = props.route?.params?.email;

    const password = useFormState();
    const confirmPassword = useFormState();
    const OTP = useFormState();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const createAlert = useContext(AlertBoxContext);

    const validatePasswordsMatch = () => {
        if (password.value === confirmPassword.value) return true;

        confirmPassword.updateError('Passwords should match');
        createAlert(Alert.Error('Passwords should match'));
        return false;
    }

    useEffect(() => {
        attachValidators();
    }, []);

    const attachValidators = () => {
        password.attachValidator(ResetPasswordFormValidators.password);
        OTP.attachValidator(ResetPasswordFormValidators.otp);
    }

    const validateFormFields = () => {
        return password.validate()
        && OTP.validate()
        && validatePasswordsMatch();
    }

    const resetPassword = async () => {
        if (!validateFormFields()) return;

        try {
            setLoading(true);
            await ResetPassword({ username: email, newpassword: password.value, otp: OTP.value });
            navigation.navigate('Login', { email: email });
        }
        catch(error) {
            createAlert(Alert.Error(error.message));
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <PageWrapper>
            <KeyboardAwareScrollView contentContainerStyle={authPageStyles.pageStyles}>
                <View style={authPageStyles.formTop}>
                    <VectorImage source={require('../../assets/icons/worldref-logo-full.svg')} style={authPageStyles.worldrefLogo}/>
                    <Text style={authPageStyles.signupText}>Reset Password</Text>
                    <View style={authPageStyles.authRow}/>
                    <View styles={authPageStyles.formContainer}>
                        <FormInputText label="Email" value={email} editable={false}/>
                        <FormInputWrapper formState={password} component={<FormInputText label='New Password' inputType={TextInputTypes.password} secureTextEntry={!showPassword}/>}/>
                        <FormInputWrapper formState={confirmPassword} component={<FormInputText label='Confirm Password' inputType={TextInputTypes.confirm_password} secureTextEntry={!showPassword}/>}/>
                        <FormInputWrapper formState={OTP} component={<FormInputText label='OTP' inputType={TextInputTypes.oneTimeCode} maxLength={4}/>}/>
                        <Checkbox testID={`showpassword`} active={showPassword} onToggle={() => setShowPassword(!showPassword)}>
                            <Text style={authPageStyles.infoText}>Show Password</Text>
                        </Checkbox>
                    </View>
                </View>
                <View style={authPageStyles.formBottom}>
                    <Button onPress={() => resetPassword()} label="Reset Password" size={ButtonSizes.large} spinner={loading}/>
                </View>
            </KeyboardAwareScrollView>
        </PageWrapper>
    )
}

const styles = StyleSheet.create({
});

export default ResetPasswordPage;