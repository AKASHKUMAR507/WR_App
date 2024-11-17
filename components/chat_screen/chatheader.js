import { View, Text, StyleSheet } from 'react-native';
import shadows from '../../styles/shadows';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import AvatarPlaceholder from '../avatarplaceholder';

function DealManagerHeader({ name }) {
    return (
        <View style={styles.header}>
            <AvatarPlaceholder size={48} style={styles.headerIcon} seed={name}/>
            <View style={styles.headerBody}>
                <Text style={styles.headerTitle}>{name}</Text>
                <Text style={styles.headerText}>Deal Manager (WorldRef)</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 8,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

        ...shadows.shadowLight,

        zIndex: 10,
    },

    headerIcon: {
        width: 48,
        height: 48,

        borderRadius: 24,

        backgroundColor: colors.DarkGray,
    },

    headerBody: {
        marginLeft: 8,
    },

    headerTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,

        textTransform: 'capitalize',
    },

    headerText: {
        ...fontSizes.body_small,
        color: colors.DarkGray,
    },
});

export default DealManagerHeader;