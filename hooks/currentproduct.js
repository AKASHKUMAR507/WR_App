const { useCurrentProductStore } = require("../stores/stores");

function useCurrentProduct() {
    const currentProduct = useCurrentProductStore(state => state.currentBuyerProduct);
    const _setCurrentProduct = useCurrentProductStore(state => state.setCurrentBuyerProduct);
    const _clearCurrentProduct = useCurrentProductStore(state => state.clearCurrentBuyerProduct);

    const setCurrentProduct = (product) => {
        _setCurrentProduct(product);
    }

    const clearCurrentProduct = () => {
        _clearCurrentProduct();
    }

    return [currentProduct, setCurrentProduct, clearCurrentProduct];
}

export default useCurrentProduct;