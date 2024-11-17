import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import MenuButton from '../../components/atoms/menubutton';
import { DealPayments } from '../../network/models/deals';
import Aphrodite from '../../utilities/aphrodite';
import { DealTypes } from './dealdetails';
import useCurrentDeal from '../../hooks/currentdeal';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import { PaymentDealInfoForBuyer, PaymentDealInfoForSeller } from '../../utilities/paymentdetails';
import useUserRoles from '../../stores/userrole';

function PaymentDealDetailsSellers({ paymentInfo, dealType, role }) {
  const [dealProfit, setDealProfit] = useState();

  const getDealProfit = async () => {
    const { dealProfitInUSD } = await PaymentDealInfoForSeller({ paymentInfo: paymentInfo, dealType: dealType, role: role })
    setDealProfit(dealProfitInUSD)
  }

  useEffect(() => {
    getDealProfit();
  }, [])

  return (
    <React.Fragment>
      <View style={styles.section}>
        <Text style={styles.cardTextBold}>Total Deal Value</Text>
        <Text style={styles.cardBodyText}>{paymentInfo.bpocurrency || 'USD'} {Aphrodite.FormatNumbers(paymentInfo.totaldealvalue)}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.cardTextBold}>Invoiced Amount</Text>
        <Text style={styles.cardBodyText}>{paymentInfo.invcurency || 'USD'} {Aphrodite.FormatNumbers(paymentInfo.worldrefinvoicedamount)}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.cardTextBold}>Deal Profit</Text>
        <Text style={styles.cardBodyText}>USD {Aphrodite.FormatNumbers(dealProfit)}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.cardTextBold}>Amount Received By WorldRef</Text>
        <Text style={styles.cardBodyText}>USD {Aphrodite.FormatNumbers(paymentInfo.feesreceivedbyworldref)}</Text>
      </View>
    </React.Fragment>
  )
}

function PaymentDealDetailsBuyers({ paymentInfo, role, dealType }) {
  console.log(paymentInfo)
  const [dealProfit, setDealProfit] = useState();

  const getDealProfit = async () => {
    const { dealProfitInUSD } = await PaymentDealInfoForBuyer({ paymentInfo: paymentInfo, dealType: dealType, role: role })
    setDealProfit(dealProfitInUSD)
  }

  useEffect(() => {
    getDealProfit();
  }, [])

  return (
    <React.Fragment>
      <View style={styles.section}>
        <Text style={styles.cardTextBold}>Total PO Value</Text>
        <Text style={styles.cardBodyText}>{paymentInfo.bpocurrency} {Aphrodite.FormatNumbers(paymentInfo.totaldealvalue)}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.cardTextBold}>Amount Invoiced</Text>
        <Text style={styles.cardBodyText}>{paymentInfo.invcurency} {Aphrodite.FormatNumbers(paymentInfo.worldrefinvoicedamount)}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.cardTextBold}>Deal Profit</Text>
        <Text style={styles.cardBodyText}>USD {Aphrodite.FormatNumbers(dealProfit)}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.cardTextBold}>Amount Received By Seller</Text>
        <Text style={styles.cardBodyText}>USD {Aphrodite.FormatNumbers(paymentInfo.amountreceivedseller || 0)}</Text>
      </View>
    </React.Fragment>
  )
}

function PaymentDetails({ paymentInfo, dealType, role }) {

  return (
    <View>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>Deal Details</Text>
          {dealType === DealTypes.Selling ? <PaymentDealDetailsSellers paymentInfo={paymentInfo} dealType={dealType} role={role} /> : <PaymentDealDetailsBuyers paymentInfo={paymentInfo} dealType={dealType} role={role} />}
        </View>
        <View style={styles.vspace} />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>Associate Success Fee Details</Text>
          <View style={styles.section}>
            <Text style={styles.cardTextBold}>Total Success Fee</Text>
            <Text style={styles.cardBodyText}>USD {Aphrodite.FormatNumbers(paymentInfo.totalassociatesuccessfees)}</Text>
          </View>
          <MenuButton label='View Fee Sharing Details' />
          <View style={styles.vspace} />
          <View style={styles.section}>
            <Text style={styles.cardTextBold}>Success Fee Paid</Text>
            <Text style={styles.cardBodyText}>USD {Aphrodite.FormatNumbers(paymentInfo.feesreceivedbyassociate)}</Text>
          </View>
          <MenuButton label='View Details' />
          <View style={styles.vspace} />
          <View style={styles.section}>
            <Text style={styles.cardTextBold}>Success Fee Not Paid</Text>
            <Text style={styles.cardBodyText}>USD {Aphrodite.FormatNumbers(paymentInfo.totalassociatesuccessfees - paymentInfo.couldbeclaimedamount)}</Text>
          </View>
          <MenuButton label='View Details' />
          <View style={styles.vspace} />
          <View style={styles.section}>
            <Text style={styles.cardTextBold}>Success Fee Claimable</Text>
            <Text style={styles.cardBodyText}>USD {Aphrodite.FormatNumbers(paymentInfo.couldbeclaimedamount)}</Text>
          </View>
          <MenuButton label='Submit Claim' />
          <View style={styles.vspace} />
        </View>
      </View>
    </View>
  )
}

function ViewPaymentsPage(props) {
  const insets = useSafeAreaInsets();

  const [currentDeal] = useCurrentDeal();
  const [paymentInfo, setPaymentInfo] = useState();

  const userRole = useUserRoles(state => state.userRole);
  const userRoleByAsnycStorage = useUserRoles(state => state.loadUserRole);

  const createAlert = useContext(AlertBoxContext);

  useEffect(() => {
    fetchDealPaymentInfo();
  }, []);

  const fetchDealPaymentInfo = async () => {
    try {
      const paymentInfoResponse = await DealPayments(currentDeal.id);
      setPaymentInfo(paymentInfoResponse);
    }
    catch (error) {
      createAlert(Alert.Error(error.message));
    }
  }

  if (!paymentInfo) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.DarkGray} />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
      <PaymentDetails paymentInfo={paymentInfo} dealType={currentDeal.dealType} role={currentDeal.role} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: colors.White,

    borderTopColor: colors.LightGray,
    borderBottomColor: colors.LightGray,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardBody: {
    paddingTop: 16,
  },

  cardTitle: {
    ...fontSizes.heading_small,
    color: colors.Black,

    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  cardText: {
    ...fontSizes.heading_xsmall,
    color: colors.DarkGray,
  },

  cardBodyText: {
    ...fontSizes.body,
    color: colors.DarkGray,

    marginBottom: 4,
  },

  cardTextBold: {
    ...fontSizes.heading_small,
    color: colors.Black,
  },

  vspace: {
    height: 24,
    backgroundColor: colors.LightGray,
  },

  section: {
    borderBottomColor: colors.LightGray,
    borderTopColor: colors.LightGray,
    borderTopWidth: 1,
    borderBottomWidth: 1,

    paddingVertical: 12,
    paddingHorizontal: 16,

    backgroundColor: colors.LightGray20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  sectionGroup: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',

    marginLeft: 16,

    flex: 1
  },
});

export default ViewPaymentsPage;
