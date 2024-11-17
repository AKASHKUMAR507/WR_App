import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TicketDetailsCard } from './viewticket';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import MenuButton from '../../components/atoms/menubutton';
import { useNavigation } from '@react-navigation/native';
import { ViewAssociateTicketDetail, ViewTickets } from '../../network/models/setting';
import useRequest from '../../hooks/request';

const TicketDetails = (props) => {
    const navigation = useNavigation();
    const ticket = props.route.params.ticket;

    const [attachments, setAttachments] = useState([])

    useEffect(() => {
        fetchTicket();
    }, [])

    const fetchTicket = async () => {
        try {
            const response = await ViewAssociateTicketDetail(ticket.item.ticketid);
            const ticketDetails = response.data;
            setAttachments(ticketDetails[0]?.ticketAttachments)
        } catch (error) {
            throw error;
        }
    }

    return (
        <React.Fragment>
            <View style={styles.card}>
                <TicketDetailsCard ticket={ticket} detailPageFlag={true} />
            </View>

            <MenuButton disabled={attachments.length > 0 ? false : true} label='View Ticket Attachments' onPress={() => navigation.navigate('ViewAttachments', { attachments: attachments, pageTitle: 'View Ticket Attachments' })} />
        </React.Fragment>
    )
}

export default TicketDetails

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
    attachment: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    attachmentText: {
        color: colors.Black,
        ...fontSizes.heading_small,
    }
})