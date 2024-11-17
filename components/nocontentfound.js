import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';

function NoContentFound({ title = 'No Content Found', message = 'No content found for this section.' }) {
    return (
        <View style={styles.centerContentContainer}>
            <View style={styles.infoContiner}>
                <Text style={styles.infoText}>{title}</Text>
                <Text style={styles.infoSubtext}>{message}</Text>
            </View>
        </View> 
    )
}

const styles = StyleSheet.create({
    centerContentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    infoContiner: {
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: colors.LightGray,
        borderRadius: 8,

        paddingVertical: 16,
        paddingHorizontal: 24,

        maxWidth: Dimensions.get('window').width * 0.8,
    },

    infoText: {
        ...fontSizes.heading_small,
        color: colors.DarkGray,
    },

    infoSubtext: {
        ...fontSizes.body,
        color: colors.DarkGray,

        marginTop: 8,
        textAlign: 'center',
    },
});

export default NoContentFound;