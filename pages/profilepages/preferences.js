import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, DeviceEventEmitter, LayoutAnimation } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import { useUserStore } from '../../stores/stores';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import { PreferencesModeSelector, PreferencesModes } from '../../components/modeselectors';
import TagSearchList from '../../components/tagsearchlist';
import formStyles from '../../styles/formStyles';
import useFormState from '../../hooks/formstate';
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview';
import { Button } from '../../components/atoms/buttons';
import { usePredefinedTagsDataStore, useUserTagsDataStore } from '../../stores/datastores';
import useRefreshScreens from '../../hooks/refreshscreens';
import { UpdateUserTags } from '../../network/models/tags';

function Preferences({ subcategoryname, formStateIndustries, formStateProducts, formStateServices, formStateLocations }) {
    const predefinedTags = usePredefinedTagsDataStore(state => state.predefinedTags);

    return (
        <KeyboardAwareScrollView contentContainerStyle={[formStyles.formContainer, styles.page]}>
            <TagSearchList
                placeholder='Search or add Industries'
                label='Industry Preferences'
                sheetlabel='Industry Preferences'
                searchbarlabel='Search or add Industries'
                tagname='Industry'
                options={predefinedTags.industries}
                formState={formStateIndustries}
                categoryname={'industries'}
                subcategoryname={subcategoryname}
            />
            <TagSearchList
                placeholder='Search or add Products'
                label='Product Preferences'
                sheetlabel='Product Preferences'
                searchbarlabel='Search or add Products'
                tagname='Product'
                options={predefinedTags.products}
                formState={formStateProducts}
                categoryname={'products'}
                subcategoryname={subcategoryname}
            />
            <TagSearchList
                placeholder='Search or add Services'
                label='Service Preferences'
                sheetlabel='Service Preferences'
                searchbarlabel='Search or add Services'
                tagname='Service'
                options={predefinedTags.services}
                formState={formStateServices}
                categoryname={'services'}
                subcategoryname={subcategoryname}
            />
            <TagSearchList
                placeholder='Search or add Locations'
                label='Location Preferences'
                sheetlabel='Location Preferences'
                searchbarlabel='Search or add Locations'
                tagname='Location'
                options={predefinedTags.locations}
                formState={formStateLocations}
                categoryname={'territories'}
                subcategoryname={subcategoryname}
            />
        </KeyboardAwareScrollView>
    )
}

function PreferencesPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const refreshScreens = useRefreshScreens();

    const createAlert = useContext(AlertBoxContext);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [preferencesMode, setPreferencesMode] = useState(PreferencesModes.Selling);
    const [loading, setLoading] = useState(false);

    const userTags = useUserTagsDataStore(state => state.userTags);
    const user = useUserStore(state => state.user);

    const onValueChange = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setHasUnsavedChanges(true);
    }

    const sellingIndustries = useFormState(userTags.sellingTags.industries, onValueChange);
    const sellingProducts = useFormState(userTags.sellingTags.products, onValueChange);
    const sellingServices = useFormState(userTags.sellingTags.services, onValueChange);
    const sellingLocations = useFormState(userTags.sellingTags.locations, onValueChange);

    const buyingIndustries = useFormState(userTags.buyingTags.industries, onValueChange);
    const buyingProducts = useFormState(userTags.buyingTags.products, onValueChange);
    const buyingServices = useFormState(userTags.buyingTags.services, onValueChange);
    const buyingLocations = useFormState(userTags.buyingTags.locations, onValueChange);

    const memoisedSellingPreferences = useMemo(() =>
        <Preferences
            subcategoryname={'selling'}
            formStateIndustries={sellingIndustries}
            formStateProducts={sellingProducts}
            formStateServices={sellingServices}
            formStateLocations={sellingLocations}
        />,
        [sellingIndustries, sellingProducts, sellingServices, sellingLocations]);

    const memoisedBuyingPreferences = useMemo(() =>
        <Preferences
            subcategoryname={'buying'}
            formStateIndustries={buyingIndustries}
            formStateProducts={buyingProducts}
            formStateServices={buyingServices}
            formStateLocations={buyingLocations}
        />,
        [buyingIndustries, buyingProducts, buyingServices, buyingLocations]);

    const getConsolidatedTags = () => {
        const tags = [];

        tags.push(...sellingIndustries.value);
        tags.push(...sellingProducts.value);
        tags.push(...sellingServices.value);
        tags.push(...sellingLocations.value);

        tags.push(...buyingIndustries.value);
        tags.push(...buyingProducts.value);
        tags.push(...buyingServices.value);
        tags.push(...buyingLocations.value);

        return tags;
    }

    const submitTagsChanges = async () => {
        try {
            setLoading(true);
            DeviceEventEmitter.emit('disableInteraction');

            const tags = getConsolidatedTags();
            await UpdateUserTags({ tagslist: tags, userrefid: user.userrefid });

            refreshScreens.scheduleRefreshScreen('Profile');
            createAlert(Alert.Success('Successfully updated preferences'));
            navigation.goBack();
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
            <PreferencesModeSelector mode={preferencesMode} onChangeMode={(mode) => setPreferencesMode(mode)} />
            {
                preferencesMode === PreferencesModes.Selling ?
                    memoisedSellingPreferences :
                    memoisedBuyingPreferences
            }
            {
                hasUnsavedChanges &&
                <React.Fragment>
                    <View style={{ height: 64 }} />
                    <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
                        <Button label='Save Changes' spinner={loading} onPress={submitTagsChanges} />
                    </View>
                </React.Fragment>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    page: {
        flexGrow: 1,
    },

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
});

export default PreferencesPage;