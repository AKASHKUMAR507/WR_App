import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import fontSizes from "../../styles/fonts";
import { CountryFlagEmoji } from "../../utilities/atlas/atlas";
import colors from "../../styles/colors";
import { useEffect, useState } from "react";

function CountryFlag({ country, showCountryName = true, containerStyles = {}, textStyles = {}, children }) {
    return (
        <View style={[styles.countryFlag, containerStyles]}>
            <Text style={[Platform.OS === 'ios' ? { ...fontSizes.heading_large } : { ...fontSizes.heading_small }, styles.countryFlagEmoji]}>{CountryFlagEmoji(country)}</Text>
            { showCountryName && <Text style={[styles.countryFlagText, textStyles]}> {country}</Text> }
            { children }
        </View>
    )
}

const styles = StyleSheet.create({
    countryFlag: {
        flexDirection: 'row',
        alignItems: 'center',

        marginRight: 12,
        marginBottom: 8,
    },

    countryFlagIcon: {
        backgroundColor: colors.Gray,

        marginRight: 4,
    },

    countryFlagText: {
        ...fontSizes.body_small,
        color: colors.DarkGray,
    },

    countryFlagEmoji: {
        color: colors.Black,
    },
});

export default CountryFlag;