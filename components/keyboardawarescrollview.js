import { useKeyboard } from '@react-native-community/hooks';
import React, { createContext, useCallback, useEffect, useRef } from 'react';
import { Dimensions, Platform } from 'react-native';
import Animated, { runOnUI, scrollTo, useAnimatedKeyboard, useAnimatedRef, useAnimatedStyle, useDerivedValue, useScrollViewOffset, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ScrollIntoViewContext = createContext({ scrollIntoView: () => { }, resetScroll: () => { } });

const screenHeight = Dimensions.get('window').height;

const miniOSKeyboardHeight = 216;
const minAndroidKeyboardHeight = screenHeight / 3.5;

const minKeyboardHeight = Platform.select({ ios: miniOSKeyboardHeight, android: minAndroidKeyboardHeight });
const minScrollOffset = Math.min(minKeyboardHeight, miniOSKeyboardHeight);

function KeyboardAwareScrollView({
	contentContainerStyle,
	children
}) {
	const insets = useSafeAreaInsets();

	const keyboard = useAnimatedKeyboard();
	const staticKeyboard = useKeyboard();

	const animatedScrollRef = useAnimatedRef();

	const scroll = useSharedValue(0);
	const initalScrollValue = useSharedValue(0);
	const scrollHandler = useScrollViewOffset(animatedScrollRef);

	useDerivedValue(() => {
		scrollTo(animatedScrollRef, 0, scroll.value, true);
	});

	const animatedKeyboardMarginStyle = useAnimatedStyle(() => {
		return { marginBottom: keyboard.height.value || (staticKeyboard.keyboardShown ? staticKeyboard.keyboardHeight : 0) }
	});

	const scrollIntoView = (yPosition) => {
		if (yPosition - minScrollOffset <= 0 && scrollHandler.value + yPosition < minScrollOffset) return;

		initalScrollValue.value = scrollHandler.value;
		scroll.value = withTiming(Math.max(yPosition - minScrollOffset, 0));
	};

	const resetScroll = () => {
		if (scrollHandler.value < initalScrollValue.value) return;
		scroll.value = withTiming(initalScrollValue.value);
	};

	return (
		Platform.OS === 'ios' ?
			<Animated.ScrollView style={{ marginBottom: keyboard.height }} scrollToOverflowEnabled ref={animatedScrollRef} contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false} contentContainerStyle={[{ paddingBottom: insets.bottom + (insets.bottom ? 0 : 16) }, contentContainerStyle]}>
				<ScrollIntoViewContext.Provider value={{ scrollIntoView, resetScroll }}>
					{children}
				</ScrollIntoViewContext.Provider>
			</Animated.ScrollView> :
			<Animated.ScrollView style={animatedKeyboardMarginStyle} ref={animatedScrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={[{ paddingBottom: insets.bottom + 16 }, contentContainerStyle]}>
				<ScrollIntoViewContext.Provider value={{ scrollIntoView, resetScroll }}>
					{children}
				</ScrollIntoViewContext.Provider>
			</Animated.ScrollView>
	)
}

export default KeyboardAwareScrollView;