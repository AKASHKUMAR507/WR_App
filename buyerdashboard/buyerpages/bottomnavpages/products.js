import { Animated, Easing, Image, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import colors from '../../../styles/colors'
import fontSizes from '../../../styles/fonts'
import { FlashList } from '@shopify/flash-list'
import NoContentFound from '../../../components/nocontentfound'
import SkeletonContainer from '../../../components/skeletons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { SearchAndFilterRFQ } from '../../../pages/bottomnavpages/browse'
import { BuyerProductDetails } from '../../../network/models/product'
import useRefreshScreens from '../../../hooks/refreshscreens'
import { Alert, AlertBoxContext } from '../../../components/alertbox'
import useCurrentProduct from '../../../hooks/currentproduct'
import pageStyles from '../../../styles/pageStyles'
import VectorImage from 'react-native-vector-image'

const fallbackImage = require('../../../assets/images/placeholder.png');
const chevronRight = '../../../assets/icons/chevron-right.svg';

const ProductSkeletonData = {
    imageUrl: "",
    system: "",
    details: "",
    manufacturer: "",
    buyerProductSubSystems: [
        {
            id: 1,
            name: "",
            details: ""
        }
    ]
}

const SubProductCard = ({ subProduct, systemList }) => {
    const refreshScreens = useRefreshScreens();
    const navigation = useNavigation();
    const [currentProduct, setCurrentProduct, clearCurrentProduct] = useCurrentProduct();

    const handlePress = () => {
        clearCurrentProduct();

        populateDataFromBuyerProductDetails({ product: subProduct, systemDetailsList: systemList })
        navigation.navigate('ProductListPage', { buyerProductSubSystems: subProduct });
    }

    const populateDataFromBuyerProductDetails = ({ product, systemDetailsList }) => {
        const productInfo = {
            system: product.system,
            subSystem: product.subSystem,
            subSystemId: product.subSystemId,
            buyerProductDetails: [],
            systemDetailList: {},
        }

        productInfo.buyerProductDetails = product.buyerProductDetails;
        productInfo.systemDetailList = systemDetailsList;

        setCurrentProduct(productInfo)
    }

    return (
        <TouchableOpacity style={styles.subCardStyle} onPress={() => handlePress()} activeOpacity={0.8}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={styles.ImageContainer}>
                    <Image source={subProduct.imageUrl ? { uri: subProduct.imageUrl } : fallbackImage} style={[pageStyles.coverImage, { backgroundColor: colors.Gray }]} />
                    <Text style={styles.cardText} numberOfLines={3}>{subProduct.subSystem} {subProduct?.manufacturer}</Text>
                </View>
                <View>
                    <VectorImage source={require(chevronRight)} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

const ProductCard = ({ productItems }) => {
    const [showSubProduct, setShowSubProduct] = useState(false);
    const focused = useIsFocused();

    useEffect(() => {
        setShowSubProduct(false)
    }, [focused])

    const handlePress = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowSubProduct(prev => !prev);
    };

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handlePress}>
            <View style={[styles.ImageContainer]}>
                <Image source={productItems?.imageUrl ? { uri: productItems?.imageUrl } : fallbackImage} style={[pageStyles.coverImage, { backgroundColor: colors.Gray }]} />
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={3} style={styles.cardTitle}>{productItems?.system} {productItems?.details && <Text style={styles.cardBodyText}>({productItems?.details}) {productItems?.manufacturer && <Text style={styles.cardBodyText}>| {productItems?.manufacturer}</Text>}</Text>}</Text>
                </View>
                <View>
                    {
                        showSubProduct ? <VectorImage source={require(chevronRight)} style={{ transform: [{ rotate: '90deg' }], tintColor: colors.Primary }} />
                            : <VectorImage source={require(chevronRight)} />
                    }
                </View>
            </View>

            {productItems?.buyerProductSubSystems.length > 0 && showSubProduct && (
                <View>
                    <View style={{ marginTop: 12 }} />
                    <FlashList
                        data={productItems?.buyerProductSubSystems}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item, index }) => <SubProductCard subProduct={item} key={index} systemList={productItems} />}
                        estimatedItemSize={200}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </TouchableOpacity>
    )
}

const ProductContainer = ({ productList }) => {
    const insets = useSafeAreaInsets();
    const _productLists = productList?.systems;
    const sortedProductList = _productLists?.sort((a, b) => b.systemId - a.systemId);

    return (
        _productLists ? (
            (_productLists.length) > 0 ?
                <FlashList data={sortedProductList} keyExtractor={(item, _) => _.toString()} renderItem={({ item, index }) => <ProductCard productItems={item} key={index} />} estimatedItemSize={150} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 12 }} /> :
                <NoContentFound title={'No Product Found'} message={'Could not find any product in your account'} />
        ) : <SkeletonContainer childcount={8} child={<ProductCard productItems={ProductSkeletonData} />} />
    )
}

const ProductsPage = () => {
    const navigation = useNavigation();
    const refreshScreens = useRefreshScreens();
    const isFocused = useIsFocused();

    const createAlert = useContext(AlertBoxContext);

    const [product, setProduct] = useState();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        buyerProductDetails();
    }, [isFocused, searchQuery])

    const buyerProductDetails = async () => {
        const searchQueryEncoded = encodeURIComponent(searchQuery);
        try {
            const buyerProduct = await BuyerProductDetails(searchQueryEncoded);
            setProduct(buyerProduct);
        } catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <React.Fragment>
            <SearchAndFilterRFQ onSearch={() => navigation.navigate('SearchPage')} editable={false} />
            {/* <SearchAndFilterRFQ search={searchQuery} setSearch={setSearchQuery}  editable={true} /> */}
            <ProductContainer productList={product} />
        </React.Fragment>
    )
}

export default ProductsPage
export { ProductCard }

const styles = StyleSheet.create({
    page: {
    },

    ImageContainer: {
        flexDirection: 'row',

        alignItems: 'center',
        columnGap: 8
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

    subCardStyle: {
        // paddingHorizontal: 16,
        paddingVertical: 8,

        marginTop: 16
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

    cardBodyText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        marginTop: 4,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.Black80,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
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

    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
    },

    idText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },
});
