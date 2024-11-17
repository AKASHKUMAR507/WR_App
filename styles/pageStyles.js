const { StyleSheet } = require("react-native");
const { default: colors } = require("./colors");
const { default: fontSizes } = require("./fonts");

const pageStyles = StyleSheet.create({
    page: {
        backgroundColor: colors.White,
    },
    vspace: {
        height: 1,
        backgroundColor: colors.LightGray
    },
    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 24,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    cardWithoutBorder: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 24,
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

    cardHeading: {
        color: colors.Black,
        ...fontSizes.heading,
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardBodyText: {
        ...fontSizes.body,
        color: colors.DarkGray,

        marginTop: 4,
    },

    cardTextBold: {
        ...fontSizes.heading_small,
        color: colors.Black,

        textTransform: 'none',
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    statusPills: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    indicator: {
        width: 12,
        height: 12,

        borderRadius: 6,
        backgroundColor: colors.Error,

        marginHorizontal: 4,
    },

    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        backgroundColor: colors.White,

        borderTopColor: colors.LightGray,
        borderTopWidth: 1,
    },

    idText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    coverImage: {
        height: 50,
        width: 50,

        resizeMode: 'contain',

        borderRadius: 25,
    },
});

export default pageStyles;