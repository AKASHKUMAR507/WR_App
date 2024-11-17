import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../../styles/colors'
import fontSizes from '../../../styles/fonts'
import ExpandableText from '../../../components/expandabletext'
import { Checkbox } from '../../../components/form_inputs/checkboxes'

const TextMetricPair = ({
    text = "Label",
    value = "Not Specified",
    currency = null
}) => {
    return (
        <View style={styles.textMetricContainer}>
            <Text style={styles.cardText}>{text}</Text>
            <Text style={styles.cardTextBold}>{currency} {value}</Text>
        </View>
    )
}

const CardTitle = ({
    title = "Input Title"
}) => {
    return (<Text style={styles.cardTitle}>{title}</Text>)
}

const TaxesAndDuties = () => {
    return (
        <View style={styles.wrapper}>
            <CardTitle title={"Taxes and Duties"} />
            <TextMetricPair label='Nill' />
        </View>
    )
}
const Consolidation = () => {
    return (
        <View style={styles.wrapper}>
            <CardTitle title={"Consolidation"} />
            <TextMetricPair />
            <TextMetricPair />
            <TextMetricPair />
        </View>
    )
}
const ShippingAndCustomClearance = () => {
    return (
        <View style={styles.wrapper}>
            <CardTitle title={"Shipping and Custom Clearance"} />
            <TextMetricPair />
            <TextMetricPair />
            <TextMetricPair />
        </View>
    )
}
const DocumentationCharges = () => {
    return (
        <View style={styles.wrapper}>
            <CardTitle title={"Documentation Charges"} />
            <TextMetricPair />
            <TextMetricPair />
        </View>
    )
}
const AddOns = () => {
    return (
        <View style={styles.wrapper}>
            <CardTitle title={"Discounts"} />
            <Checkbox />
            <Checkbox />
            <Checkbox />
        </View>
    )
}
const Dicsounts = () => {
    return (
        <View style={styles.wrapper}>
            <CardTitle title={"Discounts"} />
            <TextMetricPair />
            <TextMetricPair />
            <TextMetricPair />
        </View>
    )
}

const ViewTakeRatePage = () => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom + 8 }]} showsVerticalScrollIndicator={false}>
                <View style={styles.wrapper}>
                    <View>
                        <Text style={styles.cardTitle}>Overall Take Rate</Text>
                        <View style={styles.cardBodyWrapper}>
                            <Text style={styles.cardBodyText}>Overall Take Rate For This Quotation</Text>
                            <Text style={styles.cardText}>10 %</Text>
                        </View>
                        {/* <Text style={styles.cardText}>Take rate is the percentage of Gross Transation Value collected lorem is the percentage of Gross Transation Value collected lorem </Text> */}
                        <ExpandableText textStyles={styles.cardText} text={'Take rate is the percentage of Gross Transation Value collected lorem is the percentage of Gross Transation Value collected lorem'} numberOfLines={2} />
                        <View style={styles.cardBodyWrapper}>
                            <Text style={styles.cardBodyText}>Value Including Take Rate</Text>
                            <Text style={styles.cardText}>USD 111.11</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <TaxesAndDuties />
                    <Consolidation />
                    <ShippingAndCustomClearance />
                    <DocumentationCharges />
                    <AddOns />
                    <Dicsounts />
                </View>
                <View style={styles.wrapper}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <CardTitle title='Final Total Estimate' />
                        <Text style={styles.cardTitle}>USD 2838</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewTakeRatePage
export { CardTitle, TextMetricPair }
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 24,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,

        gap: 12
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
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,

        marginTop: 4,
    },

    cardTextBold: {
        ...fontSizes.heading_small,
        color: colors.Black,

        textTransform: 'none',
    },

    textMetricContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingVertical: 2
    }
})