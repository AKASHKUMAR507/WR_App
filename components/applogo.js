import { Dimensions, Image, StyleSheet, View, Easing, Animated } from 'react-native'
import React, { useEffect } from 'react'
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const { height, width } = Dimensions.get('window');
const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

const AppLogo = () => {
    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, { toValue: 1, duration: 3000, easing: Easing.linear.inOut, useNativeDriver: true,})
        ).start();
    },[])

    const translateX = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [-width, width]})

    const maskElement = (
        <View style={styles.maskElementStyle}>
            <Image style={{ height: height * .4, width: width * .4 }} source={require('../assets/icons/logo.png')} resizeMode='contain'/>
        </View>
    )

    return (
        <React.Fragment>
            <View style={styles.container}>
                <Image style={{ height: height * .4, width: width * .4 }} source={require('../assets/icons/logo.png')} resizeMode='contain'/>
            </View>

            <MaskedView style={{ flex: 1, flexDirection: 'row', height: '100%', }} maskElement={maskElement} >
                <AnimatedLG
                    colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ ...StyleSheet.absoluteFill, transform: [{ translateX: translateX }]}}/>
            </MaskedView >
        </React.Fragment>
    )
}

export default AppLogo;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'transparent',

        height: height * 0.4,
        width: width * 0.4,

        marginTop: height * 0.3,
        marginLeft: width * 0.3,
    },

    maskElementStyle: {
        flex: 1,

        backgroundColor: 'transparent',

        justifyContent: 'center',
        alignItems: 'center',
    }
})
