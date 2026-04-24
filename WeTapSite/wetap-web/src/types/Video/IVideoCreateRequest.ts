export interface IVideoCreateRequest {
    title: string;
    slug: string;
    description: string;
    genreIds?: number[];
    tagIds?: number[];
    image?: File;
    video?: File;
    languageId: number;
    privacyId: number;
}
