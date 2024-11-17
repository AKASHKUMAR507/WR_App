import { Dimensions, Platform, StyleSheet } from "react-native";
import fontSizes from "./fonts";
import colors from "./colors";

const formStyles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },

    formSection: {
        marginBottom: 24,
    },

    formSectionTitle: {
        ...fontSizes.heading,
        color: colors.Black,

        marginBottom: 8,
    },

    formSectionDescription: {
        ...fontSizes.body,
        color: colors.DarkGray,
    },

    formRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    formActionContainer: {
        marginVertical: 12,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    formAction: {
        ...fontSizes.heading_small,
        color: colors.Primary
    },
});

export default formStyles;