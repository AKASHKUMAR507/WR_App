import { View, Text, StyleSheet, DeviceEventEmitter, Image } from 'react-native';
import { Button } from '../../components/atoms/buttons';
import formStyles from '../../styles/formStyles';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useCurrentOnboardingPageStore, useOnboardingInfoStore } from '../../stores/stores';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { OnboardingPages } from '../../components/headeronboarding';
import authPageStyles from '../authpages/authpageStyles';
import WebviewDrawer from '../../components/webviewdrawer';
import { Checkbox } from '../../components/form_inputs/checkboxes';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import FeeSharingDrawer from '../../components/feesharingdrawer';
import { AddOnboardingDetails } from '../../network/models/user';

const OnboardingFinalImage = require('../../assets/images/OnboardingFinal.png');

function OnboardingFinalPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const termsOfServiceSheetRef = useRef(null);
    const successFeeSharingSheetRef = useRef(null);

    const createAlert = useContext(AlertBoxContext);

    const [tncAgreed, setTncAgreed] = useState(false);
    const [feeSharingAgreed, setFeeSharingAgreed] = useState(false);

    const [loading, setLoading] = useState(false);

    const setCurrentOnboardingPage = useCurrentOnboardingPageStore(state => state.setCurrentOnboardingPage);
    const onboardingInfo = useOnboardingInfoStore(state => state.onboardingInfo);

    useFocusEffect(useCallback(() => {
        setCurrentOnboardingPage(OnboardingPages.Final);
    }, []));

    const saveOnboardingFinalForm = async () => {
        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            const tagsList = [
                ...onboardingInfo.industriesBuying,
                ...onboardingInfo.industriesSelling,
                ...onboardingInfo.locationsBuying,
                ...onboardingInfo.locationsSelling,
                ...onboardingInfo.productsBuying,
                ...onboardingInfo.productsSelling,
                ...onboardingInfo.servicesBuying,
                ...onboardingInfo.servicesSelling
            ];

            const onboardingData = {
                name: onboardingInfo.name,
                email: onboardingInfo.email,
                mobile_ext: onboardingInfo.countryCode,
                mobilenumber: onboardingInfo.phone,
                tagslist: tagsList,
                addressline1: onboardingInfo.addressLine1,
                addressline2: onboardingInfo.addressLine2,
                city: onboardingInfo.city,
                country: onboardingInfo.country,
                pincode: onboardingInfo.pincode,
            }

            await AddOnboardingDetails(onboardingData);
            DeviceEventEmitter.emit('onboarded');
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
        finally {
            setLoading(false);
            DeviceEventEmitter.emit('enableInteraction');
        }
    }

    return (
        <React.Fragment>
            <View style={styles.container}>
                <Image source={OnboardingFinalImage} style={styles.image} />
            </View>
            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                <Text style={[formStyles.formSectionTitle, { textAlign: 'center' }]}>Almost done here!</Text>
                <View style={styles.checkboxContainer}>
                    <Checkbox active={tncAgreed} onToggle={() => setTncAgreed(!tncAgreed)}>
                        <Text style={authPageStyles.infoText}>I have read, and agree to the WorldRef <Text style={authPageStyles.infoTextLink} onPress={() => termsOfServiceSheetRef.current?.open()}> Terms of Service</Text></Text>
                    </Checkbox>
                    <Checkbox active={feeSharingAgreed} onToggle={() => setFeeSharingAgreed(!feeSharingAgreed)}>
                        <Text style={authPageStyles.infoText}>I have read, and agree to the WorldRef <Text style={authPageStyles.infoTextLink} onPress={() => successFeeSharingSheetRef.current?.open()}> Success Fee Sharing</Text> details</Text>
                    </Checkbox>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={formStyles.formActionContainer}>
                    <Text style={formStyles.formAction}>Return to Location Preferences</Text>
                </TouchableOpacity>
                <Button spinner={loading} disabled={!tncAgreed || !feeSharingAgreed} label='Continue' onPress={() => saveOnboardingFinalForm()} />
            </View>
            <WebviewDrawer url='https://worldref.co/app/terms&condition.html' ref={termsOfServiceSheetRef} />
            <FeeSharingDrawer ref={successFeeSharingSheetRef} />
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    checkboxContainer: {
        marginRight: 16,
    },

    container: {
        flex: 1,
        alignItems: 'center',

        paddingVertical: 24,
    },

    image: {
        flex: 1,
        resizeMode: 'contain',
    },

    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,

        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
    }
});

export default OnboardingFinalPage;