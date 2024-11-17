import React from 'react';
import { TextInput, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import VectorImage from 'react-native-vector-image';

const MenuButtonTypes = {
    Default: 'Default',
    Danger: 'Danger',
}

function MenuButton({
    onPress = () => {},
    label = "Menu Button Label",
    spinner = false,
    disabled = false,
    indicator = false,
    type = MenuButtonTypes.Default,
}) {
    return (
        <MenuButtonGeneric type={type} onPress={onPress} label={label} indicator={indicator} spinner={spinner} disabled={disabled}/>
  	);
}

function MenuButtonGeneric({
    onPress,
    label,
    spinner,
    disabled,
    indicator,
    type,
}) {
    const menuButtonBackgroundStyle = [styles.menuButtonStyle, disabled && { backgroundColor: colors.LightGray80 }];
    const menuButtonLabelStyle = [styles.menuButtonLabelStyle, { color: type === MenuButtonTypes.Danger ? colors.Error : colors.Black }, disabled && { color: colors.DarkGray }]

    return (
        <TouchableOpacity testID={`${label}:menubutton`} style={menuButtonBackgroundStyle} disabled={disabled || spinner} activeOpacity={0.8} onPress={onPress}>
            { 
                spinner ? 
                <ActivityIndicator size={'small'} color={type === MenuButtonTypes.Danger ? colors.Error : colors.DarkGray} animating={spinner}/> : 
                <View style={styles.menuButtonRow}>
                    <View style={styles.row}>
                        { indicator && <View style={styles.indicator}/> }
                        <Text style={menuButtonLabelStyle} testID={label}>{label}</Text>
                    </View>
                    {
                        type === MenuButtonTypes.Danger ?
                        <VectorImage source={require('../../assets/icons/chevron-right-danger.svg')}/> :
                        <VectorImage source={require('../../assets/icons/chevron-right.svg')}/>
                    }
                </View>
            }
        </TouchableOpacity>
  	);
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    menuButtonStyle: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 12,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    menuButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    menuButtonLabelStyle: {
        ...fontSizes.body,
        color: colors.Black,
    },

    indicator: {
        width: 12,
        height: 12,
        borderRadius: 6,

        backgroundColor: colors.Error,
        marginRight: 8,
    },
});

export default MenuButton;
export { MenuButtonTypes };