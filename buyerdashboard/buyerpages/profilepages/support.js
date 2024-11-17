import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Linking } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AvatarPlaceholder from '../../../components/avatarplaceholder';
import colors from '../../../styles/colors';
import fontSizes from '../../../styles/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBuyerProfileInformation } from '../../../stores/fetchstore';
import NoContentFound from '../../../components/nocontentfound';

function ContactCard({ contact }) {
    const navigation = useNavigation();

    const emailSubject = 'Hello from My App';
    const emailBody = 'This is a template for the email body.';

    const handleEmail = () => {
        const emailAddress = contact.email;
        let emailUri = `mailto:${emailAddress}`;

        if (emailSubject) { emailUri += `?subject=${encodeURIComponent(emailSubject)}`; }
        if (emailBody) { emailUri += `&body=${encodeURIComponent(emailBody)}`; }

        Linking.canOpenURL(emailUri)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(emailUri);
                } else {
                    console.log("Can't open email app");
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    const handlePhone = () => {
        const phoneNumber = contact.phone;
        const phoneUri = `tel:${phoneNumber}`;

        Linking.canOpenURL(phoneUri)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(phoneUri);
                } else {
                    console.log("Can't open phone app");
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    return (
        <TouchableOpacity disabled testID={`${contact.name}:contact`} style={styles.card} activeOpacity={0.8} onPress={() => handleEmail()}>
            <AvatarPlaceholder seed={contact.contactPersonEmail} />
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{contact.contactPersonName}</Text>
                <Text style={styles.cardText}>+91 {contact.contactPersonPhone} | {contact.contactPersonEmail}</Text>
                {/* <Text style={styles.cardText}>{contact.contactPersonEmail}</Text> */}
                <Text style={styles.cardText}>{contact.contactPersonDesignation}</Text>
            </View>
        </TouchableOpacity>
    )
}

const Support = () => {
    const insets = useSafeAreaInsets();
    const user = useBuyerProfileInformation(state => state.buyerProfileInfo);
    const noSupportContact = user?.object?.BuyerProfile?.buyerSupportList === undefined;
    if(noSupportContact){
        return <NoContentFound title='No Contacts' message='No Contact Found for support!!'/>
    }
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 48, paddingTop: insets.top + 16 }}>
            <Text style={[styles.cardTitle, styles.cardHeading]}>Email and Contact Numbers For Complaints</Text>
            {user.object.BuyerProfile?.buyerSupportList && user.object.BuyerProfile?.buyerSupportList.map((contact) => <ContactCard key={contact.id} contact={contact} />)}
        </ScrollView>
    )
}

export default Support

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 12,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,

        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    cardBody: {
        marginLeft: 16,
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        alignItems: 'center',
        textAlign: 'left',

        maxWidth: 320,
    },
    cardHeading: {
        paddingBottom: 16,
        paddingHorizontal: 16
    }
})