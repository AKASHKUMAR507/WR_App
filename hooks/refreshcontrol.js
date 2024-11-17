import { useState, useCallback } from 'react';

const useRefreshControl = (callback) => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        callback().then(() => {
            setRefreshing(false);
        }).catch((error) => {
            throw error;
        });
    }, [callback]);

    return { refreshing, onRefresh };
};

export default useRefreshControl;