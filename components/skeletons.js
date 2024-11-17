import React, { useState } from "react";
import { Dimensions, LayoutAnimation, Platform, StyleSheet, View } from "react-native";
import colors from "../styles/colors";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { useAnimatedProps, useFrameCallback, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function SkeletonAnimated({ width, height, marginTop }) {
    const locationY = useSharedValue(0);

    useFrameCallback(() => {
        if (locationY.value == 1) locationY.value = withTiming(0, { duration: 1000 });
        if (locationY.value == 0) locationY.value = withTiming(1, { duration: 1000 });
    });

    const animatedProps = useAnimatedProps(() => {
        return { locations: [0, locationY.value] }
    });

    return (
        <AnimatedLinearGradient colors={[colors.LightGray, colors.White]} animatedProps={animatedProps} style={{ width: width, height: height, marginTop: marginTop }}/>
    )
}

function SkeletonStatic({ width, height, marginTop }) {
    return (
        <LinearGradient colors={[colors.LightGray, colors.White]} locations={[0, 0.4]} style={{ width: width, height: height, marginTop: marginTop }}/>
    )
}
function Skeleton({ width = Dimensions.get('window').width, height = 200, marginTop = 0 }) {
    return (
        Platform.OS == 'ios' ? 
        <SkeletonAnimated width={width} height={height} marginTop={marginTop}/> : 
        <SkeletonStatic width={width} height={height} marginTop={marginTop}/>
    )
}

function SkeletonContainer({ child, childcount = 5, width = Dimensions.get('window').width, height = 64 }) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    return (
        child ?
        <View>
            <View style={{ opacity: 0 }} onLayout={(event) => setDimensions({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>{child}</View>
            <Skeleton width={dimensions.width} height={dimensions.height} marginTop={-dimensions.height}/>
            {  [...Array(childcount - 1).keys()].map((index) => { return <Skeleton key={index} width={dimensions.width} height={dimensions.height}/> }) }
        </View> : 
        [...Array(childcount).keys()].map((index) => { return <Skeleton key={index} width={width} height={height}/> })
    )
}

const styles = StyleSheet.create({
});

export default SkeletonContainer;
export { Skeleton };