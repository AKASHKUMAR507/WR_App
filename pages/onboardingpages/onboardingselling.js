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

function OnboardingSellingPage(props) {
    const navigation = useNavigation();

    const productsSelling = useFormState([]);
    const servicesSelling = useFormState([]);

    const setCurrentOnboardingPage = useCurrentOnboardingPageStore(state => state.setCurrentOnboardingPage);

    const addOnboardingInfo = useOnboardingInfoStore(state => state.addOnboardingInfo);
    const onboardingInfo = useOnboardingInfoStore(state => state.onboardingInfo);

    const predefinedTags = usePredefinedTagsDataStore(state => state.predefinedTags);

    useFocusEffect(useCallback(() => {
        setCurrentOnboardingPage(OnboardingPages.Selling);
    }, []));

    useEffect(() => {
        prefillValues();
    }, []);

    const prefillValues = () => {
        productsSelling.onChangeValue(onboardingInfo.productsSelling || []);
        servicesSelling.onChangeValue(onboardingInfo.servicesSelling || []);
    }

    const validateOnboardingSellingFrom = () => {
        return true;
    }

    const saveOnboardingSellingForm = () => {
        if (!validateOnboardingSellingFrom()) return;

        addOnboardingInfo({
            productsSelling: productsSelling.value,
            servicesSelling: servicesSelling.value,
        });

        navigation.navigate('OnboardingTerritories');
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={[formStyles.formContainer, { flexGrow: 1, justifyContent: 'space-between' }]}>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Selling Preferences (Products)</Text>
                <TagSearchList 
                    placeholder='Search or add Products'
                    label='Select all products, equipment or systems for which you can generate leads and help us sell to buyers.' 
                    sheetlabel='Selling Products' 
                    searchbarlabel='Search or add Products' 
                    tagname='Product'
                    options={predefinedTags.products} 
                    formState={productsSelling}
                    categoryname={'products'}
                    subcategoryname={'selling'}
                    optional
                />
            </View>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Selling Preferences (Services)</Text>
                <TagSearchList 
                    placeholder='Search or add Services' 
                    label='Select all services for which you can generate leads and help us sell to buyers.' 
                    sheetlabel='Selling Services' 
                    searchbarlabel='Search or add Services' 
                    tagname='Service'
                    options={predefinedTags.services} 
                    formState={servicesSelling}
                    categoryname={'services'}
                    subcategoryname={'selling'}
                    optional
                />
            </View>
            <View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={formStyles.formActionContainer}>
                    <Text style={formStyles.formAction}>Return to Buying Preferences</Text>
                </TouchableOpacity>
                <Button label='Continue' onPress={() => saveOnboardingSellingForm()}/>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
});

export default OnboardingSellingPage;