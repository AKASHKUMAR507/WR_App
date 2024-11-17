import React, { useEffect, useState } from 'react';
import { TextInput, View, Text, StyleSheet, LayoutAnimation, TouchableOpacity } from 'react-native';
import inputStyles from './inputStyles';
import VectorImage from 'react-native-vector-image';
import colors from '../../styles/colors';
import Pandora from '../../utilities/pandora';

function Checkbox({ params, children }) {
    const { label, optional, active, onToggle, error, errorMessage, selectionColor, feedback, } = params;
    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [active]);

    const onPress = () => {
        feedback && Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);
        onToggle();
    }

    return (
        <View style={styles.inputContainer}>
            <TouchableOpacity style={[inputStyles.row, { height: 45 }]} activeOpacity={0.8} onPress={onPress}>
                <View testID='checkboxicon' style={[styles.checkbox, { backgroundColor: active ? selectionColor : colors.White, borderColor: error ? colors.Error : active ? selectionColor : colors.DarkGray }]}>
                    {active && <VectorImage style={styles.checkmark} source={require('../../assets/icons/check.svg')} />}
                </View>
                {children}
                {!children && <Text style={inputStyles.inputLabel}>{label} {optional && <Text style={inputStyles.inputOptional}>(Optional)</Text>}</Text>}
            </TouchableOpacity>
            {error && <Text style={inputStyles.error}>{errorMessage}</Text>}
        </View>
    );
}



const PrivacyInput = ({
    label = "Toggle Input Label",
    optional = false,
    active = false,
    onToggle = () => { },
    error = false,
    errorMessage = "Mandatory input",
    selectionColor = colors.Primary,
    feedback = true,
    testID = null,
    children,
}) => {

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [active]);

    const onPress = () => {
        feedback && Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);
        onToggle();
    }

    const params = { label: null, optional, active, onToggle: () => onToggle(), error: false, errorMessage: "Mandatory input", selectionColor: colors.Primary, feedback, }

    return (
        <View style={styles.toggleContainer}>
            <TouchableOpacity style={inputStyles.row} activeOpacity={0.8} onPress={onPress} >
            <View style={styles.inputLabelContainer}><Text style={inputStyles.inputLabel}>{label}</Text></View>
                {children}
                {!children && <Checkbox params={params} />}
            </TouchableOpacity>
        </View>
    )
}

export default PrivacyInput

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

    },

    toggleContainer: { 
        justifyContent: 'center',
        paddingHorizontal: 16,

        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    checkbox: {
        width: 20,
        height: 20,

        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.DarkGray,

        // marginRight: 8,

        alignItems: 'center',
        justifyContent: 'center',
    },

    checkmark: {
        width: 16,
        height: 16,
    },
    inputLabelContainer: {
        flex: 1,

        justifyContent: 'center',
    }
});