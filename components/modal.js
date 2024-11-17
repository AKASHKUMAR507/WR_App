import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';

const DialogBox = ({
    visible = null,
    onRequestClose = () => { },
    label = null,
    children
}) => {

    return (
        <View style={styles.container}>
            <Modal
                transparent={true}
                animationType="fade"
                visible={visible}
                onRequestClose={onRequestClose}
            >
                <TouchableOpacity activeOpacity={0.8} onPress={onRequestClose} style={styles.modalBackground}>
                    <View style={styles.card}>
                        {label && <Text style={styles.cardText}>{label}</Text>}
                        {children}
                        <TouchableOpacity activeOpacity={0.8} onPress={onRequestClose}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.Black90,
    },
    card: {
        width: 300,
        paddingVertical: 12,
        backgroundColor: colors.White,
        borderRadius: 8,
        alignItems: 'center',
        paddingHorizontal: 16
    },
    cardText: {
        ...fontSizes.body_small,
        fontSize: 16,
        color: colors.DarkGray
    },
    closeButton: {
        color: colors.Primary,
        ...fontSizes.heading_medium
    },
});

export default DialogBox;
