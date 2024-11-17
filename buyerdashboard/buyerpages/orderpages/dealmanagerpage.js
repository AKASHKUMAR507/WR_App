import { Linking, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import VectorImage from 'react-native-vector-image';
import AvatarPlaceholder from '../../../components/avatarplaceholder';
import fontSizes from '../../../styles/fonts';
import colors from '../../../styles/colors';
import { Button } from '../../../components/atoms/buttons';


const DealManagerPage = (props) => {
    const { contact } = props.route.params;

    const emailSubject = 'Hello from My App';
    const emailBody = 'This is a template for the email body.';

    const handleEmail = () => {
        const emailAddress = contact.email;
        let emailUri = `mailto:${emailAddress}`;

        // if (emailSubject) { emailUri += `?subject=${encodeURIComponent(emailSubject)}`; }
        // if (emailBody) { emailUri += `&body=${encodeURIComponent(emailBody)}`; }

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

    console.log(contact.phone)
    return (
        <View style={styles.container}>
            <VectorImage style={styles.banner} source={require('../../../assets/icons/contact.svg')} />

            <Text style={styles.heading}>Contact</Text>
            <View style={styles.avatar}>
                <AvatarPlaceholder seed={contact.email} />
                <View style={styles.container}>
                    <Text style={styles.headingText}>{contact.name}</Text>
                    {contact.phone && <Text style={styles.text}>{contact.phone}</Text>}
                    {contact.email && <Text style={styles.text}>{contact.email}</Text>}
                </View>
            </View>

            <View style={styles.button}>
                <Button label='Email' disabled={!contact.email} onPress={handleEmail} />
                <Button label='Phone' disabled={!contact.phone} onPress={handlePhone} />
            </View>
        </View>
    )
}

export default DealManagerPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    banner: {
        alignSelf: 'center',
        marginTop: 24,
        resizeMode: 'contain',

        width: '80%',
        height: '30%',
    },

    avatar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

        columnGap: 16,

        paddingHorizontal: 16,
        paddingTop: 16
    },

    heading: {
        ...fontSizes.heading_large,
        color: colors.Black,
        paddingHorizontal: 16,

        paddingTop: 48
    },

    headingText: {
        ...fontSizes.heading_small,
        color: colors.Black,
        fontWeight: '700'
    },

    text: {
        ...fontSizes.button_small,
        color: colors.Black
    },

    button: {
        paddingHorizontal: 16,
        paddingVertical: 32,

        gap: 12
    }
})