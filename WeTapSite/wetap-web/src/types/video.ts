export interface IVideoCreateModel {
    title: string;
    slug: string;
    description: string;
    genreIds?: number[];
    tagIds?: number[];
    image?: File;
    video?: File;
}

export interface IVideoProcessingResult {
    trackingId: string;
}

export interface IVideoProgressUpdate {
    percentage: number;
    estimatedTimeRemaining: string;
    status: string;
}
