import React, { useEffect, useState } from 'react';
import { TextInput, View, Text, StyleSheet, LayoutAnimation, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import inputStyles from './inputStyles';
import Pandora from '../../utilities/pandora';

function Radio({
    label = "Input Label",
    optional = false,
    active = false,
    onToggle = () => {},
    error = false,
    errorMessage = "Mandatory input",
    selectionColor = colors.Primary,
    feedback = true,
}) {
    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [active]);

    const onPress = () => {
        feedback && Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);
        onToggle();
    }

  	return (
        <View style={inputStyles.inputContainer}>
            <TouchableOpacity testID={`${label}:radioinput`} style={inputStyles.row} activeOpacity={0.8} onPress={onPress}>
                <View style={[styles.radio, { borderColor: error ? colors.Error : active ? selectionColor : colors.DarkGray }]}>
                    { active && <View style={[styles.radioInner, { backgroundColor: selectionColor }]}></View> }
                </View>
                <Text style={inputStyles.inputLabel}>{label} { optional && <Text style={inputStyles.inputOptional}>(Optional)</Text> }</Text>
            </TouchableOpacity>
            { error && <Text style={inputStyles.error}>{errorMessage}</Text> }
        </View>
  	);
}

const styles = StyleSheet.create({
    radio: {
        width: 20,
        height: 20,

        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.DarkGray,

        marginRight: 8,

        alignItems: 'center',
        justifyContent: 'center',
    },

    radioInner: {
        width: 12,
        height: 12,

        borderRadius: 6,
    },
});

export { Radio }