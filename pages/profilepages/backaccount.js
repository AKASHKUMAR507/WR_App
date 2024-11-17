import { LayoutAnimation, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview'
import formStyles from '../../styles/formStyles'
import FormInputWrapper from '../../components/forminputwrapper'
import { FormInputText } from '../../components/form_inputs/inputs'
import { TextInputTypes } from '../../components/form_inputs/inputs'
import CountryCitySearch from '../../components/countrycitysearch'
import useFormState from '../../hooks/formstate'
import { Button, ButtonSizes, ButtonTypes } from '../../components/atoms/buttons'
import Themis from '../../utilities/themis'
import { Alert, AlertBoxContext } from '../../components/alertbox'
import { AddPaymentDetails } from '../../network/models/setting'
import { useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import { useBankDetailsStore, useBankType } from '../../stores/fetchstore'

const BankAccountFormValidators = {
  accountHolderName: Themis.validator
    .addRule(Themis.inputRules.text('Please enter account holder name')),

  accountNumber: Themis.validator
    .addRule(Themis.inputRules.text('Please enter account number')),

  accountType: Themis.validator
    .addRule(Themis.inputRules.text('Please enter account type')),

  bankName: Themis.validator
    .addRule(Themis.inputRules.text('Please enter bank name')),

  ifscCode: Themis.validator
    .addRule(Themis.inputRules.text('Please enter bank name')),

  ifscCodeOptional: Themis.validator
    .makeOptional()
    .addRule(Themis.inputRules.text('Please enter bank name')),

  swiftCode: Themis.validator
    .addRule(Themis.inputRules.text('Please enter bank name')),

  swiftCodeOptional: Themis.validator
    .makeOptional()
    .addRule(Themis.inputRules.text('Please enter bank name')),

  address: Themis.validator
    .addRule(Themis.inputRules.text('Please enter a valid address')),

  addressOptional: Themis.validator
    .makeOptional()
    .addRule(Themis.inputRules.text('Please enter a valid address')),

  country: Themis.validator
    .addRule(Themis.anyRules.exists('Please select a country')),

  city: Themis.validator
    .addRule(Themis.anyRules.exists('Please select a city')),

  pincode: Themis.validator
    .addRule(Themis.inputRules.pincode('Please enter Pin Code/Zip Code'))
}

const BackAccount = () => {
  const insets = useSafeAreaInsets();
  const loadBankType = useBankType(state => state.loadBankType);
  const bankType = useBankType(state => state.bankType);

  const paymentmethodid = 1;

  const paymentInformation = useBankDetailsStore(state => state.bankDetails);

  const onValueChange = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setHasUnsavedChanges(true);
  }

  const [loading, setLoading] = useState(false);
  const accountHolderName = useFormState(paymentInformation?.accountname, onValueChange);
  const accountNumber = useFormState(paymentInformation?.accountnumber, onValueChange);
  const accountType = useFormState(paymentInformation?.accounttype, onValueChange);
  const bankName = useFormState(paymentInformation?.bankname, onValueChange);
  const ifscCode = useFormState(paymentInformation?.ifsccode, onValueChange);
  const swiftCode = useFormState(paymentInformation?.swiftcode, onValueChange);

  const addressLine1 = useFormState(paymentInformation?.addressline1, onValueChange)
  const addressLine2 = useFormState(paymentInformation?.addressline2, onValueChange)
  const city = useFormState(paymentInformation?.city, onValueChange);
  const country = useFormState(paymentInformation?.country, onValueChange);
  const pincode = useFormState(paymentInformation?.pin, onValueChange);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const createAlert = useContext(AlertBoxContext);

  useEffect(() => {
    attachValidators();
    loadBankType();
  }, [])

  const attachValidators = () => {
    accountHolderName.attachValidator(BankAccountFormValidators.accountHolderName);
    accountNumber.attachValidator(BankAccountFormValidators.accountNumber);
    accountType.attachValidator(BankAccountFormValidators.accountType);
    bankName.attachValidator(BankAccountFormValidators.bankName);
    ifscCode.attachValidator(bankType === 'national' ? BankAccountFormValidators.ifscCode : BankAccountFormValidators.swiftCodeOptional);
    swiftCode.attachValidator(bankType === 'national' ? BankAccountFormValidators.ifscCodeOptional : BankAccountFormValidators.swiftCode);

    addressLine1.attachValidator(BankAccountFormValidators.address);
    addressLine2.attachValidator(BankAccountFormValidators.address);
    city.attachValidator(BankAccountFormValidators.city);
    country.attachValidator(BankAccountFormValidators.country);
    pincode.attachValidator(BankAccountFormValidators.pincode);
  }

  const validateBankAccountForm = () => {
    return accountHolderName.validate()
      && accountNumber.validate()
      && accountType.validate()
      && bankName.validate()
      && ifscCode.validate()
      && swiftCode.validate()
      && addressLine1.validate()
      && addressLine2.validate()
      && city.validate()
      && country.validate()
      && pincode.validate();
  }

  const saveChange = async () => {
    if (!validateBankAccountForm()) return;

    try {
      setLoading(true)
      await AddPaymentDetails({ paymentmethodid: paymentmethodid, accountname: accountHolderName.value, accountnumber: accountNumber.value, accounttype: accountType.value, bankname: bankName.value, ifsccode: ifscCode.value, addressline1: addressLine1.value, addressline2: addressLine2.value, city: city.value, country: country.value, pin: pincode.value, swiftcode: swiftCode.value })
      createAlert(Alert.Success('Account aadded successfully!'))
      setHasUnsavedChanges(false);
    } catch (error) {
      createAlert(Alert.Error(error.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      <KeyboardAwareScrollView contentContainerStyle={[formStyles.formContainer, Platform.select({ ios: {}, android: { paddingBottom: insets.bottom ? insets.bottom + 32 : 16 } })]}>

        <Text style={formStyles.formSectionTitle}>Bank Details</Text>
        <View style={formStyles.formSection}>
          <FormInputWrapper formState={accountHolderName} component={<FormInputText label='Account Holder Name' inputType={TextInputTypes.text} />} />
          <FormInputWrapper formState={accountNumber} component={<FormInputText label='Account Number' inputType={TextInputTypes.number} />} />
          <FormInputWrapper formState={accountType} component={<FormInputText label='Account Type' placeholder='Ex: Saving/Current' inputType={TextInputTypes.text} />} />
          <FormInputWrapper formState={bankName} component={<FormInputText label='Bank Name' inputType={TextInputTypes.text} />} />
          {
            bankType === "national" ? (
              <FormInputWrapper formState={ifscCode} component={<FormInputText label='IFSC Code' inputType={TextInputTypes.text} />} />
            ) : (
              <FormInputWrapper formState={swiftCode} component={<FormInputText label='SWIFT Code' inputType={TextInputTypes.text} />} />
            )
          }
        </View>

        <Text style={formStyles.formSectionTitle}>Bank Branch Address</Text>
        <View style={formStyles.formSection}>
          <FormInputWrapper formState={addressLine1} component={<FormInputText label='Address Line 1' inputType={TextInputTypes.text} />} />
          <FormInputWrapper formState={addressLine2} component={<FormInputText label='Address Line 2' inputType={TextInputTypes.text} />} />
          <CountryCitySearch formStateCity={city} formStateCountry={country} cityPrefill={paymentInformation?.city} />
          <FormInputWrapper formState={pincode} component={<FormInputText label='Pin Code/Zip Code' inputType={TextInputTypes.text} />} />
        </View>

      </KeyboardAwareScrollView>
      {hasUnsavedChanges &&
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
          <Button label='Save Change' spinner={loading} onPress={() => saveChange()} />
        </View>
      }
    </React.Fragment>
  )
}

export default BackAccount

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,

    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: colors.White,

    borderTopColor: colors.LightGray,
    borderTopWidth: 1,
  },
})