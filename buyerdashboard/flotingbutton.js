import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import shadows from '../styles/shadows'
import VectorImage from 'react-native-vector-image'
import colors from '../styles/colors'

const FloatingButton = ({
    onPress = () => { },
    style = {}
}) => {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={onPress}>
            <VectorImage style={[styles.buttonIcon, { ...style }]} source={require('../assets/icons/arrow-right.svg')} />
        </TouchableOpacity>
    )
}

export default FloatingButton

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        backgroundColor: colors.Primary,
        justifyContent: 'center',
        alignItems: 'center',

        bottom: 100,
        right: 24,

        width: 55,
        height: 55,

        borderRadius: 30,

        ...shadows.shadowLight
    },
    buttonIcon: {
        tintColor: colors.White,
        transform: [{ rotate: '-90deg' }],
    },
});