import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../pages/authpages/login';
import SignupPage from '../pages/authpages/signup';
import EmailVerificationPage from '../pages/authpages/emailverification';
import ForgotPasswordPage from '../pages/authpages/forgotpassword';
import ResetPasswordPage from '../pages/authpages/resetpassword';
import { useUserStore } from '../stores/stores';
import { useEffect } from 'react';
import Welcome from '../pages/welcome';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
	const setUserOnboarded = useUserStore(state => state.setUserOnboarded);

	useEffect(() => {
		setUserOnboarded(false);
	}, []);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false, animation: 'slide_from_right' }}/>
			<Stack.Screen name="Signup" component={SignupPage} options={{ headerShown: false, animation: 'slide_from_right' }}/>
			<Stack.Screen name="EmailVerification" component={EmailVerificationPage} options={{ headerShown: false, animation: 'slide_from_right' }}/>
			<Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} options={{ headerShown: false, animation: 'slide_from_right' }}/>
			<Stack.Screen name="ResetPassword" component={ResetPasswordPage} options={{ headerShown: false, animation: 'slide_from_right' }}/>
		</Stack.Navigator>
    )
}

export default AuthNavigator;