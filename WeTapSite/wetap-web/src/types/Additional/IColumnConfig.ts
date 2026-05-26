import React from 'react';

export interface IColumnConfig<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    sortKey?: string;
    headerClassName?: string;
    className?: string;
    render?: (item: T) => React.ReactNode;
}
