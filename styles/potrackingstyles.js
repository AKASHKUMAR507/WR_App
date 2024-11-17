import { StyleSheet } from "react-native";
import colors from "../styles/colors";
import fontSizes from "../styles/fonts";
import { Dimensions } from "react-native";

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
    },

    centerContentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    titleContainer: {
        flex: 1,
        paddingRight: 24,
        width: Dimensions.get('window').width - 24,
        flexWrap: 'wrap'
    },

    titleStyle: {
        ...fontSizes.heading_xsmall,
    },

    timeStyle1: {
        ...fontSizes.body_xsmall,
    },

    timeStyle2: {
        ...fontSizes.body_xsmall,
    },

    commentStyleText: {
        ...fontSizes.body_xsmall,
        color: colors.DarkGray,
        paddingBottom: 4,
    },

    currentStatusTextStyle: {
        ...fontSizes.body_small,
        color: colors.DarkGray,
    },

    attachmentStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },

    attachmentIconStyle: {
        height: 16,
        width: 16,
        tintColor: colors.Primary
    },

    attachmentTextStyle: {
        ...fontSizes.heading_xsmall,
        color: colors.Primary
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardBody: {
        marginVertical: 16,
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,

        marginTop: 12,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardBodyText: {
        ...fontSizes.body_small,
        color: colors.Black,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    cardRowWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    tag: {
        backgroundColor: colors.Primary,
        borderRadius: 16,

        paddingHorizontal: 16,
        paddingVertical: 4,

        marginRight: 8,
        marginBottom: 8,
    },

    tagText: {
        ...fontSizes.button_small,
        color: colors.White,
    },

    swipe: {
        ...fontSizes.heading_small,
        fontWeight: 700,

        color: colors.Primary,
    },

    vspace: {
        height: 16,
        backgroundColor: colors.LightGray,
    },

});

export default styles;