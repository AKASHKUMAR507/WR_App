import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import PrivacyInput from '../../components/form_inputs/privacyinput'
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview'
import formStyles from '../../styles/formStyles'
import fontSizes from '../../styles/fonts'
import colors from '../../styles/colors'
import { Alert, AlertBoxContext } from '../../components/alertbox'
import { EmailAndMessaging } from '../../network/models/setting'
import { useNotification } from '../../stores/fetchstore'

const NotificationPreferences = () => {
    const createAlert = useContext(AlertBoxContext);
    const notifications = useNotification(state => state.notification);

    const [toggleTradeAlerts, setToggleTradeAlerts] = useState(notifications?.tradealerts === 'y' ? true : false);
    const [toggleHotProducts, setToggleHotProducts] = useState(notifications?.hotproducts === 'y' ? true : false);
    const [toggleBuyerLeads, setToggleBuyerLeads] = useState(notifications?.buyerleads === 'y' ? true : false);
    const [toggleTradeShows, setToggleTradeShows] = useState(notifications?.tradeshows === 'y' ? true : false);
    const [toggleWebinars, setToggleWebinars] = useState(notifications?.webinars === 'y' ? true : false);
    const [toggleUserGuides, setToggleUserGuides] = useState(notifications?.userguides === 'y' ? true : false);
    const [toggleTrainingResources, setToggleTrainingResources] = useState(notifications?.training === 'y' ? true : false);
    const [toggleDealUpdates, setToggleDealUpdates] = useState(notifications?.dealupdates === 'y' ? true : false);
    const [toggleRFQsOffers, setToggleRFQsOffers] = useState(notifications?.approvalnotificaations === 'y' ? true : false);
    const [toggleTransactionNotifications, setToggleTransactionNotifications] = useState(notifications?.transactionnotificaations === 'y' ? true : false);
    const [toggleNewMessageNotifications, setToggleNewMessageNotifications] = useState(notifications?.newmessagenotificaations === 'y' ? true : false);
    const [toggleSystemAlerts, setToggleSystemAlerts] = useState(notifications?.systemalerts === 'y' ? true : false);

    const data = { tradealerts: toggleTradeAlerts ? 'y' : 'n', hotproducts: toggleHotProducts ? 'y' : 'n', buyerleads: toggleBuyerLeads ? 'y' : 'n', tradeshows: toggleTradeShows ? 'y' : 'n', webinars: toggleWebinars ? 'y' : 'n', userguides: toggleUserGuides ? 'y' : 'n', training: toggleTrainingResources ? 'y' : 'n', dealupdates: toggleDealUpdates ? 'y' : 'n', approvalnotificaations: toggleRFQsOffers ? 'y' : 'n', transactionnotificaations: toggleTransactionNotifications ? 'y' : 'n', newmessagenotificaations: toggleNewMessageNotifications ? 'y' : 'n', systemalerts: toggleSystemAlerts ? 'y' : 'n' }

    const notification = async () => {
        try {
            await EmailAndMessaging({ tradealerts: data.tradealerts, hotproducts: data.hotproducts, buyerleads: data.buyerleads, tradeshows: data.tradeshows, webinars: data.webinars, userguides: data.userguides, training: data.training, dealupdates: data.dealupdates, approvalnotificaations: data.approvalnotificaations, transactionnotificaations: data.transactionnotificaations, newmessagenotificaations: data.newmessagenotificaations, systemalerts: data.systemalerts })
        } catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    useEffect(() => {
        notification();
    }, [data.tradealerts, data.hotproducts, data.buyerleads, data.tradeshows, data.webinars, data.userguides, data.training, data.dealupdates, data.approvalnotificaations, data.transactionnotificaations, data.newmessagenotificaations, data.systemalerts])

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>

            <Text style={styles.labelStyle}>I want to receive...</Text>

            <View style={formStyles.formSection}>
                <PrivacyInput label='Trade Alerts' onToggle={() => setToggleTradeAlerts(!toggleTradeAlerts)} active={toggleTradeAlerts} />
                <PrivacyInput label='Hot Products' onToggle={() => setToggleHotProducts(!toggleHotProducts)} active={toggleHotProducts} />
                <PrivacyInput label='Buyer Leads' onToggle={() => setToggleBuyerLeads(!toggleBuyerLeads)} active={toggleBuyerLeads} />
                <PrivacyInput label='Expos/Trade Shows' onToggle={() => setToggleTradeShows(!toggleTradeShows)} active={toggleTradeShows} />
                <PrivacyInput label='Webinars' onToggle={() => setToggleWebinars(!toggleWebinars)} active={toggleWebinars} />
                <PrivacyInput label='User Guides' onToggle={() => setToggleUserGuides(!toggleUserGuides)} active={toggleUserGuides} />
                <PrivacyInput label='Training Resources' onToggle={() => setToggleTrainingResources(!toggleTrainingResources)} active={toggleTrainingResources} />
                <PrivacyInput label='Deal Updates' onToggle={() => setToggleDealUpdates(!toggleDealUpdates)} active={toggleDealUpdates} />
                <PrivacyInput label='Approval Notifications (RFQs/Offers)' onToggle={() => setToggleRFQsOffers(!toggleRFQsOffers)} active={toggleRFQsOffers} />
                <PrivacyInput label='Transaction Notifications' onToggle={() => setToggleTransactionNotifications(!toggleTransactionNotifications)} active={toggleTransactionNotifications} />
                <PrivacyInput label='New Message Notifications' onToggle={() => setToggleNewMessageNotifications(!toggleNewMessageNotifications)} active={toggleNewMessageNotifications} />
                <PrivacyInput label='System Alerts' onToggle={() => setToggleSystemAlerts(!toggleSystemAlerts)} active={toggleSystemAlerts} />
            </View>

        </KeyboardAwareScrollView>
    )
}

export default NotificationPreferences

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
    },
    labelStyle: {
        paddingHorizontal: 16,
        marginBottom: 12,

        ...fontSizes.heading,
        color: colors.Black80
    },
    btnContainer: {
        paddingHorizontal: 16,
    }
})