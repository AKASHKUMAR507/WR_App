import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/atoms/buttons';
import formStyles from '../styles/formStyles';
import colors from '../styles/colors';
import React from 'react';
import authPageStyles from './authpages/authpageStyles';
import VectorImage from 'react-native-vector-image';

function SplashPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <React.Fragment>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View>
                    <VectorImage source={require('../assets/icons/worldref-logo-full.svg')} style={authPageStyles.worldrefLogo}/>
                </View>
                <Image source={require('../assets/images/OnboardingInitial.png')} style={styles.image}/>
                <View style={styles.textContainer}>
                    <Text style={formStyles.formSectionTitle}>Welcome back!</Text>
                    <Text style={[formStyles.formSectionDescription, { textAlign: 'justify' }]}>You have completed the Onboarding process. Click below to continue to the app.</Text>
                </View>
            </View>
            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                <Button label='Continue'/>
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
        paddingVertical: 24,
        paddingHorizontal: 24,

        alignItems: 'center',
    },

    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,

        backgroundColor: colors.White,
    }
});

export default SplashPage;