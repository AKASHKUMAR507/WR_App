import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

function LoadingPage() {
    return (
        <View style={styles.page}>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
});

export default LoadingPage;