import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import fontSizes from '../styles/fonts';
import shadows from '../styles/shadows';

const PointingView = ({
    label = null,
    containerStyle = null,
    bubbleStyle = null,
    pointerStyle = null
}) => {
    return (
        <View style={[styles.container, { ...containerStyle }]}>
            <View style={[styles.pointer, { ...pointerStyle }]} />
            <View style={[styles.bubble, { ...bubbleStyle }]}>
                <Text style={styles.bubbleText}>{label}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    pointer: {
        transform: [{ rotate: '-90deg' }],
        borderTopWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 20,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: '#603619',
    },
    bubble: {
        backgroundColor: '#603619',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,

        ...shadows.shadowLight
    },
    bubbleText: {
        ...fontSizes.body_small,
        color: colors.White,
    },
});

export default PointingView;
