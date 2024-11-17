import { BlurView } from '@react-native-community/blur';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../styles/colors';
import shadows from '../styles/shadows';
import VectorImage from 'react-native-vector-image';
import fontSizes from '../styles/fonts';
import Pandora from '../utilities/pandora';

const home = require('../assets/icons/navigation-home.svg');
const homeActive = require('../assets/icons/navigation-home-active.svg');

const deals = require('../assets/icons/navigation-deals.svg');
const dealsActive = require('../assets/icons/navigation-deals-active.svg');

const refer = require('../assets/icons/navigation-refer.svg');
const referActive = require('../assets/icons/navigation-refer-active.svg');

const transactions = require('../assets/icons/navigation-transactions.svg');
const transactionsActive = require('../assets/icons/navigation-transactions-active.svg');

const network = require('../assets/icons/navigation-network.svg');
const networkActive = require('../assets/icons/navigation-network-active.svg');

function BuyerBottomBar({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 2 }]}>
            {
                state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined ? options.tabBarLabel :
                            options.title !== undefined ? options.title : route.name;

                    const isFocused = state.index === index;

                    const icon = () => {
                        switch (label) {
                            case 'Summary':
                                return isFocused ? homeActive : home;
                            case 'My Deals':
                                return isFocused ? dealsActive : deals;
                            case 'Browse':
                                return isFocused ? referActive : refer;
                            case 'Earnings':
                                return isFocused ? transactionsActive : transactions;
                            case 'Network':
                                return isFocused ? networkActive : network;
                            case 'My Orders':
                                return isFocused ? transactionsActive : transactions;
                            case 'Home':
                                return isFocused ? homeActive : home;
                            case 'My Products':
                                return isFocused ? referActive : refer;
                            default:
                                return refer;
                        }
                    }

                    const onPress = () => {
                        Pandora.TriggerFeedback(Pandora.FeedbackType.Soft);

                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate({ name: route.name, merge: true });
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.button}
                            key={index}
                            activeOpacity={0.8}
                        >
                            <VectorImage style={styles.bottomBarIcon} source={icon()} />
                            <Text style={[styles.bottomBarText, { color: isFocused ? colors.Primary : colors.DarkGray }]}>{label}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        paddingVertical: 8,
        paddingHorizontal: 16,

        backgroundColor: colors.White,

        ...shadows.shadowHeavy,
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    bottomBarIcon: {
        width: 28,
        height: 28,
    },

    bottomBarText: {
        ...fontSizes.button_xsmall,
        marginTop: 4,
    },
});

export default BuyerBottomBar;