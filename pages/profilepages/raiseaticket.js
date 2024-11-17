import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview'
import FormInputWrapper from '../../components/forminputwrapper'
import { FormInputAttachments } from '../../components/form_inputs/attachments';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs'
import formStyles from '../../styles/formStyles'
import { Button } from '../../components/atoms/buttons'
import colors from '../../styles/colors'
import useFormState from '../../hooks/formstate';
import Themis from '../../utilities/themis';
import useRefreshScreens from '../../hooks/refreshscreens';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import { RaiseaTicket } from '../../network/models/setting';
import { useNavigation } from '@react-navigation/native';

const RaiseaTicketFormValidators = {
    subject: Themis.validator
    .addRule(Themis.anyRules.exists('Please enter subject')),

    details: Themis.validator
        .addRule(Themis.anyRules.exists('Please enter details')),

}

const RaiseaTicketPage = () => {
    const refreshScreens = useRefreshScreens();
    const navigation = useNavigation();
    const subject = useFormState();
    const details = useFormState();
    const attachmentList = useFormState([]);

    const [loading, setLoading] = useState(false);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        attachValidators();
    }, [refreshScreens.shouldRefresh]);

    const attachValidators = () => {
        subject.attachValidator(RaiseaTicketFormValidators.subject);
        details.attachValidator(RaiseaTicketFormValidators.details);
    }

    const validateTicketForm = () => {
        return (subject.validate())
            && details.validate();
    }

    const submitTicket = async () => {
        if(!validateTicketForm()) return;

        try {
            setLoading(true);
            await RaiseaTicket({ subject: subject.value, description: details.value, attachments: attachmentList.value });
            createAlert(Alert.Success('Raise A Ticket', `Raise ticket successfully`))
            navigation.goBack();
        } catch (error) {
            createAlert(Alert.Error(error.message));
        } finally {
            setLoading(false);
            DeviceEventEmitter.emit('enableInteraction');
        }
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={formStyles.formContainer}>

            <View>
                <FormInputWrapper formState={subject} component={<FormInputText label='Subject' />} />
                <FormInputWrapper formState={details} component={<FormInputText label='Details' inputType={TextInputTypes.multiline} multiline showCharacterCount maxLength={500} />} />
            </View>

            <View>
                <FormInputWrapper formState={attachmentList} component={<FormInputAttachments label='Attachments' />} />
            </View>

            <Button label={`Submit Ticket`} spinner={loading} onPress={() => submitTicket()}  />

        </KeyboardAwareScrollView>
    )
}

export default RaiseaTicketPage

const styles = StyleSheet.create({})