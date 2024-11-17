import { View, Text, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import VectorImage from 'react-native-vector-image';

function VerifiedBadge({ style = {} }) {
    return (
        <View style={[styles.badge, { ...style }]}>
            <VectorImage style={styles.badgeIcon} source={require('../../assets/icons/badge-check.svg')}/>
            <Text style={styles.badgeText}>Verified</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 4,
        paddingVertical: 2,

        borderRadius: 12,

        backgroundColor: colors.Success,

        flexDirection: 'row',
        alignItems: 'center',
    },

    badgeIcon: {
        width: 20,
        height: 20,
    },

    badgeText: {
        ...fontSizes.heading_xsmall,
        color: colors.White,

        marginHorizontal: 4,
    },
});

export default VerifiedBadge;