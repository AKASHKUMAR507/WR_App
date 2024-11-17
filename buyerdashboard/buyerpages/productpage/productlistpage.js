import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import pageStyles from '../../../styles/pageStyles'
import colors from '../../../styles/colors'
import { useNavigation } from '@react-navigation/native'
import useCurrentProduct from '../../../hooks/currentproduct'

const fallbackImage = require('../../../assets/images/placeholder.png');

const ProductListCard = ({ productDetailItem }) => {
    const navigation = useNavigation();
    const productImage = [...productDetailItem?.buyerProductImages, ...productDetailItem?.productDetails.productImages]

    return (
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetailsPage', { productDetails: productDetailItem })} style={pageStyles.card} activeOpacity={0.8}>
            <View style={styles.productCard}>
                <Image source={productImage ? { uri: productImage[0]?.imageUrl } : fallbackImage} style={[pageStyles.coverImage, { backgroundColor: colors.DarkGray40 }]} />
                <View style={{ flex: 1 }}>
                    <Text style={pageStyles.cardTextBold}>Product ID <Text style={pageStyles.cardBodyText}>{productDetailItem.productDetails.productId}</Text></Text>
                    <Text style={pageStyles.cardTextBold}>Tag No <Text style={pageStyles.cardBodyText}>{productDetailItem.tagNumber}</Text></Text>
                    <Text style={pageStyles.cardTitle}>Name <Text style={pageStyles.cardBodyText}>{productDetailItem.productDetails.productName}</Text></Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const ProductList = (props) => {
    const insets = useSafeAreaInsets();
    const { buyerProductSubSystems } = props.route.params;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: insets.top + 24 }}>
            {buyerProductSubSystems.imageUrl && <Image source={buyerProductSubSystems.imageUrl ? { uri: buyerProductSubSystems.imageUrl } : fallbackImage} style={styles.productImage} />}

            <View style={styles.container}>
                <View style={{ gap: 8, paddingBottom: 24 }}>
                    <Text style={pageStyles.cardTitle}>{buyerProductSubSystems?.subSystem}</Text>
                    <Text style={pageStyles.cardText}>{buyerProductSubSystems?.system}</Text>
                </View>
            </View>
            {
                buyerProductSubSystems.buyerProductDetails.map((item, index) => <ProductListCard key={index.toString()} productDetailItem={item} />)
            }
        </ScrollView>
    )
}

export default ProductList

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.White,
        paddingHorizontal: 16,
    },

    productCard: {
        flexDirection: 'row',
        columnGap: 16,

        alignItems: 'center'
    },

    productImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.2,
        resizeMode: 'contain',
        marginTop: -24,
        marginBottom: 24
    }

})