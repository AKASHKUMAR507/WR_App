import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, LayoutAnimation, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VectorImage from 'react-native-vector-image';
import shadows from '../styles/shadows';
import fontSizes from '../styles/fonts';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useCurrentOnboardingPageStore } from '../stores/stores';

const OnboardingPages = {
    Profile: 0,
    Address: 1,
    Industries: 2,
    Buying: 3,
    Selling: 4,
    Territories: 5,
    Final: 6,
}

function GetCurrentProgress(page) {
    const TOTAL_ONBOARDING_PAGES = Object.keys(OnboardingPages).length - 1;
    return ((page || 0) / TOTAL_ONBOARDING_PAGES) * Dimensions.get('window').width;
}

function HeaderOnboarding(props) {
    const insets = useSafeAreaInsets();

    const width = useSharedValue(0);
    const currentPage = useCurrentOnboardingPageStore(state => state.currentOnboardingPage);

    useEffect(() => {
        width.value = withTiming(GetCurrentProgress(currentPage));
    }, [currentPage]);

    return (
        <React.Fragment>
            <View style={[styles.headerStyles, { paddingTop: insets.top + 12 }]}>
                <VectorImage style={styles.headerLogo} source={require('../assets/icons/worldref-logo-min.svg')}/> 
            </View>
            { 
                props.showProgress &&
                <View style={styles.headerProgressbarBackground}>
                    <Animated.View style={[styles.headerProgressbar, { width }]}/> 
                </View>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    headerStyles: {
        paddingHorizontal: 16,
        paddingBottom: 8,

        backgroundColor: colors.White,

        ...shadows.shadowLight,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerLogo: {
        width: 154,
        height: 37,
    },

    headerProgressbarBackground: {
        height: 4,
        backgroundColor: colors.LightGray,
    },

    headerProgressbar: {
        height: 4,
        backgroundColor: colors.Primary,
    }
});

export { OnboardingPages };
export default HeaderOnboarding;