import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ExpandableText from '../../components/expandabletext'
import colors from '../../styles/colors'
import fontSizes from '../../styles/fonts'
import Aphrodite from '../../utilities/aphrodite'

const AdditionalChargesCard = ({ addition }) => {

    return (
        <View style={styles.card}>
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{addition.additonType}</Text>
                <ExpandableText textStyles={styles.cardBodyText} numberOfLines={3} text={addition.description} />
            </View>
            <View style={styles.cardFooter}>
                <View>
                    <Text style={styles.cardTextBold}>Percentage (%)</Text>
                    <Text style={styles.cardText}>{addition.discPrice}</Text>
                </View>
                <View>
                    <Text style={styles.cardTextBold}>Total Price</Text>
                    <Text style={styles.cardText}>USD {Aphrodite.FormatNumbers(addition.totalPrice)}</Text>
                </View>
            </View>
        </View>
    )
}

const ViewAdditional = (props) => {
    const additional = props.route.params.additional;

    return (
        additional.length > 0 &&
        additional.map((addition) => <AdditionalChargesCard key={addition.additionalsId.toString()} addition={addition} />)
    )
}

export default ViewAdditional

const styles = StyleSheet.create({
    page: {
    },

    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 24,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardBody: {
        marginVertical: 16,
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardBodyText: {
        ...fontSizes.body_small,
        color: colors.DarkGray,

        marginTop: 12,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    cardAction: {
        ...fontSizes.heading_xsmall,
        color: colors.Primary,

        marginTop: 12,
    },

    statusPills: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    indicator: {
        width: 12,
        height: 12,

        borderRadius: 6,
        backgroundColor: colors.Error,

        marginHorizontal: 4,
    },

    cardRowWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    tag: {
        backgroundColor: colors.Primary20,
        borderRadius: 16,

        paddingHorizontal: 16,
        paddingVertical: 4,

        marginRight: 8,
        marginBottom: 8,
    },

    tagText: {
        ...fontSizes.button_small,
        color: colors.Primary,
    },

    edits: {
        backgroundColor: colors.LightGray,
        borderRadius: 4,

        paddingHorizontal: 12,
        paddingVertical: 4,

        marginBottom: 12,
        alignSelf: 'flex-start',
    },

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },
});
