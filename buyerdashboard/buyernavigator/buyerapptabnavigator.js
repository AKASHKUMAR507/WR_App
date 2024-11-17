import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Header from "../../components/header";
import { GetUserInfo } from "../../network/models/user";
import { Alert, AlertBoxContext } from "../../components/alertbox";
import { useContext, useEffect } from "react";
import { useUserStore } from "../../stores/stores";
import SummaryPage from "../buyerpages/bottomnavpages/summary";
import DealsPage from "../buyerpages/bottomnavpages/deals";
import BrowsePage from "../buyerpages/bottomnavpages/browse";
import BuyerBottomBar from "../bottombar";
import ProductsPage from "../buyerpages/bottomnavpages/products";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function BuyerAppTabNavigator() {
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
        <Stack.Navigator screenOptions={{ header: (props) => <Header {...props} /> }}>
            <Stack.Screen name="Summary" component={SummaryPage} options={{ title: 'Home', userIconShown: true }} />
        </Stack.Navigator>
    );
}

export default BuyerAppTabNavigator;