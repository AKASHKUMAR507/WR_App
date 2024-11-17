import { StyleSheet, View } from "react-native";
import colors from "../styles/colors";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

const ProgressBar = ({ progress }) => {
    const aProgress = useSharedValue(0);
    const aColor = useSharedValue(colors.Success);

    useEffect(() => {
        aProgress.value = withTiming(progress, { duration: 2000 });
        aColor.value = withTiming(progress > 50 ? colors.Success : colors.Success, { duration: 1000 })
    }, [progress])

    const aStyle = useAnimatedStyle(() => {
        return {
            width: `${aProgress.value}%`,
            backgroundColor: aColor.value,
        }
    })

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressFiller, aStyle]} />
        </View>
    );
};

export default ProgressBar;

const styles = StyleSheet.create({
    progressBarContainer: {
        height: 3,
        width: '100%',
        backgroundColor: colors.Gray,
    },
    progressFiller: {
        height: '100%',
        backgroundColor: colors.Success,
    },
})