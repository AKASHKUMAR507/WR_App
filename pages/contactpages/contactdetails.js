import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import MenuButton from '../../components/atoms/menubutton';
import AvatarPlaceholder from '../../components/avatarplaceholder';
import Aphrodite from '../../utilities/aphrodite';

function ContactDetails({ contact }) {
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.contactHeader}>
                    <AvatarPlaceholder style={styles.contactIcon} seed={contact.contact.email}/>
                    <Text style={styles.cardHeading}>{contact.name}</Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.cardTextBold}>Contact Number</Text>
                <Text style={styles.cardBodyText}>{contact.contact.countryCode} {contact.contact.mobile}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.cardTextBold}>Email</Text>
                <View style={styles.sectionGroup}>
                    <Text style={styles.cardBodyText}>{contact.contact.email}</Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.cardTextBold}>Address</Text>
                <View style={styles.sectionGroup}>
                    { contact.address.line1 && <Text style={styles.cardBodyText}>{contact.address.line1}</Text> }
                    { contact.address.line2 && <Text style={styles.cardBodyText}>{contact.address.line2}</Text> }
                    <Text style={styles.cardBodyText}>{Aphrodite.FormatCommaSeparatedString(contact.address.city, contact.address.country, contact.address.pincode)}</Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.cardTextBold}>Company</Text>
                <View style={styles.sectionGroup}>
                    <Text style={styles.cardBodyText}>{contact.company.name}</Text>
                </View>
            </View>
            {
                contact.company.designation && 
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Designation</Text>
                    <View style={styles.sectionGroup}>
                        <Text style={styles.cardBodyText}>{contact.company.designation}</Text>
                    </View>
                </View>
            }
            {
                contact.company.department &&
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Department</Text>
                    <View style={styles.sectionGroup}>
                        <Text style={styles.cardBodyText}>{contact.company.department}</Text>
                    </View>
                </View>
            }
            {
                contact.company.website &&
                <View style={styles.section}>
                    <Text style={styles.cardTextBold}>Company Website</Text>
                    <View style={styles.sectionGroup}>
                        <Text style={styles.cardBodyText}>{contact.company.website}</Text>
                    </View>
                </View>
            }
            <MenuButton disabled={contact.attachments.length === 0} label='View Contact Attachments' onPress={() => navigation.navigate('ViewAttachments', { attachments: contact.attachments, pageTitle: 'View Contact Attachments' })}/>
            <MenuButton label='View Linked Deals' onPress={() => navigation.navigate('ContactDeals', { type: contact.type, id: contact.id })}/>
            <View style={styles.vspace}/>
            <MenuButton label='Edit Contact' disabled/>
            <View style={styles.vspace}/>
        </View>
    )
}

function ContactDetailsPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    useLayoutEffect(() => {
        const titleFromRoute = props.route?.params?.title;
        if (titleFromRoute) navigation.setOptions({ title: titleFromRoute });
    }, []);

    const contact = props.route?.params?.contact;

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
            <ContactDetails contact={contact}/>
        </ScrollView>   
    )
}

const styles = StyleSheet.create({
    page: {
        flexGrow: 1,
        justifyContent: 'space-between',
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

    contactHeader: {
        alignItems: 'center',
        width: '100%',
    },

    contactIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,

        backgroundColor: colors.DarkGray20,
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 8,
    },

    contactIconText: {
        ...fontSizes.heading_xxlarge,
        color: colors.DarkGray80,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    cardBody: {
        paddingTop: 16,
    },

    cardHeading: {
        ...fontSizes.heading,
        color: colors.Black,
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

export default ContactDetailsPage;