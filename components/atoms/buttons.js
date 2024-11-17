import React, { useEffect } from 'react';
import { TextInput, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, LayoutAnimation } from 'react-native';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';

const ButtonSizes = {
    large: 'large',
    medium: 'medium',
    small: 'small',
}

const ButtonTypes = {
    primary: 'primary',
    secondary: 'secondary',
}

const SpinnerSizes = {
    large: 20,
    medium: 16,
    small: 14,
}

function Button({
    onPress = () => {},
    label = "Button Label",
    spinner = false,
    disabled = false,
    size = ButtonSizes.medium,
    type = ButtonTypes.primary,
    bgStyle = {},
    labelStyle = {},
}) {
    return (
        <ButtonGeneric bgStyleCustom={bgStyle} labelStyleCustom={labelStyle} onPress={onPress} label={label} type={type} spinner={spinner} disabled={disabled} size={size}/>
  	);
}

function ButtonGeneric({
    onPress,
    label,
    spinner,
    disabled,
    size,
    type,
    bgStyleCustom,
    labelStyleCustom,
}) {
    const labelStyles = {
        [ButtonSizes.large]: [styles.buttonGenericTextLarge],
        [ButtonSizes.medium]: [styles.buttonGenericTextMedium],
        [ButtonSizes.small]: [styles.buttonGenericTextSmall],
    }

    const labelStyle = labelStyles[size];

    const buttonLabelStyles = {
        [ButtonTypes.primary]: styles.buttonPrimaryLabel,
        [ButtonTypes.secondary]: styles.buttonSecondaryLabel,
    }

    const buttonLabelStyle = buttonLabelStyles[type];

    const backgroundStyles = {
        [ButtonSizes.large]: [styles.buttonGenericBackground, styles.buttonGenericPaddingLarge],
        [ButtonSizes.medium]: [styles.buttonGenericBackground, styles.buttonGenericPaddingMedium],
        [ButtonSizes.small]: [styles.buttonGenericBackground, styles.buttonGenericPaddingSmall],
    }

    const backgroundStyle = backgroundStyles[size];

    const spinnerColors = {
        [ButtonTypes.primary]: colors.White,
        [ButtonTypes.secondary]: colors.Primary,
    }

    const spinnerColor = spinnerColors[type];

    const spinnerSizes = {
        [ButtonSizes.large]: SpinnerSizes.large,
        [ButtonSizes.medium]: SpinnerSizes.medium,
        [ButtonSizes.small]: SpinnerSizes.small,
    }

    const spinnerSize = spinnerSizes[size];

    const backgroundColors = {
        [ButtonTypes.primary]: styles.buttonPrimaryBackground,
        [ButtonTypes.secondary]: styles.buttonSecondaryBackground,
    }

    const backgroundColor = disabled ? styles.buttonDisabledBackground : backgroundColors[type];

    const buttonStyles = [backgroundStyle, backgroundColor, bgStyleCustom];
    const combinedLabelStyle = [labelStyle, buttonLabelStyle, labelStyleCustom];

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [disabled]);

    return (
        <TouchableOpacity testID={`${label}:button`} style={buttonStyles} disabled={disabled || spinner} activeOpacity={0.8} onPress={onPress}>
            { 
                spinner ? 
                <ActivityIndicator size={spinnerSize} color={spinnerColor} animating={spinner}/> : 
                <Text style={combinedLabelStyle} testID={label} >{label}</Text>
            }
        </TouchableOpacity>
  	);
}

const styles = StyleSheet.create({
    buttonGenericBackground: {
        borderRadius: 8,
        borderWidth: 2,

        justifyContent: 'center',
        alignItems: 'center',

        marginVertical: 4,
        //marginHorizontal: 4,
    },

    buttonGenericPaddingSmall: {
        paddingVertical: 6,
        paddingHorizontal: 8,
    },

    buttonGenericPaddingMedium: {
        paddingVertical: 8,
        paddingHorizontal: 14,
    },

    buttonGenericPaddingLarge: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },

    buttonGenericTextLarge: {
        ...fontSizes.button_large,
    },

    buttonGenericTextMedium: {
        ...fontSizes.button,
    },

    buttonGenericTextSmall: {
        ...fontSizes.button_small,
    },

    buttonDisabledBackground: {
        backgroundColor: colors.Primary80,
        borderColor: colors.Primary80,
    },

    buttonPrimaryBackground: {
        backgroundColor: colors.Primary,
        borderColor: colors.Primary,
    },

    buttonSecondaryBackground: {
        backgroundColor: colors.White,
        borderColor: colors.Primary,
    },

    buttonPrimaryLabel: {
        color: colors.White,
    },

    buttonSecondaryLabel: {
        color: colors.Primary,
    },
});

export { Button, ButtonSizes, ButtonTypes }