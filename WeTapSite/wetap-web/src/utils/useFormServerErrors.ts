import { useState } from 'react';
import type { IServerValidationErrors } from '../types/aditional';

export const useFormServerErrors = () => {
    const [errors, setErrors] = useState<IServerValidationErrors>({});

    const setServerErrors = (serverErrors: IServerValidationErrors) => {
        setErrors(serverErrors);
    };

    const clearError = (field: string) => {
        setErrors(prev => {
            const copy = { ...prev };
            delete copy[field];
            return copy;
        });
    };

    const clearAllErrors = () => {
        setErrors({});
    };

    return {
        errors,
        setServerErrors,
        clearError,
        clearAllErrors,
    };
};
