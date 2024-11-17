import { useMemo } from "react";

const findLatestStatus = (order) => {
    // console.log(order)
    if (!order || !order.orderbl || !order.orderbl.bs) {
        return { currentstatus: null, currentstatusdate: null };
    }

    const baselineStatuses = order.orderbl.bs;

    {/*TODO: Filter out statuses that have `currentstatusdate` as `null`*/ }
    const filteredStatuses = baselineStatuses.filter(
        (status) => status.currentstatusdate !== null
    );

    {/* TODO: Find the status with the latest `currentstatusdate`*/ }
    const latestStatus = filteredStatuses.reduce((latest, status) => {
        if (!latest || status.publishtouser) {
            return status;
        }
        return latest;
    }, null);

    return {
        currentstatus: latestStatus?.genstatus || null,
        currentstatusdate: latestStatus?.currentstatusdate || null,
    };
};

const useLatestStatus = (order) => {
    return useMemo(() => findLatestStatus(order), [order]);
};

export default useLatestStatus;