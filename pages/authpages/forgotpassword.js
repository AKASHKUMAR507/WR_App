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
import { ForgotPassword } from '../../network/models/auth';
import useFormState from '../../hooks/formstate';
import FormInputWrapper from '../../components/forminputwrapper';
import Themis from '../../utilities/themis';
import { AlertBoxContext, Alert } from '../../components/alertbox';

const ForgotPasswordFormValidators = {
    email: Themis.validator
        .addRule(Themis.inputRules.email('Please enter a valid email address')),
}

function ForgotPasswordPage(props) {
    const navigation = useNavigation();

    const email = useFormState();

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        email.attachValidator(ForgotPasswordFormValidators.email);
    }, []);

    const [loading, setLoading] = useState(false);

    const forgotPassword = async () => {
        if (!email.validate()) return;

        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            await ForgotPassword({ email: email.value });
            navigation.navigate('ResetPassword', { email: email.value });
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
                    <Text style={authPageStyles.signupText}>Trouble Logging In?</Text>
                    <View style={authPageStyles.authRow}>
                        <Text style={[authPageStyles.infoText, { textAlign: 'center' }]}>Enter your registered email where we will send you an OTP to help you reset your password.</Text>
                        <View style={{ height: 96 }}/>
                    </View>
                    <View styles={authPageStyles.formContainer}>
                        <FormInputWrapper formState={email} component={<FormInputText label='Email' inputType={TextInputTypes.email}/>}/>
                    </View>
                </View>
                <View style={authPageStyles.formBottom}>
                    <View style={authPageStyles.infoSection}>
                        <Text onPress={() => navigation.navigate('Login')} style={[authPageStyles.infoText, authPageStyles.infoTextLink]}>Return to Login</Text>
                    </View>
                    <Button label="Reset Password" spinner={loading} size={ButtonSizes.large} onPress={() => forgotPassword()}/>
                </View>
            </KeyboardAwareScrollView>
        </PageWrapper>
    )
}

const styles = StyleSheet.create({
});

export default ForgotPasswordPage;