import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import colors from "../../styles/colors";
import fontSizes from "../../styles/fonts";
import { Platform } from "react-native";
import ProfileDetailsPage from "../buyerpages/profilepages/profile";
import BuyerAppTabNavigator from "./buyerapptabnavigator";
import DealDetailsPage from "../buyerpages/dealpages/dealdetails";
import ReferDealForm from "../buyerpages/dealpages/referdeal";
import ViewAttachmentsPage from "../../pages/viewattachments";
import ViewQuotationDetailsPage from "../buyerpages/dealpages/viewquotationdetails";
import ViewQuotationsPage from "../buyerpages/dealpages/viewquotations";
import ViewLineItemsPage from "../../pages/dealpages/viewlineitems";
import { EstimatedCard } from "../../pages/dealpages/viewquotationdetails";
import ViewInvoicesPage from "../../pages/dealpages/viewinvoices";
import ViewDealHistoryPage from "../../pages/dealpages/viewdealhistory";
import AddPurchaseOrderForm from "../buyerpages/dealpages/addpurchaseorder";
import ViewPurchaseOrdersPage from "../buyerpages/dealpages/viewpurchaseorders";
import ViewPOTrackingPage from "../viewpotracking";
import CameraPage from "../buyerpages/dealpages/camera";
import AddProductPage from "../buyerpages/dealpages/addproduct";
import ViewTakeRatePage from "../buyerpages/dealpages/viewtakeratepage";
import ViewBuyerQuoteLineItem from "../buyerpages/dealpages/viewbuyerquotelineitem";
import RfqPage from "../buyerpages/dealpages/viewrfq";
import ProfileInfo from "../buyerpages/profilepages/profileinfo";
import Support from "../buyerpages/profilepages/support";
import PrivacySetting from "../buyerpages/profilepages/privacysetting";
import ChangePassword from "../buyerpages/profilepages/changepassword";
import ProductList from "../buyerpages/productpage/productlistpage";
import ProductDetails from "../buyerpages/productpage/productdetailspage";
import SearchPage from "../buyerpages/productpage/searchpage";
import SpareDetailsPage from "../buyerpages/productpage/sparedetailspage";
import ViewBuyerAttachmentsPage from "../viewbuyerattachment";
import NotificationPage from "../notificationpages/notification";
import OrderDetailsPage from "../buyerpages/orderpages/orderdetailspage";
import DealManagerPage from "../buyerpages/orderpages/dealmanagerpage";
import EscalateIssuePage from "../buyerpages/orderpages/escalateissuepage";
import EscalateResolvePage from "../buyerpages/orderpages/escalateresolve";
import OneTimePerformancePage from "../buyerpages/profilepages/onetimeperformance";
import BrowsePage from "../buyerpages/bottomnavpages/browse";
import Welcome from "../../pages/welcome";

const Stack = createNativeStackNavigator();

function BuyerAppStackNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false, headerStyle: { backgroundColor: colors.White }, headerTitleStyle: { ...fontSizes.heading, color: colors.Black }, headerTintColor: Platform.select({ ios: null, android: colors.DarkGray }) }}>
			<Stack.Screen name="App" component={BuyerAppTabNavigator} options={{ headerShown: false }} />
			<Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
			<Stack.Screen name="Profile" component={ProfileDetailsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Profile' }} />
			<Stack.Screen name="ProfileInfo" component={ProfileInfo} options={{ headerShown: true, animation: 'slide_from_right', title: 'Profile' }} />
			<Stack.Screen name="OneTimePerformance" component={OneTimePerformancePage} options={{ headerShown: true, animation: 'slide_from_right', title: 'One Time Performance' }} />
			<Stack.Screen name="Supports" component={Support} options={{ headerShown: true, animation: 'slide_from_right', title: 'Supports' }} />
			<Stack.Screen name="PrivacySetting" component={PrivacySetting} options={{ headerShown: true, animation: 'slide_from_right', title: 'Privacy Setting' }} />
			<Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: true, animation: 'slide_from_right', title: 'Change Password' }} />
			<Stack.Screen name="BuyerDealDetails" component={DealDetailsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Deal' }} />
			<Stack.Screen name="ReferDeal" component={ReferDealForm} options={{ headerShown: true, animation: 'slide_from_right', title: 'Create New Deal' }} />
			<Stack.Screen name="ViewLineItems" component={ViewLineItemsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Line Items' }} />
			<Stack.Screen name="ViewBuyerQuoteLineItem" component={ViewBuyerQuoteLineItem} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Quotation Line Items' }} />
			<Stack.Screen name="ViewRfq" component={RfqPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View RFQ Details' }} />
			<Stack.Screen name="ViewEstimatedItems" component={EstimatedCard} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Estimated Items' }} />
			<Stack.Screen name="ViewQuotations" component={ViewQuotationsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Quotations' }} />
			<Stack.Screen name="ViewQuotationDetails" component={ViewQuotationDetailsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Quotation Details' }} />
			<Stack.Screen name="ViewPurchaseOrders" component={ViewPurchaseOrdersPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Purchase Orders' }} />
			<Stack.Screen name="ViewInvoices" component={ViewInvoicesPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Invoices' }} />
			<Stack.Screen name="ViewDealHistory" component={ViewDealHistoryPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Deal History' }} />
			<Stack.Screen name="ViewAttachments" component={ViewAttachmentsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Attachments' }} />
			<Stack.Screen name="ViewBuyerAttachments" component={ViewBuyerAttachmentsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'View Attachments' }} />
			<Stack.Screen name="AddPurchaseOrder" component={AddPurchaseOrderForm} options={{ headerShown: true, animation: 'slide_from_right', title: 'Create Purchase Order' }} />
			<Stack.Screen name="ViewPOTracking" component={ViewPOTrackingPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Order Tracking' }} />
			<Stack.Screen name="AddProduct" component={AddProductPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Add Product' }} />
			<Stack.Screen name="CameraPage" component={CameraPage} options={{ headerShown: false, animation: 'slide_from_right', title: 'Take Photo' }} />
			<Stack.Screen name="ViewTakeRatePage" component={ViewTakeRatePage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Overall Take Rate' }} />
			<Stack.Screen name="ProductListPage" component={ProductList} options={{ headerShown: true, animation: 'slide_from_right', title: 'Products' }} />
			<Stack.Screen name="ProductDetailsPage" component={ProductDetails} options={{ headerShown: true, animation: 'slide_from_right', title: 'Product Details' }} />
			<Stack.Screen name="SearchPage" component={SearchPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Search Product' }} />
			<Stack.Screen name="SpareDetailsPage" component={SpareDetailsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Spare Details' }} />
			<Stack.Screen name="NotificationPage" component={NotificationPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Notifications' }} />
			<Stack.Screen name="OrderDetailsPage" component={OrderDetailsPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Order Details' }} />
			<Stack.Screen name="DealManagerPage" component={DealManagerPage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Deal Manager Contact' }} />
			<Stack.Screen name="EscalateIssuePage" component={EscalateIssuePage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Escalate Issue' }} />
			<Stack.Screen name="EscalateResolvePage" component={EscalateResolvePage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Issue Raised' }} />
			<Stack.Screen name="PurchaseOrder" component={BrowsePage} options={{ headerShown: true, animation: 'slide_from_right', title: 'Purchase Order' }} />

		</Stack.Navigator>
	)
}

export default BuyerAppStackNavigator;