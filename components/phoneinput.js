import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SearchList } from "./form_inputs/searchlists";
import { GetCitiesByCountry, GetCountries, GetCountryByDialCode, GetDialCodesByCountry } from "../utilities/atlas/atlas";
import colors from "../styles/colors";
import CountryFlag from "./atoms/countryflag";
import fontSizes from "../styles/fonts";
import { FormInputText, TextInputTypes } from "./form_inputs/inputs";
import FormInputWrapper from "./forminputwrapper";
import inputStyles from "./form_inputs/inputStyles";

function CountryCodeRenderComponent({ country }) {
    return (
        <View style={styles.countryCodeRenderer}>
            <CountryFlag showCountryName={false} country={country} containerStyles={{ marginBottom: 0 }} textStyles={{ color: colors.Black, ...fontSizes.body, marginLeft: 8 }}>
                <Text style={styles.countryCodeText}>&nbsp;({GetDialCodesByCountry(country)})</Text>
            </CountryFlag>
        </View>
    )
}

function CountryListComponent({ country, selected }) {
    return (
        <View style={[styles.countryList, { paddingHorizontal: 16 }, selected && { backgroundColor: colors.LightGray }]}>
            <CountryFlag country={country} containerStyles={{ marginBottom: 0 }} textStyles={{ color: colors.Black, ...fontSizes.body, marginLeft: 8 }}>
                <Text style={styles.countryCodeText}>&nbsp;({GetDialCodesByCountry(country)})</Text>
            </CountryFlag>
        </View>
    )
}

function PhoneInput({
    label = 'Phone Number',
    phonePlaceholder = '',
    formStateCountryCode = { value: null, onChangeValue: () => {}, error: null, updateError: () => {}, clearError: () => {}, validate: () => {} },
    formStatePhoneNumber = { value: null, onChangeValue: () => {}, error: null, updateError: () => {}, clearError: () => {}, validate: () => {} },
}) {
    const countries = GetCountries();

    return (
        <View style={styles.phoneInputContainer}>
            <FormInputWrapper 
                formState={formStateCountryCode} 
                valueOverride={GetCountryByDialCode(formStateCountryCode.value)} 
                onChangeValueOverride={(value) => GetDialCodesByCountry(value)}
                component={<SearchList 
                    renderComponent={<CountryCodeRenderComponent/>} 
                    listComponent={<CountryListComponent/>} 
                    dataKey="country" 
                    label={label}
                    options={countries}
                />
            }/>
            <View style={styles.phoneInputSubcontainer}>
                <FormInputWrapper formState={formStatePhoneNumber} component={
                    <FormInputText 
                        inputType={TextInputTypes.phone} 
                        label={''} 
                        placeholder={phonePlaceholder} 
                        maxLength={16}
                    />
                }/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    countryList: {
        paddingVertical: 8,
    },

    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    phoneInputSubcontainer: {
        flex: 1,
    },

    countryCodeRenderer: {
        borderBottomWidth: 1.5,
        borderColor: colors.Gray,

        paddingVertical: Platform.OS === 'ios' ? 4 : 2,

        backgroundColor: colors.LightGray20,

        marginTop: 4,
    },

    countryCodeText: {
        ...fontSizes.body,

        color: colors.Black80,
        paddingVertical: Platform.OS === 'ios' ? 4 : 2,
    },
});

export default PhoneInput;