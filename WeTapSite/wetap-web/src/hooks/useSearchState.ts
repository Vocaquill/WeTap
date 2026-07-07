import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type {IBaseSearch} from "../types/Additional/IBaseSearch.ts";

const VALID_PER_PAGE = [5, 10, 20, 50] as const;
const MIN_PAGE = 1;
const MAX_STRING_LENGTH = 200;

const ALWAYS_EXCLUDED_FROM_URL = ['channelId'] as const;

interface UseSearchStateOptions<T> {
    excludeFromUrl?: (keyof T)[];
}

interface UseSearchStateReturn<T extends IBaseSearch> {
    searchParams: T;
    setSearchParams: React.Dispatch<React.SetStateAction<T>>;
    handleSearchChange: <K extends keyof T>(key: K, value: T[K]) => void;
    resetFilters: () => void;
    clampPage: (totalPages: number) => void;
}

function sanitizeString(value: string): string {
    return value
        .trim()
        .slice(0, MAX_STRING_LENGTH)
        .replace(/[<>"'`\\]/g, '');
}

function isValidPage(value: unknown): value is number {
    const n = Number(value);
    return Number.isInteger(n) && n >= MIN_PAGE;
}

function isValidPerPage(value: unknown): value is number {
    const n = Number(value);
    return (VALID_PER_PAGE as readonly number[]).includes(n);
}

function parseAndValidate<T extends IBaseSearch>(
    urlSearch: string,
    defaults: T,
    excludedKeys: Set<string>,
): { params: T; needsReplace: boolean } {
    const sp = new URLSearchParams(urlSearch);

    const result: T = { ...defaults };
    let needsReplace = false;

    if (sp.has('page')) {
        const raw = sp.get('page')!;
        const n = Number(raw);
        if (isValidPage(n)) {
            result.page = n;
        } else {
            result.page = defaults.page;
            needsReplace = true;
        }
    }

    if (sp.has('itemPerPage')) {
        const raw = sp.get('itemPerPage')!;
        const n = Number(raw);
        if (isValidPerPage(n)) {
            result.itemPerPage = n;
        } else {
            result.itemPerPage = defaults.itemPerPage;
            needsReplace = true;
        }
    }

    for (const key of Object.keys(defaults) as (keyof T)[]) {
        if (key === 'page' || key === 'itemPerPage') continue;
        if (excludedKeys.has(key as string)) continue;
        if (!sp.has(key as string)) continue;

        const defaultValue = defaults[key];
        const raw = sp.get(key as string)!;

        if (typeof defaultValue === 'string' || defaultValue === '') {
            result[key] = sanitizeString(raw) as T[keyof T];
        } else if (typeof defaultValue === 'number' || defaultValue === undefined) {
            const n = Number(raw);
            if (!isNaN(n) && n >= 0) {
                result[key] = n as T[keyof T];
            } else if (raw === '' || raw === 'undefined') {
                result[key] = defaults[key];
            } else {
                result[key] = (sanitizeString(raw) || defaults[key]) as T[keyof T];
            }
        } else if (defaultValue === undefined || defaultValue === null) {
            result[key] = (sanitizeString(raw) || undefined) as T[keyof T];
        }
    }

    return { params: result, needsReplace };
}

function buildUrlSearch<T extends IBaseSearch>(
    params: T,
    excludedKeys: Set<string>,
    defaultItemPerPage: number,
): string {
    const sp = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (excludedKeys.has(key)) continue;
        if (value === undefined || value === null || value === '') continue;
        if (key === 'page' && value === 1) continue;
        if (key === 'itemPerPage' && value === defaultItemPerPage) continue;
        if (Array.isArray(value)) continue;
        sp.set(key, String(value));
    }

    const str = sp.toString();
    return str ? `?${str}` : '';
}

export function useSearchState<T extends IBaseSearch>(
    defaultParams: T,
    options: UseSearchStateOptions<T> = {},
): UseSearchStateReturn<T> {
    const navigate = useNavigate();
    const location = useLocation();

    const defaultItemPerPage = defaultParams.itemPerPage;

    const excludedKeysSet = new Set([
        ...(ALWAYS_EXCLUDED_FROM_URL as readonly string[]),
        ...((options.excludeFromUrl ?? []) as string[]),
    ]);

    const excludedKeysRef = useRef(excludedKeysSet);

    const [searchParams, setSearchParams] = useState<T>(() => {
        const { params, needsReplace } = parseAndValidate(
            location.search,
            defaultParams,
            excludedKeysSet,
        );

        if (needsReplace) {
            setTimeout(() => {
                navigate(
                    { search: buildUrlSearch(params, excludedKeysSet, defaultItemPerPage) },
                    { replace: true },
                );
            }, 0);
        }

        return params;
    });

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const newSearch = buildUrlSearch(searchParams, excludedKeysRef.current, defaultItemPerPage);
        if (newSearch !== location.search) {
            navigate({ search: newSearch }, { replace: true });
        }
    }, [searchParams]);

    const handleSearchChange = useCallback(
        <K extends keyof T>(key: K, value: T[K]) => {
            setSearchParams((prev) => ({ ...prev, [key]: value, page: 1 }));
        },
        [],
    );

    const resetFilters = useCallback(() => {
        setSearchParams((prev) => ({
            ...defaultParams,
            itemPerPage: prev.itemPerPage,
            ...Object.fromEntries(
                [...excludedKeysRef.current].map((k) => [k, prev[k as keyof T]]),
            ),
        }));
    }, [defaultParams]);

    const clampPage = useCallback((totalPages: number) => {
        if (totalPages > 0) {
            setSearchParams((prev) => {
                if (prev.page > totalPages) {
                    return { ...prev, page: totalPages };
                }
                return prev;
            });
        }
    }, []);

    return { searchParams, setSearchParams, handleSearchChange, resetFilters, clampPage };
}
