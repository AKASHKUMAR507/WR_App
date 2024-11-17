import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../../components/atoms/buttons';
import formStyles from '../../styles/formStyles';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useFormState from '../../hooks/formstate';
import TagSearchList from '../../components/tagsearchlist';
import { useCurrentOnboardingPageStore, useOnboardingInfoStore } from '../../stores/stores';
import { useCallback, useEffect } from 'react';
import { OnboardingPages } from '../../components/headeronboarding';
import { usePredefinedTagsDataStore } from '../../stores/datastores';

function OnboardingIndustriesPage(props) {
    const navigation = useNavigation();

    const industriesBuying = useFormState([]);
    const industriesSelling = useFormState([]);

    const setCurrentOnboardingPage = useCurrentOnboardingPageStore(state => state.setCurrentOnboardingPage);

    const addOnboardingInfo = useOnboardingInfoStore(state => state.addOnboardingInfo);
    const onboardingInfo = useOnboardingInfoStore(state => state.onboardingInfo);

    const predefinedTags = usePredefinedTagsDataStore(state => state.predefinedTags);

    useFocusEffect(useCallback(() => {
        setCurrentOnboardingPage(OnboardingPages.Industries);
    }, []));

    useEffect(() => {
        prefillValues();
    }, []);

    const prefillValues = () => {
        industriesBuying.onChangeValue(onboardingInfo.industriesBuying || []);
        industriesSelling.onChangeValue(onboardingInfo.industriesSelling || []);
    }

    const validateOnboardingIndustriesFrom = () => {
        return true;
    }

    const saveOnboardingIndustriesForm = () => {
        if (!validateOnboardingIndustriesFrom()) return;

        addOnboardingInfo({
            industriesBuying: industriesBuying.value,
            industriesSelling: industriesSelling.value,
        });

        navigation.navigate('OnboardingBuying');
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={[formStyles.formContainer, { flexGrow: 1, justifyContent: 'space-between' }]}>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Buying Industries Information</Text>
                <TagSearchList 
                    placeholder='Search or add Industries' 
                    label='Select all active industries relevant to your domain, where you can help source / buy from.' 
                    sheetlabel='Buying Industries' 
                    searchbarlabel='Search or add Industries' 
                    tagname='Industry'
                    options={predefinedTags.industries} 
                    formState={industriesBuying}
                    categoryname={'industries'}
                    subcategoryname={'buying'}
                    optional
                />
            </View>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Selling Industries Information</Text>
                <TagSearchList 
                    placeholder='Search or add Industries' 
                    label='Select all active industries relevant to your domain, where you can help us sell to buyers.' 
                    sheetlabel='Selling Industries' 
                    searchbarlabel='Search or add Industries' 
                    tagname='Industry'
                    options={predefinedTags.industries}
                    formState={industriesSelling}
                    categoryname={'industries'}
                    subcategoryname={'selling'}
                    optional
                />
            </View>
            <View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={formStyles.formActionContainer}>
                    <Text style={formStyles.formAction}>Return to Address Details</Text>
                </TouchableOpacity>
                <Button label='Continue' onPress={() => saveOnboardingIndustriesForm()}/>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
});

export default OnboardingIndustriesPage;