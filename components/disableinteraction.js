import React, { useState } from 'react';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import colors from '../styles/colors';

function DisableInteraction() {
    const [disableInteraction, setDisableInteraction] = useState(false);

    DeviceEventEmitter.addListener('disableInteraction', () => {
        setDisableInteraction(true);
    });

    DeviceEventEmitter.addListener('enableInteraction', () => {
        setDisableInteraction(false);
    });

    return (
        disableInteraction && <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.DarkGray20 }]}></View>
    )
}

export default DisableInteraction;