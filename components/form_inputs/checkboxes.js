import React, { useEffect, useState } from 'react';
import { TextInput, View, Text, StyleSheet, LayoutAnimation, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import inputStyles from './inputStyles';
import VectorImage from 'react-native-vector-image';
import Pandora from '../../utilities/pandora';

function Checkbox({
    label = "Input Label",
    optional = false,
    active = false,
    onToggle = () => {},
    error = false,
    errorMessage = "Mandatory input",
    selectionColor = colors.Primary,
    feedback = true,
    testID = null,
    children,
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
            <TouchableOpacity testID={`${testID || label}:checkbox`} style={inputStyles.row} activeOpacity={0.8} onPress={onPress}>
                <View testID='checkboxicon' style={[styles.checkbox, { backgroundColor: active ? selectionColor : colors.White, borderColor: error ? colors.Error : active ? selectionColor : colors.DarkGray }]}>
                    { active && <VectorImage style={styles.checkmark} source={require('../../assets/icons/check.svg')} /> }
                </View>
                { children }
                { !children && <Text style={inputStyles.inputLabel}>{label} { optional && <Text style={inputStyles.inputOptional}>(Optional)</Text> }</Text> }
            </TouchableOpacity>
            { error && <Text style={inputStyles.error}>{errorMessage}</Text> }
        </View>
  	);
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

        marginHorizontal: 4,
        marginVertical: 4,
    },

    checkbox: {
        width: 20,
        height: 20,

        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.DarkGray,

        marginRight: 8,

        alignItems: 'center',
        justifyContent: 'center',
    },

    checkmark: {
        width: 16,
        height: 16,
    },
});

export { Checkbox }