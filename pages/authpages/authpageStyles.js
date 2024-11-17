import { Dimensions, Platform, StyleSheet } from "react-native";
import colors from "../../styles/colors";
import fontSizes from "../../styles/fonts";

const authPageStyles = StyleSheet.create({
    pageStyles: {
        backgroundColor: colors.White,
        paddingHorizontal: 16,

        flexGrow: 1,
        justifyContent: 'space-between',
    },

    formTop: {
        alignItems: 'center',
    },

    formBottom: {
        justifyContent: 'flex-end',
    },

    worldrefLogo: {
        width: Dimensions.get('window').width * 0.5,
        height: Dimensions.get('window').width * 0.5 * 0.25,

        alignSelf: 'center',
        marginTop: 48,
        marginBottom: 32,
    },

    signupText: {
        ...fontSizes.heading_large,
        color: colors.Black,
    },

    authRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        marginVertical: 16,
    },

    authRowItem: {
        width: 48,
        height: 48,

        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.Gray,

        alignItems: 'center',
        justifyContent: 'center',

        marginHorizontal: 12,
    },

    oauthIcon: {
        width: 32,
        height: 32,
    },

    infoSection: {
        alignItems: 'center',
        justifyContent: 'center',

        marginVertical: 16,
    },

    infoText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        marginVertical: 2,
    },

    infoTextLink: {
        ...fontSizes.heading_small,
        color: colors.Primary,

        marginVertical: 2,
    },

    appleOAuthIconOffest: {
        marginLeft: -1,
        marginTop: -2
    }
});

export default authPageStyles;