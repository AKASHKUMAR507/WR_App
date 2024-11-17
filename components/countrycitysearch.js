import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RendererType, SearchList } from "./form_inputs/searchlists";
import { GetCitiesByCountry, GetCountries } from "../utilities/atlas/atlas";
import colors from "../styles/colors";
import CountryFlag from "./atoms/countryflag";
import fontSizes from "../styles/fonts";
import FormInputWrapper from "./forminputwrapper";

function CountryListComponent({ country, selected, containerStyles = {} }) {
    return (
        <View style={[styles.countryList, containerStyles, selected && { backgroundColor: colors.LightGray }]}>
            <CountryFlag country={country} containerStyles={{ marginBottom: 0 }} textStyles={{ color: colors.Black, ...fontSizes.body, marginLeft: 8 }} />
        </View>
    )
}

function CountryCitySearch({
    countryLabel = 'Select Country',
    countryPlaceholder = 'Select Country',
    cityLabel = 'Select City',
    cityPlaceholder = 'Select City',
    cityOptional = false,
    formStateCountry = { value: null, onChangeValue: () => { }, error: null, updateError: () => { }, clearError: () => { }, validate: () => { } },
    formStateCity = { value: null, onChangeValue: () => { }, error: null, updateError: () => { }, clearError: () => { }, validate: () => { } },
    cityPrefill = null,
}) {
    const countries = GetCountries();
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (formStateCountry.value) {
            formStateCity.onChangeValue(cityPrefill, true);
            setCities(GetCitiesByCountry(formStateCountry.value));
        }
    }, [formStateCountry.value]);

    return (
        <React.Fragment>
            <FormInputWrapper formState={formStateCountry}
                component={<SearchList
                    renderComponent={<CountryListComponent />}
                    listComponent={<CountryListComponent containerStyles={{ paddingHorizontal: 16 }} />}
                    dataKey="country"
                    label={countryLabel}
                    placeholder={countryPlaceholder}
                    options={countries}
                />}
            />
            {
                cities?.length > 0 &&
                <FormInputWrapper formState={formStateCity}
                    component={<SearchList
                        label={cityLabel}
                        placeholder={cityPlaceholder}
                        optional={cityOptional}
                        options={cities}
                        rendererType={RendererType.FlatList}
                    />}
                />
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    countryList: {
        paddingVertical: 8,
    }
});

export default CountryCitySearch;