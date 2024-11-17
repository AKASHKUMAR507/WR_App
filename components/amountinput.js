import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SearchList } from "./form_inputs/searchlists";
import { GetCitiesByCountry, GetCountries, GetCountryByDialCode, GetCurrencies, GetCurrenciesArray, GetCurrencyCodeByName, GetCurrencyNameByCode, GetDialCodesByCountry } from "../utilities/atlas/atlas";
import colors from "../styles/colors";
import CountryFlag from "./atoms/countryflag";
import fontSizes from "../styles/fonts";
import { FormInputText, TextInputTypes } from "./form_inputs/inputs";
import FormInputWrapper from "./forminputwrapper";

function CurrencyRenderComponent({ currency }) {
    return (
        <View style={styles.currencyRenderer}>
            <Text style={styles.currencyText}>{GetCurrencyCodeByName(currency)}</Text>
        </View>
    )
}

function AmountInput({
    label = 'Amount',
    currencyPlaceholder = '',
    formStateCurrency = { value: null, onChangeValue: () => {}, error: null, updateError: () => {}, clearError: () => {}, validate: () => {} },
    formStateAmount = { value: null, onChangeValue: () => {}, error: null, updateError: () => {}, clearError: () => {}, validate: () => {} },
}) {
    const currencies = GetCurrencies();

    return (
        <View style={styles.currencyInputContainer}>
            <FormInputWrapper 
                formState={formStateCurrency} 
                valueOverride={GetCurrencyNameByCode(formStateCurrency.value)} 
                onChangeValueOverride={(value) => GetCurrencyCodeByName(value)}
                component={<SearchList 
                    dataKey='currency'
                    renderComponent={<CurrencyRenderComponent/>} 
                    label={label}
                    options={currencies}
                />
            }/>
            <View style={styles.currencyInputSubcontainer}>
                <FormInputWrapper formState={formStateAmount} component={
                    <FormInputText 
                        inputType={TextInputTypes.numeric} 
                        label={''} 
                        placeholder={currencyPlaceholder} 
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

    currencyInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    currencyInputSubcontainer: {
        flex: 1,
    },

    currencyRenderer: {
        borderBottomWidth: 1.5,
        borderColor: colors.Gray,

        paddingVertical: Platform.OS === 'ios' ? 4 : 2,

        backgroundColor: colors.LightGray20,

        marginTop: 4,
    },

    currencyText: {
        ...fontSizes.body,

        color: colors.Black80,
        paddingVertical: Platform.OS === 'ios' ? 4 : 2,
    },
});

export default AmountInput;