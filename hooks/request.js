import { useState, useEffect } from 'react';

const RequestStatus = {
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    RESOLVED: 'RESOLVED',
    CANCELLED: 'CANCELLED',
}

const TriggerTypes = {
    ON_MOUNT: 'ON_MOUNT',
    ON_TRIGGER: 'ON_TRIGGER',
}

const useRequest = (requestFunction, trigger = TriggerTypes.ON_MOUNT) => {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState(RequestStatus.IDLE);
    const [error, setError] = useState(null);

    let abortController = new AbortController();

    const run = async (successCallback = () => { }) => {
        abortController = new AbortController();

        try {
            setStatus(RequestStatus.LOADING);
            const { data } = await requestFunction(abortController);
            setData(data);
            setStatus(RequestStatus.RESOLVED);
            successCallback(data);
        } catch (error) {
            setError(error);
            setStatus(RequestStatus.RESOLVED);
        }
    }

    useEffect(() => {
        if (trigger === TriggerTypes.ON_MOUNT && status === RequestStatus.IDLE) run();

        return () => {
            setStatus(RequestStatus.CANCELLED);
            // abortController.abort();
        }
    }, []);

    return { data, status, error, run };
}

export default useRequest;
export { RequestStatus, TriggerTypes };