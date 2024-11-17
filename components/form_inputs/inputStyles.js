import { Platform, StyleSheet } from "react-native";
import colors from "../../styles/colors";
import fontSizes from "../../styles/fonts";

const inputStyles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

        marginVertical: 4,

        marginBottom: 16,
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

        width: '100%',

        borderBottomWidth: 1.5,
        borderColor: colors.Gray,

        backgroundColor: colors.LightGray20,

        paddingVertical: Platform.OS === 'ios' ? 8 : 2,

        marginTop: 4,
    },

    textInput: {
        ...fontSizes.body,
        width: '100%',

        color: colors.Black80,
        padding: 0,
    },

    inputInfo: {
        ...fontSizes.body_small,
        color: colors.DarkGray,

        marginTop: 4,
    },

    inputLabel: {
        ...fontSizes.body,
        color: colors.Black,
    },

    inputOptional: {
        ...fontSizes.caption,
        color: colors.DarkGray,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    error: {
        ...fontSizes.body_small,
        color: colors.Error,

        marginTop: 8,
    },
});

export default inputStyles;