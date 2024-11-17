import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/atoms/buttons';
import formStyles from '../../styles/formStyles';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useFormState from '../../hooks/formstate';
import TagSearchList from '../../components/tagsearchlist';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useCurrentOnboardingPageStore, useOnboardingInfoStore } from '../../stores/stores';
import { useCallback, useEffect } from 'react';
import { OnboardingPages } from '../../components/headeronboarding';
import { usePredefinedTagsDataStore } from '../../stores/datastores';

function OnboardingTerritoresPage(props) {
    const navigation = useNavigation();

    const locationsBuying = useFormState([]);
    const locationsSelling = useFormState([]);

    const setCurrentOnboardingPage = useCurrentOnboardingPageStore(state => state.setCurrentOnboardingPage);

    const addOnboardingInfo = useOnboardingInfoStore(state => state.addOnboardingInfo);
    const onboardingInfo = useOnboardingInfoStore(state => state.onboardingInfo);

    const predefinedTags = usePredefinedTagsDataStore(state => state.predefinedTags);

    useFocusEffect(useCallback(() => {
        setCurrentOnboardingPage(OnboardingPages.Territories);
    }, []));

    useEffect(() => {
        prefillValues();
    }, []);

    const prefillValues = () => {
        locationsBuying.onChangeValue(onboardingInfo.locationsBuying || []);
        locationsSelling.onChangeValue(onboardingInfo.locationsSelling || []);
    }

    const validateOnboardingTerritoresFrom = () => {
        return true;
    }

    const saveOnboardingTerritoresForm = () => {
        if (!validateOnboardingTerritoresFrom()) return;

        addOnboardingInfo({
            locationsBuying: locationsBuying.value,
            locationsSelling: locationsSelling.value,
        });

        navigation.navigate('OnboardingFinal');
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={[formStyles.formContainer, { flexGrow: 1, justifyContent: 'space-between' }]}>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Preferred Buying Locations</Text>
                <TagSearchList 
                    placeholder='Search or add Preferred Locations' 
                    label='Select all countries and cities you can operate in, where you can help our clients source / buy from.' 
                    sheetlabel='Preferred Buying Locations' 
                    searchbarlabel='Search or add Cities and Countries' 
                    tagname='Location'
                    options={predefinedTags.locations} 
                    formState={locationsBuying}
                    categoryname={'territories'}
                    subcategoryname={'buying'}
                    optional
                />
            </View>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Preferred Selling Locations</Text>
                <TagSearchList 
                    placeholder='Search or add Preferred Locations' 
                    label='Select all countries and cities you can operate in, where you can help us sell to buyers.' 
                    sheetlabel='Preferred Selling Locations' 
                    searchbarlabel='Search or add Cities and Countries' 
                    tagname='Location'
                    options={predefinedTags.locations} 
                    formState={locationsSelling}
                    categoryname={'territories'}
                    subcategoryname={'selling'}
                    optional
                />
            </View>
            <View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={formStyles.formActionContainer}>
                    <Text style={formStyles.formAction}>Return to Selling Preferences</Text>
                </TouchableOpacity>
                <Button label='Continue' onPress={() => saveOnboardingTerritoresForm()}/>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
});

export default OnboardingTerritoresPage;