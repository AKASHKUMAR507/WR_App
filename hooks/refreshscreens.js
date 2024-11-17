import { useState, useEffect } from 'react';
import { getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native';
import { useRefreshScreensStore } from '../stores/stores';

function useRefreshScreens() {
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const refreshScreen = useRefreshScreensStore(state => state.refreshScreen);
    const scheduleRefresh = useRefreshScreensStore(state => state.scheduleRefresh);
    const refreshScreens = useRefreshScreensStore(state => state.refreshScreens);

    const route = useRoute();

    const scheduleRefreshScreen = (screen) => {
        scheduleRefresh(screen);
    }

    useEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route) || route.name;

        if (refreshScreens.includes(routeName)) { setShouldRefresh(true); refreshScreen(routeName) }
        else { setShouldRefresh(false) }
    }, [route, refreshScreens, refreshScreen]);

    return { shouldRefresh, scheduleRefreshScreen };
}

export default useRefreshScreens;