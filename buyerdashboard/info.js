import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../styles/colors'
import fontSizes from '../styles/fonts'
import VectorImage from 'react-native-vector-image'


const Info = ({
    onPress = () => { },
    infoText = null,
    style = null,
    disabled = false
}) => {
    return (
        <TouchableOpacity activeOpacity={0.8} disabled={disabled} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 8, columnGap: 8 }}>
            <Text style={{ ...fontSizes.heading_small, color: 'black' }}>{infoText}</Text>
            {!disabled ? <VectorImage style={{ ...style }} source={require('../assets/icons/info-circle.svg')} /> : null}
        </TouchableOpacity>
    )
}

const InfoBanner = ({ info, message }) => {
    return (
        <View style={styles.card}>
            {info && <Text style={styles.infoText} numberOfLines={1}>{info}</Text>}
            {message && <Text style={styles.infoMessage}>{message}</Text>}
            <View style={styles.triangle} />
        </View>
    )
}

const InfoBannerForOrder = ({
    po = null,
    onDelExt = () => { },
    onDelay = () => { },
}) => {

    const commonCardStyle = { flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 };

    const del = parseInt(po?.delay);
    const delExt = parseInt(po?.deliveryExtension);

    if (del === 0 && delExt === 0) { // on time
        return (
            <View style={commonCardStyle}>
                <View style={[styles.orderCard, { backgroundColor: colors.Success }]}>
                    <Text style={styles.extensionText} numberOfLines={1}>On Time</Text>
                    <View style={[styles.triangle, { borderTopColor: '#6ede8a' }]} />
                </View>
            </View>
        )
    } else if (del > 0 && delExt === 0) { // Delay
        return (
            <View>
                <View style={commonCardStyle}>
                    <View style={[styles.orderCard, { backgroundColor: colors.Error20 }]}>
                        <Text style={styles.extensionText} numberOfLines={1}>{del} Days</Text>
                        <View style={[styles.triangle, { borderTopColor: colors.Error }]} />
                    </View>
                </View>
                <View style={[commonCardStyle, { marginHorizontal: 24, paddingVertical: 0, justifyContent: 'center' }]}>
                    <Info onPress={onDelay} infoText={'Delay'} style={{ tintColor: colors.Error20 }} />
                </View>
            </View>
        )
    } else if (del < 0 && delExt === 0) { // Early
        return (
            <View>
                <View style={commonCardStyle}>
                    <View style={[styles.orderCard, { backgroundColor: colors.Primary }]}>
                        <Text style={styles.extensionText} numberOfLines={1}>{Math.abs(del)} Days</Text>
                        <View style={[styles.triangle, { borderTopColor: '#90caf9' }]} />
                    </View>
                </View>
                <View style={[commonCardStyle, { marginHorizontal: 24, paddingVertical: 0, justifyContent: 'center' }]}>
                    <Info disabled onPress={onDelay} infoText={'Early'} style={{ tintColor: colors.Primary }} />
                </View>
            </View>
        )
    } else if (del === 0 && delExt > 0) { // delivery extension
        return (
            <View>
                <View style={commonCardStyle}>
                    <View style={[styles.orderCard, { backgroundColor: '#982B1C' }]}>
                        <Text style={styles.extensionText} numberOfLines={1}>{delExt} Days</Text>
                        <View style={[styles.triangle, { borderTopColor: colors.DarkRed }]} />
                    </View>
                </View>
                <View style={[commonCardStyle, { marginHorizontal: 24, paddingVertical: 0, justifyContent: 'center' }]}>
                    <Info onPress={onDelExt} infoText={'Delivery Extension'} style={{ tintColor: colors.DarkRed }} />
                </View>
            </View>
        )
    } else if (del > 0 && delExt > 0) { // delay and delivery extension
        return (
            <View>
                <View style={commonCardStyle}>
                    <View style={[styles.orderCard, { backgroundColor: '#800000' }]}>
                        <Text style={styles.extensionText} numberOfLines={1}>{delExt} Days</Text>
                        <View style={[styles.triangle, { borderTopColor: colors.DarkRed }]} />
                    </View>
                    <View style={[styles.orderCard, { backgroundColor: colors.Error20, width: '40%' }]}>
                        <Text style={[styles.extensionText, { color: colors.White }]} numberOfLines={1}>{del} Days</Text>
                    </View>
                </View>
                <View style={[commonCardStyle, { marginHorizontal: 24, paddingVertical: 0 }]}>
                    <Info onPress={onDelExt} infoText={'Delivery Extension'} style={{ tintColor: '#800000' }} />
                    <Info onPress={onDelay} infoText={'Delay'} style={{ tintColor: colors.Error20 }} />
                </View>
            </View>
        )
    } else if (del < 0 && delExt > 0) { // early and delivery extension
        return (
            <View>
                <View style={commonCardStyle}>
                    <View style={[styles.orderCard, { backgroundColor: colors.Primary }]}>
                        <Text style={styles.extensionText} numberOfLines={1}>{Math.abs(del)} Days</Text>
                        <View style={[styles.triangle, { borderTopColor: '#90caf9' }]} />
                    </View>
                    <View style={[styles.orderCard, { backgroundColor: colors.Error20, width: '40%' }]}>
                        <Text style={[styles.extensionText, { color: colors.White }]} numberOfLines={1}>{delExt} Days</Text>
                    </View>
                </View>
                <View style={[commonCardStyle, { marginHorizontal: 24, paddingVertical: 0 }]}>
                    <Info disabled onPress={onDelay} infoText={'Early'} style={{ tintColor: colors.Primary }} />
                    <Info onPress={onDelExt} infoText={'Delivery Extension'} style={{ tintColor: colors.Error20 }} />
                </View>
            </View>
        )
    }

    return null
};


export default InfoBanner
export { InfoBannerForOrder }

const styles = StyleSheet.create({
    card: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

        paddingVertical: 8,
        paddingHorizontal: 24,
        marginTop: 16,

        backgroundColor: 'rgba(216, 13, 0, 0.10)',

        position: 'relative',
        overflow: 'hidden',
    },
    orderCard: {
        flex: 1,
        paddingVertical: 8,
        backgroundColor: colors.Error,
        justifyContent: 'center',
    },
    infoText: {
        ...fontSizes.heading_small,
        fontWeight: '700',

        letterSpacing: 1,
        textAlign: 'left',

        color: colors.Error,
    },

    extensionText: {
        ...fontSizes.heading_small,
        fontWeight: '700',

        letterSpacing: 1,
        textAlign: 'center',

        color: colors.White,
    },

    infoMessage: {
        ...fontSizes.heading_small,

        letterSpacing: 1,
        textAlign: 'left',

        color: colors.Error,

    },

    triangle: {
        position: 'absolute',

        bottom: 0,
        left: 0,
        width: 0,
        height: 0,

        borderLeftWidth: 20,
        borderLeftColor: colors.White,
        borderTopWidth: 20,
        borderTopColor: 'rgba(216, 13, 0, 0.20)',
    },
});