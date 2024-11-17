import { Dimensions, Image, LayoutAnimation, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SearchAndFilterRFQ } from '../../../pages/bottomnavpages/browse'
import pageStyles from '../../../styles/pageStyles'
import { BuyerProductDetails } from '../../../network/models/product'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import colors from '../../../styles/colors'
import fontSizes from '../../../styles/fonts'
import { TouchableOpacity } from 'react-native-gesture-handler'
import NoContentFound from '../../../components/nocontentfound'
import { Alert, AlertBoxContext } from '../../../components/alertbox'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlashList } from 'react-native-actions-sheet'
import VectorImage from 'react-native-vector-image'

const fallbackImage = require('../../../assets/images/placeholder.png');
const chevronRight = '../../../assets/icons/chevron-right.svg'

const ProductContainerList = ({ productDetailItem }) => {
    const navigation = useNavigation();
    const productImage = [...productDetailItem?.buyerProductImages, ...productDetailItem?.productDetails.productImages]

    return (
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetailsPage', { productDetails: productDetailItem })} style={pageStyles.cardWithoutBorder} activeOpacity={0.8}>
            <View style={styles.productCard}>
                <Image source={productImage[0]?.imageUrl ? { uri: productImage[0]?.imageUrl } : fallbackImage} style={[pageStyles.coverImage, { backgroundColor: colors.DarkGray40 }]} />
                <View style={{ flex: 1 }}>
                    <Text style={pageStyles.cardTextBold} numberOfLines={1}>Sub System <Text style={pageStyles.cardBodyText} numberOfLines={1}>{productDetailItem?.subSystem}</Text></Text>
                    <Text style={pageStyles.cardTextBold} numberOfLines={1}>System <Text style={pageStyles.cardBodyText} numberOfLines={1}>{productDetailItem?.system}</Text></Text>
                    <Text style={pageStyles.cardTextBold} numberOfLines={1}>Product Name <Text style={pageStyles.cardBodyText} numberOfLines={1}>{productDetailItem?.productDetails?.productName}</Text></Text>
                    <Text style={pageStyles.cardTextBold} numberOfLines={1}>Product ID <Text style={pageStyles.cardBodyText} numberOfLines={1}>{productDetailItem?.productDetails?.productId}</Text></Text>
                    <Text style={pageStyles.cardTitle} numberOfLines={1}>Tag No <Text style={pageStyles.cardBodyText}>{productDetailItem?.tagNumber}</Text></Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const ProductSubSystemsContainerList = ({ buyerProductSubSystems }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate('ProductListPage', { buyerProductSubSystems: buyerProductSubSystems })} style={styles.subCard} activeOpacity={0.8}>
            <View style={styles.productCard}>
                <Image source={buyerProductSubSystems.imageUrl ? { uri: buyerProductSubSystems.imageUrl } : fallbackImage} style={[pageStyles.coverImage, { backgroundColor: colors.DarkGray40 }]} />
                <View style={{ flex: 1 }}>
                    <Text style={pageStyles.cardTextBold} numberOfLines={1}>Sub System <Text style={pageStyles.cardBodyText}>{buyerProductSubSystems?.subSystem}</Text></Text>
                    <Text style={pageStyles.cardTextBold} numberOfLines={2}>System <Text style={pageStyles.cardBodyText}>{buyerProductSubSystems?.system}</Text></Text>
                </View>
                <VectorImage source={require(chevronRight)} />
            </View>
        </TouchableOpacity>
    )
}

const ProductSystemsContainerList = ({ buyerProductSystems }) => {
    const navigation = useNavigation();
    const focused = useIsFocused();

    const [showSubProduct, setShowSubProduct] = useState(false);

    useEffect(() => {
        setShowSubProduct(false)
    }, [focused])

    const handlePress = () => {
        setShowSubProduct(prev => !prev);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={pageStyles.cardWithoutBorder} activeOpacity={0.8}>
            <View style={styles.productCard}>
                <Image source={buyerProductSystems.imageUrl ? { uri: buyerProductSystems.imageUrl } : fallbackImage} style={[pageStyles.coverImage, { backgroundColor: colors.DarkGray40 }]} />
                <View style={{ flex: 1 }}>
                    <Text style={pageStyles.cardTextBold} numberOfLines={3}><Text style={pageStyles.cardBodyText}>{buyerProductSystems?.system}</Text></Text>
                </View>
                <View>
                    {
                        showSubProduct ? <VectorImage source={require(chevronRight)} style={{ transform: [{ rotate: '90deg' }], tintColor: colors.Primary }} /> :
                            <VectorImage source={require(chevronRight)} />
                    }

                </View>
            </View>
            {buyerProductSystems?.buyerProductSubSystems.length > 0 && showSubProduct && (
                <View>
                    <View style={{ marginTop: 16 }} />
                    <Text style={[styles.textHeading, { paddingHorizontal: -16 }]}>Sub System</Text>
                    <FlashList
                        data={buyerProductSystems?.buyerProductSubSystems}
                        renderItem={({ item, index }) => <ProductSubSystemsContainerList buyerProductSubSystems={item} key={index} />}
                        estimatedItemSize={200}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </TouchableOpacity>
    )
}

const SparePartContainerList = ({ spareParts }) => {
    const navigation = useNavigation();
    const productImage = [...spareParts?.buyerProductImages, ...spareParts?.productDetails?.productImages]

    return (
        <TouchableOpacity onPress={() => navigation.navigate('SpareDetailsPage', { productParts: spareParts.productDetails })} activeOpacity={0.8} style={pageStyles.cardWithoutBorder}>
            <View style={styles.spareCardWrapper}>
                <Image source={productImage[0]?.imageUrl ? { uri: productImage[0].imageUrl } : fallbackImage} style={[pageStyles.coverImage, { backgroundColor: colors.DarkGray40 }]} />
                <View style={{ flex: 1 }}>
                    <Text style={pageStyles.cardTextBold}>Spare ID  <Text style={pageStyles.cardBodyText}>{spareParts.productDetails.productId || 'NaN'}</Text></Text>
                    <Text style={pageStyles.cardTitle}>Spare Name  <Text style={pageStyles.cardBodyText} numberOfLines={2}>{spareParts.productDetails.productName || "Input Name"}</Text></Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}


const SystemContainer = ({ buyerProductSystems }) => {
    return (
        <React.Fragment>
            <Text style={styles.textHeading}>Systems</Text>
            {
                buyerProductSystems?.systems?.map((item, index) => <ProductSystemsContainerList buyerProductSystems={item} key={index} />)
            }
        </React.Fragment>
    )
}

const SubSystemContainer = ({ buyerProductSubSystems }) => {
    return (
        <View>
            <Text style={styles.textHeading}>Sub Systems</Text>
            {
                buyerProductSubSystems?.buyerProductSubSystems?.map((item, index) => <ProductSubSystemsContainerList buyerProductSubSystems={item} key={index} />)
            }
        </View>
    )
}

const ProductDetailsContainer = ({ buyerProductDetails }) => {

    return (
        <View>
            <Text style={styles.textHeading}>Products</Text>
            {
                buyerProductDetails?.buyerProductDetails?.map((item, index) => <ProductContainerList key={index} productDetailItem={item} />)
            }
        </View>
    )
}

const SparePartContainer = ({ sparePartItems }) => {
    return (
        <React.Fragment>
            <Text style={styles.textHeading}>Spare Parts</Text>
            {
                sparePartItems.spareParts?.map((item, index) => <SparePartContainerList spareParts={item} key={index} />)
            }
        </React.Fragment>
    )
}

const SearchContainerList = ({ filterData }) => {
    const insets = useSafeAreaInsets();

    const hasSystemDetails = filterData?.systems && filterData?.systems.length > 0 || false;
    const hasBuyerProductSubSystems = filterData?.buyerProductSubSystems && filterData?.buyerProductSubSystems.length > 0 || false;
    const hasBuyerProductDetails = filterData?.buyerProductDetails && filterData.buyerProductDetails.length > 0 || false;
    const hasSpareParts = filterData?.spareParts && filterData.spareParts.length > 0 || false;

    const noContent = !hasSystemDetails && !hasBuyerProductSubSystems && !hasBuyerProductDetails && !hasSpareParts;

    const renderItem = ({ item, index }) => {
        if (hasSystemDetails && index === 0) {
            return <SystemContainer buyerProductSystems={filterData} />;
        } else if (hasBuyerProductSubSystems && index === (hasSystemDetails ? 1 : 0)) {
            return <SubSystemContainer buyerProductSubSystems={filterData} />;
        } else if (hasBuyerProductDetails && index === (hasSystemDetails || hasBuyerProductSubSystems ? 2 : 1)) {
            return <ProductDetailsContainer buyerProductDetails={filterData} />;
        } else if (hasSpareParts && index === (hasSystemDetails || hasBuyerProductSubSystems || hasBuyerProductDetails ? 3 : 2)) {
            return <SparePartContainer sparePartItems={filterData} />;
        } else {
            return null;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {noContent ? (
                <NoContentFound title='Search Product' message='Search query on product name, system, sub-system tag no' />
            ) : (
                <FlashList
                    data={[
                        hasSystemDetails,
                        hasBuyerProductSubSystems,
                        hasBuyerProductDetails,
                        hasSpareParts,
                    ]}
                    renderItem={renderItem}
                    estimatedItemSize={200}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 48, paddingTop: insets.top + 24 }}
                />
            )}
        </SafeAreaView>
    );
};

const SearchPage = () => {
    const [searchParams, setSearchParams] = useState("");
    const [filterData, setFilterData] = useState()

    const createAlert = useContext(AlertBoxContext);

    let searchTimeout = null;
    let searchParameters = encodeURIComponent(searchParams);

    useEffect(() => {
        searchProducts();
    }, []);

    useEffect(() => {
        if (searchParams) {
            if (searchTimeout) { clearTimeout(searchTimeout); }

            searchTimeout = setTimeout(() => {
                searchProducts();
            }, 500);
        }
        return () => {
            if (searchTimeout) { clearTimeout(searchTimeout); }
        };
    }, [searchParameters])

    const searchProducts = async () => {
        try {
            if (searchParams) {
                const searchData = await BuyerProductDetails(searchParameters);
                setFilterData(searchData);
            }
            if (!searchParams) {
                const searchData = await BuyerProductDetails(searchParameters);
                searchData?.systems.sort((a, b) => b.systemId - a.systemId);
                setFilterData(searchData);
            }
        } catch (error) {
            createAlert(Alert.Error(error.message));
        }

    }

    return (
        <React.Fragment>
            <SearchAndFilterRFQ search={searchParams} setSearch={setSearchParams} disabled={true} />
            <SearchContainerList filterData={filterData} />
        </React.Fragment>
    )
}

export default SearchPage


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.White,
        paddingHorizontal: 16,
    },

    image: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
        borderRadius: 20,
    },

    productCard: {
        flexDirection: 'row',
        columnGap: 16,

        alignItems: 'center'
    },

    textHeading: {
        color: colors.Black,
        ...fontSizes.heading,

        paddingHorizontal: 16
    },

    spareCardWrapper: {
        flexDirection: 'row',
        // columnGap: 24,

        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    subCard: {
        backgroundColor: colors.White,

        paddingVertical: 24,
        paddingHorizontal: 16,
    }

})