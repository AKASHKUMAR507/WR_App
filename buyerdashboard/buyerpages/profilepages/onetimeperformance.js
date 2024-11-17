import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import colors from '../../../styles/colors'
import fontSizes from '../../../styles/fonts'
import shadows from '../../../styles/shadows'

const Card = ({ label = null, text = null }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.inputLabelStyle}>{label}</Text>
            <Text style={styles.inputTextStyle}>{text}</Text>
        </View>
    )
}

const OneTimePerformancePage = () => {
    
    return (
        <View style={styles.page}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', columnGap: 16 }}>
                <Card label={'One-Time Order'} text={23} />
                <Card label={'Number of Order'} text={30} />
            </View>

            <View style={{ alignItems: 'flex-start', backgroundColor: colors.Primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, ...shadows.shadowLight, marginTop: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', columnGap: 32}}>
                    <Text style={[styles.inputLabelStyle, { color: colors.White }]}>One Time Performance</Text>
                    <Text style={[styles.inputTextStyle, { color: colors.White }]}>78%</Text>
                </View>
                <Text style={{ ...fontSizes.body_small, color: colors.White }}>On Time Performance is the percentage of Orders delivered on time or before the agreed upon delivery date</Text>
            </View>
        </View>
    )
}

export default OneTimePerformancePage

const styles = StyleSheet.create({
    page: {
        flex: 1,

        paddingHorizontal: 16,
        paddingVertical: 24,
    },

    card: {
        flex: 1,
        backgroundColor: colors.LightGray,

        paddingHorizontal: 16,
        paddingVertical: 18,

        alignItems: 'flex-start',
        justifyContent: 'center',

        borderRadius: 8,

        ...shadows.shadowLight
    },

    inputLabelStyle: {
        ...fontSizes.heading_medium,
        color: colors.Black,
    },

    inputTextStyle: {
        ...fontSizes.heading_xlarge,
        color: colors.DarkGray,
    }
})