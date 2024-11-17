import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, DeviceEventEmitter } from 'react-native';
import PageWrapper from '../../components/pagewrapper';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import VectorImage from 'react-native-vector-image';
import { useNavigation } from '@react-navigation/native';
import authPageStyles from './authpageStyles';
import { EmailVerify, Login, ResendOtp } from '../../network/models/auth';
import useFormState from '../../hooks/formstate';
import FormInputWrapper from '../../components/forminputwrapper';
import Themis from '../../utilities/themis';
import Aphrodite from '../../utilities/aphrodite';
import { Alert, AlertBoxContext } from '../../components/alertbox';

const OTPTimeout = 59;

const EmailVerificationFormValidators = {
    email: Themis.validator
        .addRule(Themis.inputRules.email('Please enter a valid email address')),

    OTP: Themis.validator
        .addRule(Themis.inputRules.otp('Please enter a valid OTP'))
}

function EmailVerificationPage(props) {
    const navigation = useNavigation();

    const email = useFormState();
    const OTP = useFormState();

    const [loading, setLoading] = useState(false);
    const [canResend, setCanResend] = useState(OTPTimeout);

    const createAlert = useContext(AlertBoxContext);

    const emailFromProps = props.route?.params?.email;
    const password = props.route?.params?.password;

    useEffect(() => {
        emailFromProps && email.onChangeValue(emailFromProps);
    }, [emailFromProps]);

    useEffect(() => {
        attachValidators();
    }, []);

    useEffect(() => {
        countdownReset(canResend);
    }, [canResend]);

    const countdownReset = (currentTimer) => {
        if (currentTimer === 0) return;
        setTimeout(() => setCanResend(currentTimer - 1), 1000);
    }

    const attachValidators = () => {
        email.attachValidator(EmailVerificationFormValidators.email);
        OTP.attachValidator(EmailVerificationFormValidators.OTP);
    }

    const validateFormFields = () => {
        return email.validate()
            && OTP.validate();
    }

    const verify = async () => {
        if (!validateFormFields()) return;

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            await EmailVerify({ username: email.value, otp: OTP.value });
            password ? await processLogin() : navigation.navigate('Login', { email: email.value });
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
        finally {
            setLoading(false);
            DeviceEventEmitter.emit('enableInteraction');
        }
    }

    const processLogin = async () => {
        try {
            const loginResponse = await Login({ userName: email.value, password: password });
            loginResponse.demoflag && DeviceEventEmitter.emit('demo-completed');
            loginResponse.onboarded && DeviceEventEmitter.emit('onboarded');
            DeviceEventEmitter.emit('login', { accessToken: loginResponse.accessToken, refreshToken: loginResponse.refreshToken });
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const resendOTP = async () => {
        try {
            await ResendOtp({ username: email.value });

            createAlert(Alert.Success('OTP Resent'));
            setCanResend(OTPTimeout);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <PageWrapper>
            <KeyboardAwareScrollView contentContainerStyle={authPageStyles.pageStyles}>
                <View style={authPageStyles.formTop}>
                    <VectorImage source={require('../../assets/icons/worldref-logo-full.svg')} style={authPageStyles.worldrefLogo} />
                    <Text style={authPageStyles.signupText}>Email Verification</Text>
                    <View style={authPageStyles.authRow}>
                        <Text style={authPageStyles.infoText}>Please enter the OTP sent to your email address</Text>
                        <View style={{ height: 48 }} />
                    </View>
                    <View styles={authPageStyles.formContainer}>
                        <FormInputWrapper formState={email} component={<FormInputText label='Email' inputType={TextInputTypes.email} editable={!emailFromProps} />} />
                        <FormInputWrapper formState={OTP} component={<FormInputText label='OTP' inputType={TextInputTypes.oneTimeCode} maxLength={4} />} />
                    </View>
                </View>
                <View style={authPageStyles.formBottom}>
                    <View style={authPageStyles.infoSection}>
                        {
                            emailFromProps &&
                            <Text style={authPageStyles.infoText}>Didn't receive the OTP?
                                {
                                    canResend === 0 ?
                                        <Text style={authPageStyles.infoTextLink} onPress={() => resendOTP()}> Resend</Text> :
                                        <Text> Wait {Aphrodite.FormatToTwoDigits(canResend)} seconds</Text>
                                }
                            </Text>
                        }
                        <Text style={authPageStyles.infoText}>New to WorldRef? <Text onPress={() => navigation.navigate('Signup')} style={authPageStyles.infoTextLink}>Create an account</Text></Text>
                    </View>
                    <Button label="Verify" size={ButtonSizes.large} spinner={loading} onPress={() => verify()} />
                </View>
            </KeyboardAwareScrollView>
        </PageWrapper>
    )
}

const styles = StyleSheet.create({
});

export default EmailVerificationPage;