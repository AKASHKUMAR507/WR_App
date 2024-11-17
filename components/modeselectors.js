import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../styles/colors";
import shadows from "../styles/shadows";
import fontSizes from "../styles/fonts";
import Pandora from "../utilities/pandora";

const DealModes = {
    Selling: 'Selling',
    Buying: 'Buying'
}

const NetworkModes = {
    Sellers: 'Sellers',
    Buyers: 'Buyers'
}

const PreferencesModes = {
    Selling: 'Selling',
    Buying: 'Buying',
}

function feedbackWrapper(callback) {
    return (args) => {
        Pandora.TriggerFeedback(Pandora.FeedbackType.Soft);
        callback(args);
    }
}

function DealsModeSelector({ mode = DealModes.Selling, onChangeMode = () => {} }) {
    return (
        <View style={styles.modeSelectorContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => feedbackWrapper(onChangeMode)(DealModes.Selling)} style={[styles.modeSelector, mode === DealModes.Selling && styles.modeSelectorActive]}>
                <Text style={[styles.modeSelectorText, mode === DealModes.Selling && styles.modeSelectorActiveText]}>Selling</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => feedbackWrapper(onChangeMode)(DealModes.Buying)} style={[styles.modeSelector, mode === DealModes.Buying && styles.modeSelectorActive]}>
                <Text style={[styles.modeSelectorText, mode === DealModes.Buying && styles.modeSelectorActiveText]}>Buying</Text>
            </TouchableOpacity>
        </View>
    )
}

function PreferencesModeSelector({ mode = PreferencesModes.Selling, onChangeMode = () => {} }) {
    return (
        <View style={styles.modeSelectorContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => feedbackWrapper(onChangeMode)(PreferencesModes.Selling)} style={[styles.modeSelector, mode === PreferencesModes.Selling && styles.modeSelectorActive]}>
                <Text style={[styles.modeSelectorText, mode === PreferencesModes.Selling && styles.modeSelectorActiveText]}>Selling</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => feedbackWrapper(onChangeMode)(PreferencesModes.Buying)} style={[styles.modeSelector, mode === PreferencesModes.Buying && styles.modeSelectorActive]}>
                <Text style={[styles.modeSelectorText, mode === PreferencesModes.Buying && styles.modeSelectorActiveText]}>Buying</Text>
            </TouchableOpacity>
        </View>
    )
}

function NetworkModeSelector({ mode = NetworkModes.Sellers, onChangeMode = () => {} }) {
    return (
        <View style={styles.modeSelectorContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => feedbackWrapper(onChangeMode)(NetworkModes.Sellers)} style={[styles.modeSelector, mode === NetworkModes.Sellers && styles.modeSelectorActive]}>
                <Text style={[styles.modeSelectorText, mode === NetworkModes.Sellers && styles.modeSelectorActiveText]}>Sellers</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => feedbackWrapper(onChangeMode)(NetworkModes.Buyers)} style={[styles.modeSelector, mode === NetworkModes.Buyers && styles.modeSelectorActive]}>
                <Text style={[styles.modeSelectorText, mode === NetworkModes.Buyers && styles.modeSelectorActiveText]}>Buyers</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    modeSelectorContainer: {
        backgroundColor: colors.White,
        ...shadows.shadowLight,

        flexDirection: 'row',
        justifyContent: 'space-between',

        zIndex: 10,
    },

    modeSelector: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

        paddingTop: 12,
        paddingBottom: 8,
    },

    modeSelectorText: {
        ...fontSizes.heading_small,
        color: colors.DarkGray,
    },

    modeSelectorActive: {
        borderBottomWidth: 2,
        borderBottomColor: colors.Primary,
    },

    modeSelectorActiveText: {
        color: colors.Primary,
    },
});

export { DealsModeSelector, PreferencesModeSelector, NetworkModeSelector, DealModes, PreferencesModes, NetworkModes };
