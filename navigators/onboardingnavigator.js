import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingProfilePage from '../pages/onboardingpages/onboardingprofile';
import OnboardingAddressPage from '../pages/onboardingpages/onboardingaddress';
import OnboardingIndustriesPage from '../pages/onboardingpages/onboardingindustries';
import OnboardingBuyingPage from '../pages/onboardingpages/onboardingbuying';
import OnboardingSellingPage from '../pages/onboardingpages/onboardingselling';
import OnboardingTerritoresPage from '../pages/onboardingpages/onboardingterritores';
import OnboardingFinalPage from '../pages/onboardingpages/onboardingfinal';

const Stack = createNativeStackNavigator();

function OnboardingStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="OnboardingProfile" component={OnboardingProfilePage} options={{ animation: 'slide_from_right' }}/>
			<Stack.Screen name="OnboardingAddress" component={OnboardingAddressPage} options={{ animation: 'slide_from_right' }}/>
			<Stack.Screen name="OnboardingIndustries" component={OnboardingIndustriesPage} options={{ animation: 'slide_from_right' }}/>
			<Stack.Screen name="OnboardingBuying" component={OnboardingBuyingPage} options={{ animation: 'slide_from_right' }}/>
			<Stack.Screen name="OnboardingSelling" component={OnboardingSellingPage} options={{ animation: 'slide_from_right' }}/>
			<Stack.Screen name="OnboardingTerritories" component={OnboardingTerritoresPage} options={{ animation: 'slide_from_right' }}/>
			<Stack.Screen name="OnboardingFinal" component={OnboardingFinalPage} options={{ animation: 'slide_from_right' }}/>
		</Stack.Navigator>
	);
}

export default OnboardingStack;