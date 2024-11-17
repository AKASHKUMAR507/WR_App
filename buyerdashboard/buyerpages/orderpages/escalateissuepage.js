import { DeviceEventEmitter, Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import VectorImage from 'react-native-vector-image'
import FormInputWrapper from '../../../components/forminputwrapper'
import { FormInputText, TextInputTypes } from '../../../components/form_inputs/inputs'
import useFormState from '../../../hooks/formstate'
import { Button } from '../../../components/atoms/buttons'
import KeyboardAwareScrollView from '../../../components/keyboardawarescrollview'
import formStyles from '../../../styles/formStyles'
import { useNavigation } from '@react-navigation/native'
import { Alert, AlertBoxContext } from '../../../components/alertbox'
import { EscalateIssue } from '../../../network/models/mrohubdeal'
import useRefreshScreens from '../../../hooks/refreshscreens'
import Themis from '../../../utilities/themis'
import colors from '../../../styles/colors'
import authPageStyles from '../../../pages/authpages/authpageStyles'
import PageWrapper from '../../../components/pagewrapper'

const EscalateIssueFormValidators = {
    desc: Themis.validator
        .addRule(Themis.inputRules.text('Please enter a valid description'))
}

const EscalateIssuePage = (props) => {
    const inputText = useFormState();
    const navigation = useNavigation();
    const createAlert = useContext(AlertBoxContext);
    const { orderid, dealid } = props.route.params;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        attachValidators();
    }, [])

    const attachValidators = () => {
        inputText.attachValidator(EscalateIssueFormValidators.desc);
    }

    const validateEscalateForm = () => {
        return inputText.validate();
    }

    const handleSubmit = async () => {
        if (!validateEscalateForm) return;

        try {
            setLoading(true)
            DeviceEventEmitter.emit('disableInteraction')

            await EscalateIssue({ desc: `[dealid:${dealid}][orderid:${orderid}]${inputText.value}` });
            createAlert(Alert.Success('We will get in touch with you shortly.'));
            // inputText.onChangeValue((prev) => ({ ...prev, value: '' }));
            navigation.goBack();
        } catch (error) {
            createAlert(Alert.Error(error))
        } finally {
            setLoading(false)
            DeviceEventEmitter.emit('enableInteraction')
        }
    }

    return (
        <PageWrapper>
            <KeyboardAwareScrollView contentContainerStyle={authPageStyles.pageStyles}>
                <View style={{marginTop: 16}}>
                    <View style={styles.card}>
                        <VectorImage style={styles.icon} source={require('../../../assets/icons/escalate-issue.svg')} />
                    </View>
                    <View style={formStyles.formSection}>
                        <FormInputWrapper formState={inputText} component={<FormInputText inputType={TextInputTypes.text} multiline showCharacterCount maxLength={500} label={`Tell us about the issue you're facing`} />} />
                    </View>
                </View>

                <View style={authPageStyles.formBottom}>
                    <Button onPress={() => handleSubmit()} spinner={loading} disabled={inputText.value ? false : true} label='Get the Issue Resolved' />
                </View>

            </KeyboardAwareScrollView>
        </PageWrapper>

    )
}

export default EscalateIssuePage

const styles = StyleSheet.create({
    card: {
        alignItems: 'center'
    },
    icon: {
        marginBottom: 48
    },
})