import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import colors from '../../../styles/colors'
import fontSizes from '../../../styles/fonts'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useBuyerProfileInformation } from '../../../stores/fetchstore'
import Chronos from '../../../utilities/chronos'
import AvatarPlaceholder from '../../../components/avatarplaceholder'
import { Alert, AlertBoxContext } from '../../../components/alertbox'
import MenuItemCard from '../../../components/menuitemcard'

const CompanyDetailsCard = ({ companyDetails, buyerId }) => {

    return (
        <View style={styles.card}>
            <Text style={styles.cardHeading}>Comapny Key Details</Text>
            <MenuItemCard label='User ID' value={buyerId} />
            <MenuItemCard label='Company Name' value={companyDetails?.name} />
            <MenuItemCard label='Email' value={companyDetails?.email} />
            <MenuItemCard label='Contact No' value={companyDetails?.phone} />

            <Text style={[styles.itemSpacing, styles.cardBodyText]}>Registered Address of Buyer</Text>
            <Text style={[styles.cardText]}>{companyDetails?.addressline2} | {companyDetails?.addressline1} | {companyDetails?.city} | {companyDetails?.country} | {companyDetails?.pincode}</Text>
        </View>
    )
}

const KeyPeopleDetailsCard = ({ keyPeopleDetails }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardHeading}>Key People Details</Text>
            {
                keyPeopleDetails.map((item, idx) =>
                    <View key={idx} style={[{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 }]}>
                        <AvatarPlaceholder seed={item.email} />
                        <View style={{ marginLeft: 16 }}>
                            <Text numberOfLines={1} style={styles.cardTitle}>{item.name}</Text>
                            <Text numberOfLines={1} style={styles.cardText}>{item.phone} | {item.email}</Text>
                            <Text numberOfLines={1} style={styles.cardText}>{item.designation}</Text>
                        </View>
                    </View>
                )
            }
        </View>
    )
}

const PlantDetailsCard = ({ plantDetails }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardHeading}>Plant Details</Text>
            <MenuItemCard label='Plant Name' value={plantDetails.plantName || "Not Specified"} />
            <MenuItemCard label='Plant Location' value={`${plantDetails.plantCity}, ${plantDetails.plantCountry}` || "Not Specified"} />
            <MenuItemCard label='Plant Description' value={plantDetails.plantDescription || "Not Specified"} />
        </View>
    )
}

const TransactionDetailsCard = ({ transactions }) => {
    const chronos = new Chronos();
    return (
        <View style={styles.card}>
            <Text style={[styles.cardHeading]}>Transactions</Text>
            <MenuItemCard label={`Gross Transaction Value${'\n'}(GTV) till date`} value={chronos.FormattedDateFromTimestamp(transactions.calculateDate) || "Not Specified"} />
            <MenuItemCard label='Savings till date' value={`USD ${transactions.savings}`} />
        </View>
    )
}

const CreditDetailsCard = ({ creditDetails }) => {
    const chronos = new Chronos();
    return (
        <View style={styles.card}>
            <Text style={styles.cardHeading}>Credit Details</Text>
            <MenuItemCard label={`Company Credit${'\n'}Profile`} value={creditDetails.companyCreditProfile || "Not Specified"} />
            <MenuItemCard label={`Last Profile${'\n'}Evaluation Date`} value={chronos.FormattedDateFromTimestamp(creditDetails.lastProfileEvaluationDate)} />
            <MenuItemCard label='Approved Credit Period' value={creditDetails.approvedCreditPeriod || "Not Specified"} />
            <MenuItemCard label='Approved Credit Limit' value={creditDetails.approvedCreditLimit || "Not Specified"} />
            <MenuItemCard label={`Take Rate Spread${'\n'}For Credit`} value={creditDetails.takeRate || "Not Specified"} />
            <MenuItemCard label='Credit Limit Exhausted' value={creditDetails.creditLimitExhausted || "Not Specified"} />
        </View>
    )
}

const DeliveryTermsCard = ({ deliveryTerms }) => {

    return (
        <View style={styles.card}>
            <Text style={styles.cardHeading}>Delivery Terms</Text>
            <MenuItemCard label='Delivery Term' value={deliveryTerms.deliveryTerm || "Not Specified"} />
            <MenuItemCard label='Delivery Location' value={`${deliveryTerms.deliveryCity} ${deliveryTerms.deliveryCountry}` || "Not Specified"} />
        </View>
    )
}

const CardContainer = () => {
    const user = useBuyerProfileInformation(state => state.buyerProfileInfo);

    const normalizedUserProfile = {
        buyerId: user?.object?.BuyerProfile?.buyerid,
        companyKeyDetails: user?.object?.companyKeyDetails,
        keyPeopleDetails: user?.object?.BuyerProfile?.keyPeopleDetailsList || [],
        plantDetails: user?.object?.BuyerProfile?.plantDetailsList[0] || [],
        transactions: {
            grossValue: user?.grossValue,
            calculateDate: user?.calculateDate,
            savings: user?.savings
        },
        creditDetails: user?.object?.BuyerProfile?.creditDetailsList[0] || [],
        deliveryTerms: user?.object?.BuyerProfile?.buyerTermsList[0] || []
    }

    return (
        <React.Fragment>
            <CompanyDetailsCard companyDetails={normalizedUserProfile.companyKeyDetails} buyerId={normalizedUserProfile.buyerId} />
            <View style={styles.vspace} />
            <KeyPeopleDetailsCard keyPeopleDetails={normalizedUserProfile.keyPeopleDetails} />
            <View style={styles.vspace} />
            <PlantDetailsCard plantDetails={normalizedUserProfile.plantDetails} />
            <View style={styles.vspace} />
            {/* <TransactionDetailsCard transactions={normalizedUserProfile.transactions} /> */}
            {/* <View style={styles.vspace} /> */}
            {/* <CreditDetailsCard creditDetails={normalizedUserProfile.creditDetails} /> */}
            {/* <View style={styles.vspace} /> */}
            <DeliveryTermsCard deliveryTerms={normalizedUserProfile.deliveryTerms} />
        </React.Fragment>
    )
}

const ProfileInfo = () => {
    const insets = useSafeAreaInsets();
    const loadBuyerProfileInfo = useBuyerProfileInformation(state => state.loadBuyerProfileInfo);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchBuyerProfileInformation();
    }, [])

    const fetchBuyerProfileInformation = async () => {
        try {
            await loadBuyerProfileInfo();
        } catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom }} showsVerticalScrollIndicator={false}>
            <CardContainer />
        </ScrollView>
    )
}

export default ProfileInfo
export { TransactionDetailsCard }

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

    cardHeading: {
        ...fontSizes.heading_small,
        color: colors.Black,
        paddingBottom: 16
    },

    cardBody: {
        marginVertical: 16,
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    itemSpacing: {
        paddingBottom: 4
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardBodyText: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,

        marginTop: 4,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
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
    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },
});