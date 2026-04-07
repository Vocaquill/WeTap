import type {IGenreItem} from "./genre.ts";
import type {IBaseSearch} from "./aditional.ts";

export interface IMovieCommentCreate {
    movieId: number;
    text: string;
}

export interface IMovieCommentItem {
    id: number;
    userId: number;
    userName: string;
    text: string;
    createdAt: string;
}

export interface IMovieCreate {
    title: string;
    slug: string;
    description?: string;
    genreIds?: number[];
    releaseDate: string;
    imdbRating?: string;
    image?: File;
    video?: File;
    trailerUrl?: string;
}

export interface IMovieDelete {
    id: number;
}

export interface IMovieEdit {
    id: number;
    title: string;
    slug: string;
    description?: string;
    genreIds?: number[];
    releaseDate: string;
    imdbRating?: string;
    image?: File;
    video?: File;
    trailerUrl?: string;
}

export interface IMovieGetBySlug {
    slug: string;
}

export interface IMovieItem {
    id: number;
    title: string;
    slug: string;
    description?: string;
    releaseDate: string;
    imdbRating?: string;
    image?: string;
    video?: string;
    trailerUrl?: string;
    genres: IGenreItem[];
    likesCount: number;
    dislikesCount: number;
    comments: IMovieCommentItem[];
}

export interface IMovieReaction {
    movieId: number;
    isLike: boolean;
}

export interface IMovieSearch extends IBaseSearch {
    title?: string;
    genreId?: number;
    releaseYearFrom?: string;
    releaseYearTo?: string;
    imdbRatingFrom?: string;
}
