import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import PageWrapper from '../../components/pagewrapper';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import VectorImage from 'react-native-vector-image';
import { Checkbox } from '../../components/form_inputs/checkboxes';
import { useNavigation } from '@react-navigation/native';
import authPageStyles from './authpageStyles';
import { Login, SignUp } from '../../network/models/auth';
import useFormState from '../../hooks/formstate';
import FormInputWrapper from '../../components/forminputwrapper';
import Themis from '../../utilities/themis';
import { handleAppleLoginErrors, handleGoogleLoginErrors, processAppleOAuth, processGoogleOAuth } from './oauth';
import appleAuth from '@invertase/react-native-apple-authentication';
import { AlertBoxContext, Alert } from '../../components/alertbox';
import WebviewDrawer from '../../components/webviewdrawer';

const SignupFormValidators = {
    name: Themis.validator
        .addRule(Themis.inputRules.name('Please enter a valid name')),

    email: Themis.validator
        .addRule(Themis.inputRules.email('Please enter a valid email address')),

    password: Themis.validator
        .addRule(Themis.anyRules.exists('Please enter a password')),
}

function SignupPage(props) {
    const navigation = useNavigation();

    const name = useFormState();
    const email = useFormState();
    const password = useFormState();
    const confirmPassword = useFormState();

    const [showPassword, setShowPassword] = useState(false);

    const termsOfServiceSheetRef = useRef(null);

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
        name.attachValidator(SignupFormValidators.name);
        email.attachValidator(SignupFormValidators.email);
        password.attachValidator(SignupFormValidators.password);
    }

    const validateFormFields = () => {
        return name.validate()
        && email.validate()
        && password.validate()
        && validatePasswordsMatch();
    }

    const loginApple = async () => {
        try {
            const userInfo = await processAppleOAuth();
        }
        catch(error) {
            const appleLoginError = handleAppleLoginErrors(error) || null;
            if (!appleLoginError) return;

            createAlert(Alert.Error(appleLoginError.message));
        }
    }

    const loginGoogle = async () => {
        try {
            const userInfo = await processGoogleOAuth();
        }
        catch(error) {
            const googleLoginError = handleGoogleLoginErrors(error) || null;
            if (!googleLoginError) return;

            createAlert(Alert.Error(googleLoginError.message));
        }
    }

    const signup = async () => {
        if (!validateFormFields()) return;

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            await SignUp({ fullName: name.value, userName: email.value, password: password.value });
            navigation.navigate('EmailVerification', { email: email.value, password: password.value });
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
        <PageWrapper>
            <KeyboardAwareScrollView contentContainerStyle={authPageStyles.pageStyles}>
                <View style={authPageStyles.formTop}>
                    <VectorImage source={require('../../assets/icons/worldref-logo-full.svg')} style={authPageStyles.worldrefLogo}/>
                    <Text style={authPageStyles.signupText}>Sign Up</Text>
                    {/* <View style={authPageStyles.authRow}>
                        {
                            appleAuth.isSupported && 
                            <TouchableOpacity activeOpacity={0.8} onPress={() => loginApple()} style={authPageStyles.authRowItem}>
                                <VectorImage source={require('../../assets/icons/apple.svg')} style={[authPageStyles.oauthIcon, authPageStyles.appleOAuthIconOffest]}/>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity activeOpacity={0.8} onPress={() => loginGoogle()} style={authPageStyles.authRowItem}>
                            <VectorImage source={require('../../assets/icons/google.svg')} style={authPageStyles.oauthIcon}/>
                        </TouchableOpacity>
                    </View> */}
                    <View styles={authPageStyles.formContainer}>
                        <FormInputWrapper formState={name} component={<FormInputText label='Name' inputType={TextInputTypes.name}/>}/>
                        <FormInputWrapper formState={email} component={<FormInputText label='Email' inputType={TextInputTypes.email}/>}/>
                        <FormInputWrapper formState={password} component={<FormInputText label="Password" inputType={TextInputTypes.password} secureTextEntry={!showPassword}/>}/>
                        <FormInputWrapper formState={confirmPassword} component={<FormInputText label="Confirm Password" inputType={TextInputTypes.confirm_password} secureTextEntry={!showPassword}/>}/>
                        <Checkbox testID={`showpassword`} active={showPassword} onToggle={() => setShowPassword(!showPassword)}>
                            <Text style={authPageStyles.infoText}>Show Password</Text>
                        </Checkbox>
                    </View>
                </View>
                <View style={authPageStyles.formBottom}>
                    <View style={authPageStyles.infoSection}>
                        <Text style={authPageStyles.infoText}>Already have an account? <Text onPress={() => navigation.navigate('Login')} style={authPageStyles.infoTextLink}>Login</Text></Text>
                        <Text style={authPageStyles.infoText}>Got an OTP? <Text onPress={() => navigation.navigate('EmailVerification')} style={authPageStyles.infoTextLink}>Verify Email and Login</Text></Text>
                    </View>
                    <Button label="Sign Up" size={ButtonSizes.large} spinner={loading} onPress={() => signup()}/>
                </View>
            </KeyboardAwareScrollView>
            <WebviewDrawer url='https://worldref.co/app/terms&condition.html' ref={termsOfServiceSheetRef}/>
        </PageWrapper>
    )
}

const styles = StyleSheet.create({
});

export default SignupPage;