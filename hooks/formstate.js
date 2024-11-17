import { useContext, useState } from 'react';
import Themis from '../utilities/themis';
import { Alert, AlertBoxContext } from '../components/alertbox';

function useFormState(initialValue, onChangeCallback = () => { }, onErrorCallback = () => { }) {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(null);

    const [validator, setValidator] = useState(null);

    const updateError = (error) => setError(error);
    const clearError = () => setError(null);

    const createAlert = useContext(AlertBoxContext);

    const onChangeValue = (value, silent = false) => {
        clearError();
        setValue(value);
        !silent && onChangeCallback(value);
    }

    const validate = () => {
        if (!validator) return true;
        const validationResponse = validator.validate(value);

        if (validationResponse.isValid) {
            clearError();
            return true;
        }

        setError(validationResponse.message);
        createAlert(Alert.Error(validationResponse.message, 'Input Error'));
        onErrorCallback(validationResponse.message);

        return false;
    }

    const attachValidator = (validator) => {
        if (Themis.isThemisValidator(validator)) {
            setValidator(validator);
            return;
        }

        throw new Error('Provided validator is not a ThemisValidator');
    }

    return { value, onChangeValue, error, updateError, clearError, validate, attachValidator };
}

export default useFormState;