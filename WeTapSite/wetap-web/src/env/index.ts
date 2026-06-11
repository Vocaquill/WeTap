export const GOOGLE_AUTH_KEY = import.meta.env.VITE_GOOGLE_AUTH;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, "");
export const SIGNALR_HUB_URL = `${API_ROOT_URL}/videoProgressHub`;
export const APP_IMAGE_URL = API_BASE_URL + import.meta.env.VITE_APP_IMAGE_URL;

const IMAGES_50_URL = APP_IMAGE_URL + '/50_';
const IMAGES_100_URL = APP_IMAGE_URL + '/100_';
const IMAGES_200_URL = APP_IMAGE_URL + '/200_';
const IMAGES_400_URL = APP_IMAGE_URL + '/400_';
const IMAGES_800_URL = APP_IMAGE_URL + '/800_';
const IMAGES_1200_URL = APP_IMAGE_URL + '/1200_';

const VIDEO_1080_URL = API_BASE_URL + '/videos/1080_';
const VIDEO_720_URL = API_BASE_URL + '/videos/720_';
const VIDEO_480_URL = API_BASE_URL + '/videos/480_';
const VIDEO_360_URL = API_BASE_URL + '/videos/360_';

export const VIDEO_QUALITIES = ['1080', '720', '480', '360'] as const;
export type VideoQuality = typeof VIDEO_QUALITIES[number];

export const GENRE_SORT_FIELDS = ['name', 'slug'] as const;
export type GenreSortField = typeof GENRE_SORT_FIELDS[number];

export const USER_SORT_FIELDS = ['email', 'firstName', 'lastName'] as const;
export type UserSortField = typeof USER_SORT_FIELDS[number];

const APP_ENV = {
    API_BASE_URL,
    SIGNALR_HUB_URL,
    IMAGES_50_URL,
    IMAGES_100_URL,
    IMAGES_200_URL,
    IMAGES_400_URL,
    IMAGES_800_URL,
    IMAGES_1200_URL,
    VIDEO_1080_URL,
    VIDEO_720_URL,
    VIDEO_480_URL,
    VIDEO_360_URL
}

export {APP_ENV};