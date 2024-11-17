import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Alert, AlertBoxContext } from './alertbox';
import { useNotificationsDataStore, usePredefinedTagsDataStore, useUserTagsDataStore } from '../stores/datastores';

function HydrateStores({ children }) {
    const createAlert = useContext(AlertBoxContext);

    const loadPredefinedTags = usePredefinedTagsDataStore(state => state.loadPredefinedTags);
    const loadUserTags = useUserTagsDataStore(state => state.loadUserTags);
    const loadNotifications = useNotificationsDataStore(state => state.loadNotifications);

    useEffect(() => {
        hydrateStores(loadPredefinedTags);
        hydrateStores(loadUserTags);
        hydrateStores(loadNotifications);
    }, []);

    const hydrateStores = async (loaderFunction) => {
        try {
            await loaderFunction();
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}

export default HydrateStores;