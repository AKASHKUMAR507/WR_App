import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Chronos from '../../utilities/chronos';
import DealStatusPill, { StatusTypeFromStatus } from '../../components/dealstatuspill';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import { useTickets } from '../../stores/fetchstore';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import NoContentFound from '../../components/nocontentfound';
import { FlashList } from "@shopify/flash-list";
import { Button } from '../../components/atoms/buttons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useRefreshScreens from '../../hooks/refreshscreens';

const TicketDetailsCard = ({ ticket, detailPageFlag=false }) => {
    const chronos = new Chronos();
    const dealstatus = StatusTypeFromStatus(ticket.item.status);

    return (
        <React.Fragment>
            <View style={styles.cardHeader}>
                <View style={styles.statusPills}>
                    <Text style={styles.idText}>Ticket ID {ticket.item.ticketid}</Text>
                    <DealStatusPill status={dealstatus} />
                </View>
                <Text style={styles.openDate}>{chronos.FormattedDateFromTimestamp(ticket.item.reportedddate)}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text numberOfLines={detailPageFlag ? 100 : 1} style={styles.cardTitle}>Subject: {ticket.item.subject}</Text>
                <Text numberOfLines={detailPageFlag ? 500 : 2} style={styles.cardBodyText}>Details: {ticket.item.description}</Text>
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.cardText}>Closed on <Text style={styles.cardTextBold}>{chronos.FormattedDateFromTimestamp(ticket.item.responsedate)}</Text></Text>
            </View>
        </React.Fragment>
    )
}

const TicketCard = ({ ticket }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate('TicketDetails', { ticket: ticket })} activeOpacity={0.8} style={styles.card}>
            <TicketDetailsCard ticket={ticket} />
        </TouchableOpacity>
    )
}

const ViewTicket = (props) => {
    const navigation = useNavigation();
    const refreshScreens = useRefreshScreens();

    const { tickets, loadTickets, fetchTickets } = useTickets();

    const createAlert = useContext(AlertBoxContext);

    useFocusEffect(React.useCallback(() => {
        fetchTicketDetails();
    },[]))

    const fetchTicketDetails = async () => {
        try {
            await fetchTickets();
        } catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }
    
    return (
        <React.Fragment>
            {
                tickets.length > 0 ?
                    <FlashList data={tickets} renderItem={(ticket) => <TicketCard key={ticket.index} ticket={ticket} />} estimatedItemSize={200} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle} /> :
                    <NoContentFound title={'No Ticket Found'} message={'Ticket not found create a new ticket!'} />
            }
            <React.Fragment>
                <View style={{ height: 64 }} />
                <View style={styles.buttonContainer}>
                    <Button label='Create New Ticket' onPress={() => navigation.navigate('RaiseaTicket')} />
                </View>
            </React.Fragment>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
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
    },
    statusPills: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    idText: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },
    openDate: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,

        marginTop: 4,
    },

    cardBodyText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,

        marginTop: 6,
    },
    cardFooter: {},

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,

        marginTop: 4,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,

        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,

        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
    },
    contentContainerStyle: {
        paddingBottom: 32,
    }
})

export default ViewTicket
export { TicketDetailsCard }