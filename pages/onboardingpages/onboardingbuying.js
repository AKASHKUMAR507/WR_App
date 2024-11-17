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

function OnboardingBuyingPage(props) {
    const navigation = useNavigation();

    const productsBuying = useFormState([]);
    const servicesBuying = useFormState([]);

    const setCurrentOnboardingPage = useCurrentOnboardingPageStore(state => state.setCurrentOnboardingPage);

    const addOnboardingInfo = useOnboardingInfoStore(state => state.addOnboardingInfo);
    const onboardingInfo = useOnboardingInfoStore(state => state.onboardingInfo);

    const predefinedTags = usePredefinedTagsDataStore(state => state.predefinedTags);

    useFocusEffect(useCallback(() => {
        setCurrentOnboardingPage(OnboardingPages.Buying);
    }, []));

    useEffect(() => {
        prefillValues();
    }, []);

    const prefillValues = () => {
        productsBuying.onChangeValue(onboardingInfo.productsBuying || []);
        servicesBuying.onChangeValue(onboardingInfo.servicesBuying || []);
    }

    const validateOnboardingBuyingFrom = () => {
        return true;
    }

    const saveOnboardingBuyingForm = () => {
        if (!validateOnboardingBuyingFrom()) return;

        addOnboardingInfo({
            productsBuying: productsBuying.value,
            servicesBuying: servicesBuying.value,
        });

        navigation.navigate('OnboardingSelling');
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={[formStyles.formContainer, { flexGrow: 1, justifyContent: 'space-between' }]}>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Buying Preferences (Products)</Text>
                <TagSearchList 
                    placeholder='Search or add Products' 
                    label='Select all products, equipment or systems you can help our clients source / buy.' 
                    sheetlabel='Buying Products' 
                    searchbarlabel='Search or add Products' 
                    tagname='Product'
                    options={predefinedTags.products} 
                    formState={productsBuying}
                    categoryname={'products'}
                    subcategoryname={'buying'}
                    optional
                />
            </View>
            <View style={formStyles.formSection}>
                <Text style={formStyles.formSectionTitle}>Buying Preferences (Services)</Text>
                <TagSearchList 
                    placeholder='Search or add Services' 
                    label='Select all services you can help our clients source / buy.' 
                    sheetlabel='Buying Services' 
                    searchbarlabel='Search or add Services' 
                    tagname='Service'
                    options={predefinedTags.services} 
                    formState={servicesBuying}
                    categoryname={'services'}
                    subcategoryname={'buying'}
                    optional
                />
            </View>
            <View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={formStyles.formActionContainer}>
                    <Text style={formStyles.formAction}>Return to Industry Information</Text>
                </TouchableOpacity>
                <Button label='Continue' onPress={() => saveOnboardingBuyingForm()}/>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
});

export default OnboardingBuyingPage;