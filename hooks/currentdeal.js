import { useCurrentDealStore } from '../stores/stores';

function useCurrentDeal() {
    const currentDeal = useCurrentDealStore(state => state.currentDeal);
    const _setCurrentDeal = useCurrentDealStore(state => state.setCurrentDeal);
    const _clearCurrentDeal = useCurrentDealStore(state => state.clearCurrentDeal);

    const setCurrentDeal = (deal) => {
        _setCurrentDeal(deal);
    }

    const clearCurrentDeal = () => {
        _clearCurrentDeal();
    }

    return [currentDeal, setCurrentDeal, clearCurrentDeal];
}

export default useCurrentDeal;