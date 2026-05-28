import React from 'react';

export interface IFilterField<T> {
    key: keyof T;
    placeholder?: string;
    icon?: React.ReactNode;
    type?: string;
    inputClassName?: string;
    wrapperClassName?: string;
}
