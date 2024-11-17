import { DeviceEventEmitter, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview'
import formStyles from '../../styles/formStyles'
import FormInputWrapper from '../../components/forminputwrapper'
import { FormInputText, TextInputTypes } from '../../components/form_inputs/inputs'
import useFormState from '../../hooks/formstate'
import SocialProfileFormInput from '../../components/socialprofileforminput'
import BusinessExperienceForm from '../../components/businessexperience';
import AffiliationsCertificationsForm from '../../components/affiliationscertifications'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import { Button } from '../../components/atoms/buttons'
import { useSocialProfileStore } from '../../stores/fetchstore'
import { AddSocialProfile } from '../../network/models/profile'
import { Alert, AlertBoxContext } from '../../components/alertbox'
import { useFocusEffect } from '@react-navigation/native'

const SocialProfile = () => {
    const insets = useSafeAreaInsets();
    const businessExprienceRef = useRef(null);
    const affiliationsCertificationsRef = useRef(null);
    const sociaMediaProfileRef = useRef(null);

    const { socialProfile, fetchSocialProfile,  loadSocialProfile} = useSocialProfileStore();

    const createAlert = useContext(AlertBoxContext);

    const [loading, setLoading] = useState(false);
    const [socialProfiles, setSocialProfiles] = useState([]);

    const professionalSummary = useFormState(socialProfile?.socialProfile?.profsummary);

    const getSocialProfileObject = async () => {
        const businessExp = await businessExprienceRef.current.getInputValue();
        const certifications = await affiliationsCertificationsRef.current.getInputValue();
        const socialMediaProfiles = await sociaMediaProfileRef.current.getInputValue();

        setSocialProfiles({
            profsummary: professionalSummary.value,
            businessExp: businessExp,
            certifications: certifications,
            socialMediaProfiles: socialMediaProfiles
        });
    }

    

    useFocusEffect(React.useCallback(() => {
        loadSocialProfile();
    }, []))

    const addSocialProfile = async () => {
        try {
            setLoading(true);

            getSocialProfileObject();

            await AddSocialProfile(socialProfiles);
            createAlert(Alert.Success('Your profile has been added successfully!'))
        } catch (error) {
            createAlert(Alert.Error(error.message));
        } finally {
            setLoading(false);
            await fetchSocialProfile();
        }
    }

    return (
        <React.Fragment>
            <KeyboardAwareScrollView contentContainerStyle={[formStyles.formContainer, Platform.select({ ios: {}, android: { paddingBottom: insets.bottom ? insets.bottom + 52 : 16 } })]} >
                <FormInputWrapper formState={professionalSummary} component={<FormInputText label='Professional Summary' inputType={TextInputTypes.multiline} multiline showCharacterCount maxLength={300} />} />

                <View style={formStyles.formSection}>
                    <BusinessExperienceForm ref={businessExprienceRef} inputType={TextInputTypes.text} label={"Business Experience"} businessExp={socialProfile?.businessExp} />
                    <AffiliationsCertificationsForm ref={affiliationsCertificationsRef} inputType={TextInputTypes.text} label={"Affiliations & Certifications"} />
                    <SocialProfileFormInput ref={sociaMediaProfileRef} inputType={TextInputTypes.url} label={"Social Media Profiles"} />
                </View>
            </KeyboardAwareScrollView>

            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                <Button onPress={() => addSocialProfile()} label={`Save Social Info`} spinner={loading} />
            </View>
        </React.Fragment>
    )
}

export default SocialProfile

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