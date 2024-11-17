import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Platform, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import PageWrapper from '../../components/pagewrapper';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs';
import { Button, ButtonSizes } from '../../components/atoms/buttons';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import VectorImage from 'react-native-vector-image';
import { useNavigation } from '@react-navigation/native';
import authPageStyles from './authpageStyles';
import { Checkbox } from '../../components/form_inputs/checkboxes';
import { Login } from '../../network/models/auth';
import useFormState from '../../hooks/formstate';
import FormInputWrapper from '../../components/forminputwrapper';
import Themis from '../../utilities/themis';
import { configureGoogle, handleAppleLoginErrors, handleGoogleLoginErrors, processAppleOAuth, processGoogleOAuth } from './oauth';
import appleAuth from '@invertase/react-native-apple-authentication';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import useUserRoles from '../../stores/userrole';
import { useFcmToken } from '../../stores/stores';


const LoginFormValidators = {
    email: Themis.validator
        .addRule(Themis.inputRules.email('Please enter a valid email address')),

    password: Themis.validator
        .addRule(Themis.anyRules.exists('Please enter a password'))
}

function LoginPage(props) {
    const navigation = useNavigation();

    const setUserRoles = useUserRoles(state => state.setUserRoles);
    const fcmToken = useFcmToken(state => state.fcmToken);

    const email = useFormState();
    const password = useFormState();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const createAlert = useContext(AlertBoxContext);

    const emailFromProps = props.route?.params?.email;

    useEffect(() => {
        emailFromProps && email.onChangeValue(emailFromProps);
    }, [emailFromProps]);

    useEffect(() => {
        configureGoogle();
        attachValidators();
    }, []);

    const attachValidators = () => {
        email.attachValidator(LoginFormValidators.email);
        password.attachValidator(LoginFormValidators.password);
    }

    const validateFormFields = () => {
        return email.validate()
            && password.validate();
    }

    const loginApple = async () => {
        try {
            const userInfo = await processAppleOAuth();
        }
        catch (error) {
            const appleLoginError = handleAppleLoginErrors(error) || null;
            if (!appleLoginError) return;

            createAlert(Alert.Error(appleLoginError.message));
        }
    }

    const loginGoogle = async () => {
        try {
            const userInfo = await processGoogleOAuth();
        }
        catch (error) {
            const googleLoginError = handleGoogleLoginErrors(error) || null;
            if (!googleLoginError) return;

            createAlert(Alert.Error(googleLoginError.message));
        }
    }

    const login = async () => {
        if (!validateFormFields()) return;

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            const loginResponse = await Login({ userName: email.value, password: password.value, fcmtoken: fcmToken });
            setUserRoles(loginResponse.roles);
            loginResponse.demoflag && DeviceEventEmitter.emit('demo-completed');
            loginResponse.onboarded && DeviceEventEmitter.emit('onboarded');
            DeviceEventEmitter.emit('login', { accessToken: loginResponse.accessToken, refreshToken: loginResponse.refreshToken });
        }
        catch (error) {
            if (error.message === 'Cannot read property \'data\' of undefined') {
                createAlert(Alert.Error('Invalid password'));
                return;
            }
            if (error === 'No such element exception: No value present') {
                createAlert(Alert.Error('Invalid username'));
                return
            }

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
                    <VectorImage source={require('../../assets/icons/worldref-logo-full.svg')} style={authPageStyles.worldrefLogo} />
                    <Text style={authPageStyles.signupText}>Log In</Text>
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
                        <FormInputWrapper formState={email} component={<FormInputText label='Email' inputType={TextInputTypes.email} />} />
                        <FormInputWrapper formState={password} component={<FormInputText label="Password" inputType={TextInputTypes.password} secureTextEntry={!showPassword} />} />
                        <Checkbox testID={`showpassword`} active={showPassword} onToggle={() => setShowPassword(!showPassword)}>
                            <Text style={authPageStyles.infoText}>Show Password</Text>
                        </Checkbox>
                    </View>
                </View>
                <View style={authPageStyles.formBottom}>
                    {/* <View style={authPageStyles.infoSection}>
                        <Text style={authPageStyles.infoText}>Forgot Password? <Text onPress={() => navigation.navigate('ForgotPassword')} style={authPageStyles.infoTextLink}>Sign in via OTP</Text></Text>
                        <Text style={authPageStyles.infoText}>New to WorldRef? <Text onPress={() => navigation.navigate('Signup')} style={authPageStyles.infoTextLink}>Create an account</Text></Text>
                    </View> */}
                    <Button label="Log In" spinner={loading} size={ButtonSizes.large} onPress={() => login()} />
                </View>
            </KeyboardAwareScrollView>
        </PageWrapper>
    )
}

const styles = StyleSheet.create({
});

export default LoginPage;
