import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useDrawerSheetStore } from '../stores/stores';
import { DrawerSheetObject } from './drawersheet';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';

const sellingPassiveImage = require('../assets/images/feesharing/SellingPassive.png');
const sellingActiveImage = require('../assets/images/feesharing/SellingActive.png');
const buyingPassiveImage = require('../assets/images/feesharing/BuyingPassive.png');
const buyingActiveImage = require('../assets/images/feesharing/BuyingActive.png');
const sellingBuyingPassiveImage = require('../assets/images/feesharing/SellingBuyingPassive.png');
const sellingBuyingActiveImage = require('../assets/images/feesharing/SellingBuyingActive.png');

const TagTypes = {
    Active: 'Active',
    Passive: 'Passive',
    Buying: 'Buying',
    Selling: 'Selling',
}

function getTagStylesFromType(tagType) {
    switch (tagType) {
        case TagTypes.Active:
            return { backgroundColor: colors.Transparent, borderColor: colors.Primary, color: colors.Primary }
        case TagTypes.Passive:
            return { backgroundColor: colors.Transparent, borderColor: colors.DarkGray80, color: colors.DarkGray80 }
        case TagTypes.Buying:
            return { backgroundColor: colors.Warning, borderColor: colors.Warning, color: colors.White }
        case TagTypes.Selling:
            return { backgroundColor: colors.Success, borderColor: colors.Success, color: colors.White }
        default:
            return { backgroundColor: colors.Transparent, borderColor: colors.Primary, color: colors.Primary }
    }
}

function FeeSharingTags({ tagType = TagTypes.Active }) {
    const { color, backgroundColor, borderColor } = getTagStylesFromType(tagType);

    return (
        <View style={[styles.tag, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
            <Text style={[styles.tagText, { color: color }]}>{tagType}</Text>
        </View>
    )
}

function FeeSharingDrawerCard({ dealTags = [], roleTag = TagTypes.Active, share = 0, image, children }) {
    return (
        <View style={styles.card}>
            <View style={styles.sectionRow}>
                <View style={styles.row}>
                    { dealTags.map((tag, index) => 
                        <React.Fragment key={index}>
                            <FeeSharingTags tagType={tag}/>
                            <View style={{ marginRight: 16 }}/>
                        </React.Fragment>
                    )}
                </View>
                <FeeSharingTags tagType={roleTag}/>
            </View>
            <View style={styles.sectionRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.share}>{share}<Text style={styles.sharePercentage}>%</Text></Text>
                    <Text style={styles.successFeeeText}>of total Success Fee charged by WorldRef from the Seller</Text>
                </View>
                <Image source={image} style={styles.image}/>
            </View>
            <View>
                { children }
            </View>
        </View>
    )
}

function FeeSharingDrawerContent() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[styles.container]}>
            <FeeSharingDrawerCard dealTags={[TagTypes.Selling]} share={20} roleTag={TagTypes.Passive} image={sellingPassiveImage}>
                <Text style={styles.cardTitle}>
                    When you are referring a Deal<Text style={styles.asterisk}>*</Text> or a Buyer<Text style={styles.asterisk}>**</Text>
                </Text>
                <View style={styles.explanationContainer}>
                    <Text style={styles.cardExplanation}>
                        <Text style={styles.asterisk}>*</Text>Referring a Deal means you create a Deal and provide relevant information. WorldRef will try to close the sale with the Buyer.
                    </Text>
                    <Text style={styles.cardExplanation}>
                        <Text style={styles.asterisk}>**</Text>Referring a Buyer means you provide the details of the Buyer. WorldRef generates the requirement and tries to close the sale with the Buyer.
                    </Text>
                </View>
            </FeeSharingDrawerCard>
            <FeeSharingDrawerCard dealTags={[TagTypes.Selling]} share={50} roleTag={TagTypes.Active} image={sellingActiveImage}>
                <Text style={styles.cardTitle}>
                    When you are referring a Deal/Buyer<Text style={styles.asterisk}>*</Text> and Executing<Text style={styles.asterisk}>**</Text> the deal
                </Text>
                <View style={styles.explanationContainer}>
                    <Text style={styles.cardExplanation}>
                        <Text style={styles.asterisk}>*</Text>Referring a Deal/Buyer means you create a Deal and provide relevant information for the Deal/Buyer.
                    </Text>
                    <Text style={styles.cardExplanation}>
                        <Text style={styles.asterisk}>**</Text>Executing a Deal means playing an active role (front-end) in closing the sale with the Buyer.
                    </Text>
                </View>
            </FeeSharingDrawerCard>
            <FeeSharingDrawerCard dealTags={[TagTypes.Buying]} share={10} roleTag={TagTypes.Passive} image={buyingPassiveImage}>
                <Text style={styles.cardTitle}>
                    When you are referring a Deal or a Seller<Text style={styles.asterisk}>*</Text>
                </Text>
                <View style={styles.explanationContainer}>
                    <Text style={styles.cardExplanation}>
                        <Text style={styles.asterisk}>*</Text>Referring a Seller means you provide the details of a reliable Seller who can provide a competitive offer for the Deal. WorldRef tries to close the sale with the offer from this Seller.
                    </Text>
                </View>
            </FeeSharingDrawerCard>
            <FeeSharingDrawerCard dealTags={[TagTypes.Buying]} share={30} roleTag={TagTypes.Active} image={buyingActiveImage}>
                <Text style={styles.cardTitle}>
                    When you are referring a Seller<Text style={styles.asterisk}>*</Text> and Executing<Text style={styles.asterisk}>**</Text> the deal
                </Text>
                <View style={styles.explanationContainer}>
                    <Text style={styles.cardExplanation}>
                        <Text style={styles.asterisk}>*</Text>Referring a Seller means you provide relevant information about the Seller.
                    </Text>
                    <Text style={styles.cardExplanation}>
                        <Text style={styles.asterisk}>**</Text>Executing a Deal means playing an active role (procurement) which involves sending the RFQ, getting offers and negotiations with the Seller.
                    </Text>
                </View>
            </FeeSharingDrawerCard>
            <FeeSharingDrawerCard dealTags={[TagTypes.Selling, TagTypes.Buying]} share={30} roleTag={TagTypes.Passive} image={sellingBuyingPassiveImage}>
                <Text style={styles.cardTitle}>
                    When you are referring a Deal as well as the Seller, and the Deal is closed.
                </Text>
            </FeeSharingDrawerCard>
            <FeeSharingDrawerCard dealTags={[TagTypes.Selling, TagTypes.Buying]} share={80} roleTag={TagTypes.Active} image={sellingBuyingActiveImage}>
                <Text style={styles.cardTitle}>
                    When you are referring a Deal as well as a Seller, and are Executing the Deal.
                </Text>
            </FeeSharingDrawerCard>
        </ScrollView>
    )
}

function FeeSharingDrawerComponent({}, ref) {
    const addDrawerSheet = useDrawerSheetStore(state => state.addDrawerSheet);

    const openDrawerSheet = useDrawerSheetStore(state => state.openDrawerSheet);
    const closeDrawerSheet = useDrawerSheetStore(state => state.closeDrawerSheet);

    const removeDrawerSheet = useDrawerSheetStore(state => state.removeDrawerSheet);

    useImperativeHandle(ref, () => {
        return {
            open: () => openDrawerSheet(`fee-sharing-sheet`),
            close: () => closeDrawerSheet(`fee-sharing-sheet`)
        };
    }, []);

    useEffect(() => {
        addDrawerSheet(new DrawerSheetObject(`fee-sharing-sheet`, <FeeSharingDrawerContent/>));
        return () => removeDrawerSheet(`fee-sharing-sheet`);
    }, []);
}

const FeeSharingDrawer = forwardRef(FeeSharingDrawerComponent);

const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
    },

    card: {
        borderRadius: 16,
        backgroundColor: colors.LightGray80,

        marginHorizontal: 12,
        marginVertical: 12,

        paddingHorizontal: 12,
        paddingVertical: 12
    },

    tag: {
        paddingHorizontal: 16,
        paddingVertical: 2,

        borderRadius: 24,
        borderWidth: 2,
    },

    tagText: {
        ...fontSizes.heading_small,
    },

    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginBottom: 16,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    share: {
        ...fontSizes.heading_xxlarge,
        color: colors.Black80,
    },

    sharePercentage: {
        ...fontSizes.heading_large,
        color: colors.Black80,
    },

    successFeeeText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        textAlign: 'justify'
    },

    image: {
        width: Dimensions.get('window').width * 0.3,
        height: Dimensions.get('window').width * 0.3,
        resizeMode: 'contain',

        flex: 1,

        alignSelf: 'flex-end',
    },

    cardTitle: {
        ...fontSizes.heading,
        color: colors.Black80,

        textAlign: 'justify'
    },

    explanationContainer: {
        marginVertical: 8,
    },

    cardExplanation: {
        ...fontSizes.body_small,
        color: colors.Black80,

        textAlign: 'justify',

        marginTop: 8,
    },

    asterisk: {
        color: colors.Primary,
        ...fontSizes.heading
    }
});

export default FeeSharingDrawer;