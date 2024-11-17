import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import fontSizes from '../styles/fonts'
import colors from '../styles/colors'

const DealManagerCard = ({
    name,
    mobile,
    email
}) => {
    return (
        <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Deal Manager</Text>
            <View style={styles.cardHeader}>
                <Text style={styles.idText}>Name</Text>
                <Text style={styles.idText}>{name}</Text>
            </View>
            <View style={styles.cardHeader}>
                <Text style={styles.idText}>Mobile No</Text>
                <Text style={styles.idText}>{mobile}</Text>
            </View>
            <View style={styles.cardHeader}>
                <Text style={styles.idText}>Email</Text>
                <Text style={styles.idText}>{email}</Text>
            </View>
        </View>
    )
}

export default DealManagerCard

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
        paddingBottom: 4
    },

    cardBody: {
        marginVertical: 16,
    },
    idText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },
})