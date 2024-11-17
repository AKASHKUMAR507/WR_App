import { StyleSheet, View, Text, Dimensions } from "react-native"
import colors from "../styles/colors"
import fontSizes from "../styles/fonts"
import ExpandableText from "./expandabletext"

const MenuItemCard = ({ label = "Input Label", value = "N/A", expandableText = false }) => {

    return (
        <View style={[styles.cardFooter, { marginBottom: 8 }]}>
            <Text style={styles.cardTextBold}>{label}</Text>
            <View style={styles.longTextContainer}>
                {!expandableText && <Text style={styles.cardTextRight}>{value || 'Not Specified'}</Text>}
                {expandableText && <ExpandableText textStyles={{ textAlign: 'left', ...fontSizes.heading_xsmall, color: colors.DarkGray, }} toggleStyles={{ textAlign: 'left' }} text={value} numberOfLines={3} />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    longTextContainer: {
        width: Dimensions.get('window').width * 0.5,
    },

    cardTextRight: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,

        textAlign: 'left',
    },

})

export default MenuItemCard;