import { isValidElement, cloneElement } from 'react';

function FormInputWrapper({ formState, component, valueOverride = null, onChangeValueOverride = null }) {
    const componentWithFormState = 
    (isValidElement(component)) ? 
        cloneElement(component, { 
            value: valueOverride || formState.value, 
            error: formState.error, 
            onChange: onChangeValueOverride ? (value) => formState.onChangeValue(onChangeValueOverride(value)) : formState.onChangeValue, 
            onFocused: formState.clearError,
        }) : 
    component;

    return componentWithFormState;
}

export default FormInputWrapper;