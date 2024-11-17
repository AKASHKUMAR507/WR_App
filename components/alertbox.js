import React, { useState, useRef, createContext, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Platform, LogBox } from 'react-native';
import colors from '../styles/colors';
import fontSizes from '../styles/fonts';
import shadows from '../styles/shadows';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import Animated, { interpolate, runOnJS, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Pandora from '../utilities/pandora';

const AlertType = {
	Success: 'Success',
	Error: 'Error',
	Info: 'Info'
}

const AlertErrorIcon = require('../assets/images/AlertErrorIcon.png');
const AlertSuccessIcon = require('../assets/images/AlertSuccessIcon.png');
const AlertInfoIcon = require('../assets/images/AlertInfoIcon.png');

function AlertImageFromAlertType(alertType) {
	switch (alertType) {
		case AlertType.Success:
			return AlertSuccessIcon;
		case AlertType.Error:
			return AlertErrorIcon;
		case AlertType.Info:
			return AlertInfoIcon;
		default:
			return AlertErrorIcon;
	}
}

function FeedbackTypeFromAlertType(alertType) {
	switch (alertType) {
		case AlertType.Success:
			return Pandora.FeedbackType.NotificationSuccess;
		case AlertType.Error:
			return Pandora.FeedbackType.NotificationError;
		case AlertType.Info:
			return Pandora.FeedbackType.NotificationWarning;
		default:
			return Pandora.FeedbackType.NotificationError;
	}
}

class Alert {
	constructor(title, message, type, timeout) {
		this.title = title || 'Alert';
		this.message = message || 'Something went wrong. Please try again.';
		this.type = type || AlertType.Error;
		this.image = AlertImageFromAlertType(this.type);
		this.timeout = timeout * 1000 || 5000;
		this.id = Math.random().toString(36).substring(7);
		this.feedbackType = FeedbackTypeFromAlertType(this.type);
	}

	get Identifier() {
		return this.id;
	}

	static Success(message = null, title = null, timeout = null) {
		return new Alert(title || 'Success', message, AlertType.Success, timeout);
	}

	static Error(message = null, title = null, timeout = null) {
		return new Alert(title || 'Error', message, AlertType.Error, timeout);
	}

	static Info(message = null, title = null, timeout = null) {
		return new Alert(title || 'Info', message, AlertType.Info, timeout);
	}
}

class Timer {
	constructor(callback, delay) {
		this.remainingTime = delay;
		this.callback = callback;
		this.startTime = null;
		this.timer = null;
	}

	pause() {
		clearTimeout(this.timer);
		this.remainingTime -= Date.now() - this.startTime;
	}

	resume() {
		this.startTime = Date.now();
		clearTimeout(this.timer);
		this.timer = setTimeout(this.callback, Math.max(this.remainingTime, 0));
	}

	clear() {
		clearTimeout(this.timer);
	}

	start() {
		this.startTime = Date.now();
		this.timer = setTimeout(this.callback, this.remainingTime);
	}
}

function AlertBox({ title, message, image, timeout, feedbackType, offsetIndex = 0, clear = () => { } }) {
	LogBox.ignoreLogs(['(ADVICE) View']);

	const insets = useSafeAreaInsets();

	const slide = useSharedValue(-128);
	const grabable = useSharedValue(true);

	const springParams = { mass: 2.5, damping: 45, stiffness: 400 }
	const harderSpringParams = { mass: 2.5, damping: 45, stiffness: 300 }

	const topInset = Math.max(insets.top, 8);

	const targetPosition = topInset + 8 + offsetIndex * 16;
	const dismissPosition = targetPosition / 2;

	const opacity = useDerivedValue(() => {
		return interpolate(slide.value, [-128, dismissPosition], [0, 1]);
	});

	const timer = new Timer(() => { grabable.value = false; slide.value = withSpring(-128, springParams, () => runOnJS(clear)()) }, timeout);

	const pauseTimer = () => timer.pause();
	const resumeTimer = () => timer.resume();
	const clearTimer = () => timer.clear();

	const snap = () => {
		'worklet'
		slide.value = withSpring(targetPosition, harderSpringParams, () => runOnJS(resumeTimer)());
	}

	const fling = () => {
		'worklet'
		grabable.value = false;
		runOnJS(clearTimer)();
		slide.value = withSpring(-128, springParams, () => runOnJS(clear)());
	}

	const panGesture = Gesture.Pan()
		.enabled(grabable.value)
		.onBegin(() => { runOnJS(pauseTimer)(); })
		.onUpdate(({ translationY }) => { slide.value = translationY + targetPosition })
		.onEnd(() => { (slide.value < dismissPosition) ? fling() : snap() })

	useEffect(() => {
		slide.value = withSpring(targetPosition, springParams);
		Pandora.TriggerFeedback(feedbackType);

		timer.start();
		return () => timer.clear();
	}, []);

	return (
		<GestureDetector gesture={panGesture}>
			<Animated.View testID={`${title}:alert`} style={[styles.alertContainer, Platform.OS === 'android' && styles.alertShadow, { top: slide, opacity: opacity }]}>
				<BlurView style={styles.alertBlurview} blurType='light' blurAmount={24} enabled={Platform.OS === 'ios'} />
				<View style={styles.alertBox}>
					<Image source={image} style={{ width: 64, height: 64 }} />
					<View style={styles.alertBody}>
						<Text style={styles.alertTitle}>{title}</Text>
						<Text style={styles.alertText}>{message}</Text>
					</View>
				</View>
			</Animated.View>
		</GestureDetector>
	);
};

const AlertBoxContext = createContext(() => { });

function AlertBoxWrapper({ children }) {
	const [alert, setAlert] = useState();
	const [scheduledAlerts, setScheduledAlerts] = useState([]);

	const createAlert = (newAlert) => {
		if (alert) {
			if (
				scheduledAlerts.some((scheduledAlert) => scheduledAlert.title === newAlert.title && scheduledAlert.message === newAlert.message) ||
				alert.title === newAlert.title && alert.message === newAlert.message
			) return;

			setScheduledAlerts((scheduledAlerts) => [...scheduledAlerts, newAlert || Alert.Error()]);
			return;
		}

		setAlert(newAlert || Alert.Error());
	}

	const clearAlert = () => {
		setAlert();
	}

	useEffect(() => {
		if (!alert && scheduledAlerts.length) {
			setAlert(scheduledAlerts[0]);
			setScheduledAlerts((scheduledAlerts) => scheduledAlerts.slice(1));
		}
	}, [alert]);

	return (
		<React.Fragment>
			{alert && <AlertBox key={alert.Identifier} title={alert.title} message={alert.message} image={alert.image} timeout={alert.timeout} feedbackType={alert.feedbackType} clear={() => clearAlert()} />}
			<AlertBoxContext.Provider value={createAlert}>
				{children}
			</AlertBoxContext.Provider>
		</React.Fragment>
	)
}

const styles = StyleSheet.create({
	alertContainer: {
		position: 'absolute',

		width: Dimensions.get('window').width * 0.95,
		marginLeft: Dimensions.get('window').width * 0.025,

		backgroundColor: Platform.OS === 'ios' ? colors.White20 : colors.White98,

		justifyContent: 'center',
		alignItems: 'center',

		zIndex: 10,
		borderRadius: 16,
	},

	alertShadow: {
		...shadows.shadowMedium,
	},

	alertBlurview: {
		position: 'absolute',

		top: 0,
		left: 0,
		right: 0,
		bottom: 0,

		zIndex: 10,
		overflow: 'hidden',

		borderRadius: 16,
	},

	alertBox: {
		flexDirection: 'row',
		alignItems: 'center',

		paddingHorizontal: 8,
		paddingVertical: Platform.OS === 'ios' ? 8 : 4,

		zIndex: 20
	},

	alertBody: {
		flex: 1,
		marginLeft: 12,

		marginRight: 8,
	},

	alertTitle: {
		color: colors.Black,
		...fontSizes.heading_medium,

		lineHeight: 20,
		marginVertical: 4,
	},

	alertText: {
		color: colors.Black80,
		...fontSizes.body,

		lineHeight: 18,
	},
});

export { Alert, AlertBoxContext, AlertBoxWrapper }