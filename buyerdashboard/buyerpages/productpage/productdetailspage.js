import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import pageStyles from '../../../styles/pageStyles';
import colors from '../../../styles/colors';
import fontSizes from '../../../styles/fonts';
import { useNavigation } from '@react-navigation/native';
import ImageViewCard from '../../../components/imageviewcard';
import MenuItemCard from '../../../components/menuitemcard';
import MenuButton from '../../../components/atoms/menubutton';
import TagPills from '../../../components/tagpills';

const fallbackImage = require('../../../assets/images/placeholder.png');

const normalizeAttachment = (data) => {
    const normalize = {
        attachmentfileid: data.attachmentFileId,
        attachmentfilename: data.attachmentFileName,
        attachmentid: data.attachmentId,
        category: data.category,
        imageUrl: data.imageUrl,
        module: "catalog"
    }

    return [normalize]
};

const SparePartCard = ({ spareParts, children }) => {
    const navigation = useNavigation();
    const productImage = [...spareParts?.productImages, ...spareParts?.buyerProductDetails?.buyerProductImages || ""]

    return (
        <TouchableOpacity onPress={() => navigation.navigate('SpareDetailsPage', { productParts: spareParts })} activeOpacity={0.8} style={styles.card}>
            <View style={styles.spareCardWrapper}>
                <Image source={productImage[0]?.imageUrl ? { uri: productImage[0].imageUrl } : fallbackImage} style={[pageStyles.coverImage, { backgroundColor: colors.DarkGray40 }]} />
                {children}
                {
                    !children &&
                    <View style={{flex: 1}}>
                        <Text style={pageStyles.cardTextBold}>Spare ID  <Text style={pageStyles.cardBodyText}>{spareParts.productId || 'NaN'}</Text></Text>
                        <Text style={pageStyles.cardTitle}>Spare Name  <Text style={pageStyles.cardBodyText} numberOfLines={2}>{spareParts.productName || "Input Name"}</Text></Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
    )
}

const ProductSpecificationsCard = ({ productSpecifications }) => {
    return (
        <MenuItemCard label={productSpecifications?.parameter} value={productSpecifications?.value} />
    )
}

const ProductDetails = (props) => {
    const insets = useSafeAreaInsets();
    const { productDetails } = props.route.params;
    const navigation = useNavigation();

    const productImage = [...productDetails.buyerProductImages, ...productDetails.productDetails.productImages]
  
    return (
        <ScrollView style={pageStyles.page} contentContainerStyle={{ paddingBottom: insets.bottom + 48 }} showsVerticalScrollIndicator={false}>
            <View style={pageStyles.cardWithoutBorder}>
                <View style={[pageStyles.cardBody, { gap: 12, marginTop: -8 }]}>
                    <View style={styles.cardTextGap}>
                        <Text style={pageStyles.cardText}>System</Text>
                        <Text style={pageStyles.cardTextBold}>{productDetails.system}</Text>
                    </View>

                    <View style={styles.cardTextGap}>
                        <Text style={pageStyles.cardText}>Sub System</Text>
                        <Text style={pageStyles.cardTextBold}>{productDetails.subSystem}</Text>
                    </View>
                </View>

                <Text style={styles.cardHeading}>{productDetails.productDetails.productName}</Text>

                <View style={styles.cardBody}>
                    <ImageViewCard images={productImage} placeholder={productImage.length > 0 ? true : false} />
                </View>

                <View style={styles.cardBody}>
                    <MenuItemCard label="Product ID" value={productDetails.productDetails?.productId} />
                    <MenuItemCard label="Tag No" value={productDetails?.tagNumber} />
                    <MenuItemCard label="Category" value={productDetails.productDetails?.category} />
                    <MenuItemCard label="Sub Category" value={productDetails.productDetails?.subcategory} />
                    <MenuItemCard label="Product Type" value={productDetails.productDetails?.productType} />
                    <MenuItemCard label="Country Of Origin" value={productDetails.productDetails?.countryOfOrigin} />
                    <MenuItemCard label="Offering Type" value={productDetails.productDetails?.industryType} />
                    <MenuItemCard label="Hazardous Cargo" value={productDetails.productDetails?.hazardousCargo ? "YES" : "NO"} />
                    <MenuItemCard label="Manufacturer" value={productDetails.productDetails?.brand} />
                    <MenuItemCard label="Manufacturer Tier" value={productDetails.productDetails?.brandTier} />
                    <MenuItemCard label="Manufacture Part No" value={productDetails.productDetails?.manufacturerPartNumber} />
                    <MenuItemCard label="Description" expandableText value={productDetails.productDetails?.description} />
                    <View style={[pageStyles.vspace, { marginVertical: 8, backgroundColor: 'transparent' }]} />
                    <MenuItemCard label="HSN Code" value={productDetails.productDetails?.hsnCode} />
                    <MenuItemCard label="Product Volume" value={productDetails.productDetails?.volume} />
                    <MenuItemCard label="Unit of Measurement" value={productDetails.productDetails?.uom} />
                    <MenuItemCard label='Product Weight' value={productDetails.productDetails?.weight} />
                    <MenuItemCard label='Tag' value={productDetails.productDetails.productTags.length > 0 ? <TagPills tag={productDetails.productDetails.productTags} /> : 'Not Specified'} />

                </View>

                <TagPills />

            </View>

            {
                productDetails.productDetails.productSpecifications.length > 0 &&
                <View style={{ paddingHorizontal: 16, marginTop: -16 }}>
                    <Text style={[styles.cardHeading, { paddingBottom: 24, }]}>Product Specifications</Text>
                    {
                        productDetails.productDetails.productSpecifications.map((item, index) => <ProductSpecificationsCard key={index} productSpecifications={item} />)
                    }
                </View>
            }


            {
                productDetails.productDetails.productCatalogAttachments.length > 0 &&
                <View>
                    <Text style={[styles.cardHeading, { paddingHorizontal: 16, paddingVertical: 16 }]}>Product Catalog Attachments</Text>
                    {
                        productDetails.productDetails.productCatalogAttachments.map((item, index) => <MenuButton label={`View ${item.category}`} onPress={() => navigation.navigate("ViewAttachments", { attachments: normalizeAttachment(item), pageTitle: 'Product Catalog Attachments' })} />)

                    }
                </View>
            }

            {
                productDetails.productDetails.productParts.length > 0 &&
                <View style={pageStyles.cardWithoutBorder}>
                    <Text style={[styles.cardHeading, { paddingBottom: 24 }]}>Spare Parts</Text>
                    {
                        productDetails.productDetails.productParts.map((item, index) => <SparePartCard key={index} spareParts={item} />)
                    }
                </View>
            }
        </ScrollView>
    )
}

export default ProductDetails
export { SparePartCard }

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.White,
        paddingVertical: 24,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    cardBody: {
        marginVertical: 8
    },

    spareCardWrapper: {
        flexDirection: 'row',
        columnGap: 16,

        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    cardTextGap: {
        gap: 4,
    },

    mainImage: {
        height: 200,
        width: '100%',

        resizeMode: 'cover',

        borderRadius: 8,
    },

    touchableImage: {
        height: 80,
        width: 80,

        borderRadius: 8,
    },

    cardContainer: {
        paddingVertical: 22,

        flexDirection: 'row',
        columnGap: 8
    },

    cardHeading: {
        color: colors.Black,
        ...fontSizes.heading,
    },
})