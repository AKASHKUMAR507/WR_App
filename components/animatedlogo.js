
import { Dimensions, Image, StyleSheet, View, Easing, Animated } from 'react-native'
import React, { useEffect } from 'react'
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const AppLogo = () => {
    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(Animated.timing(animatedValue, { toValue: 1, duration: 3000, easing: Easing.linear.inOut, useNativeDriver: true })).start();
    }, []);

    const translateX = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [-width, width] })

    const maskElement = (
        <View style={styles.maskElementStyle}>
            <Image source={require('../assets/images/WorldRefIcon.png')} resizeMode='contain' style={{ height: width * 0.4, width: width * 0.4 }}/>
        </View>
    )

    return (
        <View>
            <View style={styles.container}>
                <Image source={require('../assets/images/WorldRefIcon.png')} resizeMode='contain' style={{ height: width * 0.4, width: width * 0.4 }}/>
            </View>
            <MaskedView style={{ flex: 1, flexDirection: 'row', height: '100%' }} maskElement={maskElement}>
                <AnimatedLinearGradient
                    colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ ...StyleSheet.absoluteFill, transform: [{ translateX: translateX }] }}
                />
            </MaskedView>
        </View>
    )
}

export default AppLogo;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'transparent',

        height: width * 0.4,
        width: width * 0.4,
    },

    maskElementStyle: {
        flex: 1,

        backgroundColor: 'transparent',

        justifyContent: 'center',
        alignItems: 'center',
    }
})