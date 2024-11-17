import { View, Text, StyleSheet, Image, Dimensions, DeviceEventEmitter, LayoutAnimation } from 'react-native';
import { Button } from '../../components/atoms/buttons';
import formStyles from '../../styles/formStyles';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { usePredefinedTagsDataStore } from '../../stores/datastores';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import { useUserStore } from '../../stores/stores';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import { GetUserInfo } from '../../network/models/user';

const OnboardingInitialImage = require('../../assets/images/OnboardingInitial.png');

function OnboardingInitialPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);

    const createAlert = useContext(AlertBoxContext);
    const fetchPredefinedTags = usePredefinedTagsDataStore(state => state.fetchPredefinedTags);

    const [onboarded, setOnboarded] = useState(false);

    useEffect(() => {
        fetchUserInformation();
    }, []);

    const fetchUserInformation = async () => {
        try {
            const user = await GetUserInfo();

            setOnboarded(user.onboarded || user.mobilenumber); // TODO: Remove mobilenumber check once the backend is updated
            setUser(user);

            getPredefinedTags();
        }
        catch(error) {
            createAlert(Alert.Error(error.message, 'Could not retrive user'));
            DeviceEventEmitter.emit('logout');
        }
    }

    const getPredefinedTags = async () => {
        try {
            await fetchPredefinedTags();
        }
        catch(error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const handleContinue = () => {
        onboarded ? DeviceEventEmitter.emit('onboarded') : navigation.navigate('Onboarding');
    }

    return (
        <React.Fragment>
            <View style={styles.container}>
                <Image source={OnboardingInitialImage} style={styles.image}/>
            </View>
            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                {
                    !onboarded ?
                    <View style={styles.textContainer}>
                        <Text style={formStyles.formSectionTitle}>Let's get you on-board</Text>
                        <Text style={[formStyles.formSectionDescription, { textAlign: 'justify' }]}>We just need some information to match you with relevant deals and enhance your deal making experience.</Text>
                    </View> :
                    <View style={styles.textContainer}>
                        <Text style={formStyles.formSectionTitle}>Welcome back!</Text>
                        <Text style={[formStyles.formSectionDescription, { textAlign: 'justify' }]}>You have completed the Onboarding process. Click below to continue to the app.</Text>
                    </View>
                }
                <Button label='Continue' spinner={!user} onPress={() => handleContinue()}/>
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

        paddingVertical: 24,
    },

    image: {
        flex: 1,
        resizeMode: 'contain',
    },

    textContainer: {
        paddingBottom: 24,
        paddingHorizontal: 24,

        alignItems: 'center',
    },

    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,

        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
    }
});

export default OnboardingInitialPage;