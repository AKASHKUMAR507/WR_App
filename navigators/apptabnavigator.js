import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SummaryPage from "../pages/bottomnavpages/summary";
import DealsPage from "../pages/bottomnavpages/deals";
import BrowsePage from "../pages/bottomnavpages/browse";
import EarningsPage from "../pages/bottomnavpages/earnings";
import NetworkPage from "../pages/bottomnavpages/network";
import Header from "../components/header";
import BottomBar from "../components/bottombar";
import { GetUserInfo } from "../network/models/user";
import { Alert, AlertBoxContext } from "../components/alertbox";
import { useContext, useEffect } from "react";
import { useUserStore } from "../stores/stores";
import colors from "../styles/colors";

const Tab = createBottomTabNavigator();

function AppTabNavigator() {
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchUserInformation();
    }, []);

    const fetchUserInformation = async () => {
        try {
            const user = await GetUserInfo();
            setUser(user);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <Tab.Navigator tabBar={(props) => <BottomBar {...props} />} screenOptions={{ header: (props) => <Header {...props} /> }}>
            <Tab.Screen name="Summary" component={SummaryPage} options={{ userIconShown: false }} />
            <Tab.Screen name="MyDeals" component={DealsPage} options={{ title: 'My Deals', userIconShown: true }} />
            <Tab.Screen name="Browse" component={BrowsePage} options={{ userIconShown: true }} />
            {/* <Tab.Screen name="Earnings" component={EarningsPage} options={{ userIconShown: true }} /> */}
            <Tab.Screen name="Network" component={NetworkPage} options={{ userIconShown: true }} />
        </Tab.Navigator>
    );
}

export default AppTabNavigator;