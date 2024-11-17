import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppTabNavigator from "./apptabnavigator";
import DealDetailsPage from "../pages/dealpages/dealdetails";
import ViewRFQsPage from "../pages/dealpages/viewrfqs";
import ViewReferredSellersPage from "../pages/dealpages/viewreferredsellers";
import ViewLineItemsPage from "../pages/dealpages/viewlineitems";
import ViewQuotationsPage from "../pages/dealpages/viewquotations";
import ViewQuotationDetailsPage, { EstimatedCard } from "../pages/dealpages/viewquotationdetails";
import ViewPurchaseOrdersPage from "../pages/dealpages/viewpurchaseorders";
import AddPurchaseOrdersPage from "../pages/dealpages/addpurchaseorder";
import ViewInvoicesPage from "../pages/dealpages/viewinvoices";
import AddInvoices from "../pages/dealpages/addinvoices";
import ViewDealHistoryPage from "../pages/dealpages/viewdealhistory";
import ViewPaymentsPage from "../pages/dealpages/viewpayments";
import ChatPage from "../pages/dealpages/chat";
import ViewAttachmentsPage from "../pages/viewattachments";
import EarningsListPage from "../pages/earningspages/earningslist";
import EarningDetailsPreClaimPage from "../pages/earningspages/earningdeatailspreclaim";
import EarningDetailsPostClaimPage from "../pages/earningspages/earningdetailspostclaim";
import ClaimRequestPage from "../pages/earningspages/claimrequest";
import ContactDetailsPage from "../pages/contactpages/contactdetails";
import ContactDealsPage from "../pages/contactpages/contactdeals";
import ReferDealForm from "../pages/dealpages/referdeal";
import AddQuotationForm from "../pages/dealpages/addquotation";
import AddContactForm from "../pages/contactpages/addcontact";
import ProfileDetailsPage from "../pages/profilepages/profile";
import ViewLiveDealsPage from "../pages/viewlivedeals";
import React from "react";
import colors from "../styles/colors";
import fontSizes from "../styles/fonts";
import PreferencesPage from "../pages/profilepages/preferences";
import { Platform } from "react-native";
import ProfileInfoPage from "../pages/profilepages/profileinfo";
import SupportPage from "../pages/profilepages/support";
import SocialProfile from "../pages/profilepages/socialprofile";
import PrivacySettings from "../pages/profilepages/privacysettings";
import NotificationPreferences from "../pages/profilepages/emailandmessaging";
import PaymentInfo from "../pages/profilepages/paymentinfo";
import BackAccount from "../pages/profilepages/backaccount";
import ViewTicket from "../pages/profilepages/viewticket";
import TicketDetails from "../pages/profilepages/ticketdetails";
import RaiseaTicketPage from "../pages/profilepages/raiseaticket";
import ViewAdditional from "../pages/dealpages/viewadditionalcharges";

const Stack = createNativeStackNavigator();

function AppStackNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false, headerStyle: { backgroundColor: colors.White }, headerTitleStyle: { ...fontSizes.heading, color: colors.Black }, headerTintColor: Platform.select({ ios: null, android: colors.DarkGray }) }}>
			<Stack.Screen name="App" component={AppTabNavigator} options={{ headerShown: false }} />
			<Stack.Screen name="Profile" component={ProfileDetailsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Profile' }} />
			<Stack.Screen name="ProfileInfo" component={ProfileInfoPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Profile Information' }} />
			<Stack.Screen name="Support" component={SupportPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Support' }} />
			<Stack.Screen name="ViewTicket" component={ViewTicket} options={{ headerShown: true, animation: 'slide_from_right', title: 'Ticket Summary' }} />
			<Stack.Screen name="TicketDetails" component={TicketDetails} options={{ headerShown: true, animation: 'slide_from_right', title: 'Ticket Details' }} />
			<Stack.Screen name="RaiseaTicket" component={RaiseaTicketPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Raise A Ticket' }} />
			<Stack.Screen name="Preferences" component={PreferencesPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Products and Services Preferences' }} />
			<Stack.Screen name="Notification" component={NotificationPreferences} options={{ headerShown: true, animation: 'slide_from_right', title: 'Notification Preferences' }} />
			<Stack.Screen name="SocialProfile" component={SocialProfile} options={{ headerShown: true, animation: 'slide_from_right', title: 'Social Profile' }} />
			<Stack.Screen name="Privacy" component={PrivacySettings} options={{ headerShown: true, animation: 'slide_from_right', title: 'Privacy' }} />
			<Stack.Screen name="Payment" component={PaymentInfo} options={{ headerShown: true, animation: 'slide_from_right', title: 'Payment Information' }} />
			<Stack.Screen name="BankAccount" component={BackAccount} options={{ headerShown: true, animation: 'slide_from_right', title: 'Back Account Details' }} />
			<Stack.Screen name="LiveDealDetails" component={ViewLiveDealsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Live Deal Details' }} />
			<Stack.Screen name="DealDetails" component={DealDetailsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Deal' }} />
			<Stack.Screen name="ViewRFQs" component={ViewRFQsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Deal RFQs' }} />
			<Stack.Screen name="ViewReferredSellers" component={ViewReferredSellersPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Referred Sellers' }} />
			<Stack.Screen name="ViewLineItems" component={ViewLineItemsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Line Items' }} />
			<Stack.Screen name="ViewAdditional" component={ViewAdditional} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Additional Charges' }} />
			<Stack.Screen name="ViewQuotations" component={ViewQuotationsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Quotations' }} />
			<Stack.Screen name="ViewQuotationDetails" component={ViewQuotationDetailsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Quotation Details' }} />
			<Stack.Screen name="EstimatedCard" component={EstimatedCard} options={{ headerShown: true, animation: 'slide_from_right', title: 'Estimated Items' }} />
			<Stack.Screen name="ViewPurchaseOrders" component={ViewPurchaseOrdersPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Purchase Orders' }} />
			<Stack.Screen name="AddPurchaseOrders" component={AddPurchaseOrdersPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Add Purchase Orders' }} />
			<Stack.Screen name="ViewInvoices" component={ViewInvoicesPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Invoices' }} />
			<Stack.Screen name="AddInvoices" component={AddInvoices} options={{ headerShown: true, animation: 'slide_from_right', title: 'Add Invoices' }} />
			<Stack.Screen name="ViewDealHistory" component={ViewDealHistoryPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Deal History' }} />
			<Stack.Screen name="ViewPayments" component={ViewPaymentsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Payments' }} />
			<Stack.Screen name="Chat" component={ChatPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Chat' }} />
			<Stack.Screen name="ViewAttachments" component={ViewAttachmentsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Attachments' }} />
			<Stack.Screen name="EarningsList" component={EarningsListPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Earnings' }} />
			<Stack.Screen name="EarningDetailsPreClaim" component={EarningDetailsPreClaimPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Earning Details' }} />
			<Stack.Screen name="EarningDetailsPostClaim" component={EarningDetailsPostClaimPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Claim Details' }} />
			<Stack.Screen name="ClaimRequest" component={ClaimRequestPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Claim Success Fee' }} />
			<Stack.Screen name="ContactDetails" component={ContactDetailsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Contact Details' }} />
			<Stack.Screen name="ContactDeals" component={ContactDealsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Deals For Contact' }} />
			<Stack.Screen name="ReferDeal" component={ReferDealForm} options={{ headerShown: true, animation: 'slide_from_right', title: 'Refer New Deal' }} />
			<Stack.Screen name="AddQuotation" component={AddQuotationForm} options={{ headerShown: true, animation: 'slide_from_right', title: 'Add Quotation' }} />
			<Stack.Screen name="AddContact" component={AddContactForm} options={{ headerShown: true, animation: 'slide_from_right', title: 'Refer New Contact' }} />
		</Stack.Navigator>
	)
}

export default AppStackNavigator;