import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardTitle, TextMetricPair } from './viewtakeratepage';
import colors from '../../../styles/colors';
import fontSizes from '../../../styles/fonts';
import ExpandableText from '../../../components/expandabletext';
import { FlashList } from '@shopify/flash-list';
import NoContentFound from '../../../components/nocontentfound';
import SkeletonContainer from '../../../components/skeletons';

const lineItems = [
    {
        System: 'Boiler (50 TPH, 65 bar, 480 Deg C, Traveling Grate Type, Biomass + Coal Fired)',
        Subsystem: "Feed Water Station",
        ProductID: '1244',
        Manufacture: 'ABC Pvt, Ltd',
        ManufacturePortNo: "12313",
        Hns: "212",
        TagNo: 'PWD-dsa',
        description: `Model : PRV / PRCSize Range : 1/2" to 10 "Body : S.S.304 / S.S.316Press Adj. Range : 1˜ 6 kg / cm2, 4 10 kg / cm2, 20  35 kg / cm2Max inlet Press : 18 kg / cm2, 40kg `,
        Category: "Piping System",
        SubCategory: "Valves",
        ProductType: 'Safety valves',
        Quantity: "01",
        SellerPrice: '1000',
        SoldBy: "XYZ Pvt, Ltd India",
        LeadTime: "10"
    },
    {
        System: 'Boiler (30 TPH, 70 bar, 500 Deg C, Circulating Fluidized Bed Type, Biomass Fired)',
        Subsystem: "Boiler House",
        ProductID: '9876',
        Manufacture: 'DEF Corporation',
        ManufacturePortNo: "45678",
        Hns: "150",
        TagNo: 'ASD-qwe',
        description: `Model : PRV / PRCSize Range : 1/2" to 10 "Body : S.S.304 / S.S.316Press Adj. Range : 1˜ 6 kg / cm2, 4 10 kg / cm2, 20  35 kg / cm2Max inlet Press : 18 kg / cm2, 40kg `,
        Category: "Boiler Equipment",
        SubCategory: "Pumps",
        ProductType: 'Centrifugal pumps',
        Quantity: "03",
        SellerPrice: '2500',
        SoldBy: "LMN Corporation",
        LeadTime: "15"
    },
    {
        System: 'Cooling Tower (1000 TR, Counter Flow Type, FRP Construction)',
        Subsystem: "Cooling Water System",
        ProductID: '5678',
        Manufacture: 'GHI Industries',
        ManufacturePortNo: "78901",
        Hns: "375",
        TagNo: 'ZXC-123',
        description: `Model : PRV / PRCSize Range : 1/2" to 10 "Body : S.S.304 / S.S.316Press Adj. Range : 1˜ 6 kg / cm2, 4 10 kg / cm2, 20  35 kg / cm2Max inlet Press : 18 kg / cm2, 40kg `,
        Category: "Cooling Tower Equipment",
        SubCategory: "Fans",
        ProductType: 'Axial fans',
        Quantity: "02",
        SellerPrice: '1800',
        SoldBy: "OPQ Supplies",
        LeadTime: "12"
    },
];

const FormSectionTitle = ({
    sectionTitle = "Input Title"
}) => {
    return (
        <Text style={styles.formSectionTitle}>{sectionTitle}</Text>
    )
}

const QuoteLineItemCard = ({
    index,
    system,
    subSystem,
    productId,
    manufacture,
    manufacturePortNo,
    hsn,
    tagNo,
    description,
    category,
    subCategory,
    productType,
    quantity,
    sellerPrice,
    soldBy,
    leadTime,
}) => {

    return (
        <View style={styles.container}>
            <FormSectionTitle sectionTitle={`Line Item (${index + 1})`} />
            <View>
                <CardTitle title='System' />
                <ExpandableText text={system} />
            </View>
            <View>
                <CardTitle title='Sub System' />
                <ExpandableText text={subSystem} />
            </View>

            <CardTitle title='Name' />
            <View>
                <TextMetricPair text='Product ID' value={productId} />
                <TextMetricPair text='Manufacture' value={manufacture} />
                <TextMetricPair text='Manufacture Port No' value={manufacturePortNo} />
                <TextMetricPair text='HSN' value={hsn} />
                <TextMetricPair text='Tag No' value={tagNo} />
            </View>

            <CardTitle title='Description' />
            <View>
                {description &&
                    <ExpandableText text={description} />
                }
                <TextMetricPair text='Category' value={category} />
                <TextMetricPair text='Sub Category' value={subCategory} />
                <TextMetricPair text='Product Type' value={productType} />
                <TextMetricPair text='Quantity' value={quantity} />
                <TextMetricPair text='Seller Price' value={`USD ${sellerPrice}`} />
                <TextMetricPair text='Sold By' value={soldBy} />
                <TextMetricPair text='Lead Time' value={leadTime} />
            </View>
        </View>
    )
}

const LineItems = ({ lineItems, index }) => {
    return (
        <QuoteLineItemCard
            index={index}
            system={lineItems.System}
            subSystem={lineItems.Subsystem}
            productId={lineItems.ProductId}
            manufacture={lineItems.Manufacture}
            manufacturePortNo={lineItems.ManufacturePortNo}
            hsn={lineItems.Hsn}
            tagNo={lineItems.TagNo}
            description={lineItems.description}
            category={lineItems.Category}
            subCategory={lineItems.SubCategory}
            productType={lineItems.ProductType}
            quantity={lineItems.Quantity}
            sellerPrice={lineItems.SellerPrice}
            soldBy={lineItems.SoldBy}
            leadTime={lineItems.LeadTime}
        />
    )
}

const QuotationContainer = ({ quotation }) => {
    const insets = useSafeAreaInsets();

    return (
        quotation ?
            (
                quotation.length > 0 ?
                    <FlashList data={quotation} renderItem={({ item, index }) => <LineItems lineItems={item} index={index} key={index} />} estimatedItemSize={500} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }} /> :
                    <NoContentFound title={'No Quotation Line Item Found'} message={'Could not find any Quotation Line Item matching your current preferences.'} />
            ) :
            <SkeletonContainer child={<QuoteLineItemCard deal={quotationLineItems} />} />
    )
}

const ViewBuyerQuoteLineItem = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <React.Fragment>
            <QuotationContainer quotation={lineItems} />
        </React.Fragment>
    )
}

export default ViewBuyerQuoteLineItem
export { LineItems, lineItems}

const styles = StyleSheet.create({
    page: {

    },
    container: {
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
        ...fontSizes.body_small,
        color: colors.DarkGray,
    },

    cardBodyText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,

        marginTop: 4,
    },

    cardBodyWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    formSectionTitle: {
        ...fontSizes.heading,
        color: colors.Black,

        marginBottom: 8,
    },
})