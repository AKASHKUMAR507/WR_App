import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React from 'react'
import pageStyles from '../../../styles/pageStyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ImageViewCard from '../../../components/imageviewcard'
import MenuItemCard from '../../../components/menuitemcard'
import colors from '../../../styles/colors'
import MenuButton from '../../../components/atoms/menubutton'
import fontSizes from '../../../styles/fonts'
import { useNavigation } from '@react-navigation/native'
import TagPills from '../../../components/tagpills'

const fallbackImage = require('../../../assets/images/placeholder.png');

const normalizeAttachment = (data) => {
    const normalize = {
        attachmentfileid: data.attachmentFileId,
        attachmentfilename: data.attachmentFileName,
        attachmentid: data.attachmentId,
        category: data.category,
        imageUrl: data.imageUrl,
        module: 'catalog'
    }

    return [normalize]
};

const ProductSpecificationsCard = ({ productSpecifications }) => {
    return (
        <MenuItemCard label={productSpecifications?.parameter} value={productSpecifications?.value} />
    )
}

const SpareDetailsPage = (props) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const { productParts } = props.route.params;

    return (
        <ScrollView style={pageStyles.page} contentContainerStyle={{ paddingBottom: insets.bottom + 48 }} showsVerticalScrollIndicator={false}>
            <View style={pageStyles.cardWithoutBorder}>
                <Text style={[pageStyles.cardHeading, { marginBottom: 16 }]}>{productParts?.productName}</Text>

                <ImageViewCard images={productParts.productImages} placeholder={productParts.productImages.length > 0 ? true : false} />

                <View style={styles.cardBody}>
                    <Text style={[pageStyles.cardHeading, { paddingBottom: 24 }]}>Spare Parts Details</Text>
                    <MenuItemCard label='Product Name' value={productParts.productName} />
                    <MenuItemCard label='Product ID' value={productParts.productId} />
                    <MenuItemCard label='Category' value={productParts.category} />
                    <MenuItemCard label='Sub Category' value={productParts.subcategory} />
                    <MenuItemCard label='Product Type' value={productParts.productType} />
                    <MenuItemCard label='Country Of Origin' value={productParts.countryOfOrigin} />
                    <MenuItemCard label='Offering Type' value={productParts.industryType} />
                    <MenuItemCard label='Hazardous Cargo' value={productParts.hazardousCargo ? "Yes" : 'No'} />
                    <MenuItemCard label='Manufacturer' value={productParts.brand} />
                    <MenuItemCard label='Manufacture Tier' value={productParts.brandTier} />
                    <MenuItemCard label='manufacturer Part No' value={productParts.manufacturerPartNumber} />
                    <MenuItemCard expandableText label='Description' value={productParts.description} />
                    <View style={[pageStyles.vspace, { marginVertical: 8, backgroundColor: 'transparent' }]} />
                    <MenuItemCard label='HSN Code' value={productParts.hsnCode} />
                    <MenuItemCard label='Unit of Measurement' value={productParts.uom} />
                    <MenuItemCard label='Product Weight' value={productParts.weight} />
                    <MenuItemCard label='Product Volume' value={productParts.volume} />    
                    <MenuItemCard label='Tag' value={productParts.productTags.length > 0 ? <TagPills tag={productParts.productTags} /> : 'Not Specified'} />
                </View>
            </View>
 
            {
                productParts.productSpecifications.length > 0 &&
                <View style={{ paddingHorizontal: 16, marginTop: -16 }}>
                    <Text style={[styles.cardHeading, { paddingBottom: 24, }]}>Product Specifications</Text>
                    {
                        productParts.productSpecifications.map((item, index) => <ProductSpecificationsCard key={index} productSpecifications={item} />)
                    }
                </View>
            }

            {
                productParts.productCatalogAttachments.length > 0 &&
                <View>
                    <Text style={[styles.cardHeading, { paddingHorizontal: 16, paddingVertical: 16 }]}>Product Catalog Attachments</Text>
                    {
                        productParts.productCatalogAttachments.map((item, index) => <MenuButton key={index.toString()} label={`View ${item.category}`} onPress={() => navigation.navigate("ViewAttachments", { attachments: normalizeAttachment(item), pageTitle: 'Product Catalog Attachments' })} />)
                    }
                </View>
            }
        </ScrollView>
    )
}

export default SpareDetailsPage

const styles = StyleSheet.create({
    cardTextGap: {
        gap: 4,
    },
    cardBody: {
        marginVertical: 8
    },
    cardHeading: {
        color: colors.Black,
        ...fontSizes.heading,
    },
})