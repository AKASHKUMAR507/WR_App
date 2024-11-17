import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import PageWrapper from '../../../components/pagewrapper'
import KeyboardAwareScrollView from '../../../components/keyboardawarescrollview'
import authPageStyles from '../../../pages/authpages/authpageStyles'
import FormInputWrapper from '../../../components/forminputwrapper'
import useFormState from '../../../hooks/formstate'
import { FormInputText, TextInputTypes } from '../../../components/form_inputs/inputs'
import { Button, ButtonSizes } from '../../../components/atoms/buttons'
import { Checkbox } from '../../../components/form_inputs/checkboxes'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Alert, AlertBoxContext } from '../../../components/alertbox'
import { ChangeAccountPassword } from '../../../network/models/auth'
import Themis from '../../../utilities/themis'

const ChangePasswordFormValidators = {
  existingPassword: Themis.validator
    .addRule(Themis.anyRules.exists('Please enter existing password')),

  newPassword: Themis.validator
    .addRule(Themis.anyRules.exists('Please enter new password')),

  confirmNewPassword: Themis.validator
    .addRule(Themis.anyRules.exists('Please enter confirm new password')),
}

const ChangePassword = () => {
  const insets = useSafeAreaInsets();

  const existingPassword = useFormState();
  const newPassword = useFormState();
  const confirmNewPassword = useFormState();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const createAlert = useContext(AlertBoxContext);


  const validatePasswordsMatch = () => {
    if (newPassword.value === confirmNewPassword.value) return true;

    confirmNewPassword.updateError('Passwords should match');
    createAlert(Alert.Error('Passwords should match'));
    return false;
  }

  useEffect(() => {
    attachValidators();
  }, []);

  const attachValidators = () => {
    existingPassword.attachValidator(ChangePasswordFormValidators.existingPassword);
    newPassword.attachValidator(ChangePasswordFormValidators.newPassword);
    confirmNewPassword.attachValidator(ChangePasswordFormValidators.confirmNewPassword);
  }

  const validateFormFields = () => {
    return existingPassword.validate()
      && newPassword.validate()
      && confirmNewPassword.validate()
      && validatePasswordsMatch();
  }

  const resetPassword = async () => {
    if (!validateFormFields()) return;

    try {
      setLoading(true);
      await ChangeAccountPassword({ currentpassword: existingPassword.value, newpassword: newPassword.value, confirmnewpassword: confirmNewPassword.value });
      createAlert(Alert.Success('Password change successfully', 'Password change'));
      DeviceEventEmitter.emit('logout')
    }
    catch (error) {
      createAlert(Alert.Error(error.message));
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper>
      <KeyboardAwareScrollView contentContainerStyle={authPageStyles.pageStyles}>
        <View style={{ paddingTop: insets.top + 16 }}>
          <FormInputWrapper formState={existingPassword} component={<FormInputText label='Existing Password' secureTextEntry={!showPassword} inputType={TextInputTypes.password} />} />
          <FormInputWrapper formState={newPassword} component={<FormInputText label='New Password' secureTextEntry={!showPassword} inputType={TextInputTypes.password} />} />
          <FormInputWrapper formState={confirmNewPassword} component={<FormInputText label='Confirm New Password' secureTextEntry={!showPassword} inputType={TextInputTypes.confirm_password} />} />
          <View>
            <Checkbox onToggle={() => setShowPassword(!showPassword)} active={showPassword} >
              <Text style={authPageStyles.infoText}>Show Password</Text>
            </Checkbox>
          </View>
        </View>
        <View style={authPageStyles.formBottom}>
          <Button label='Save Change' size={ButtonSizes.large} onPress={() => resetPassword()} spinner={loading} />
        </View>
      </KeyboardAwareScrollView>
    </PageWrapper>
  )
}


export default ChangePassword