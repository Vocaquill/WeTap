import type {IBaseSearch} from "./aditional.ts";

// export interface GenreMovieAdmin {
//   id: number;
//   name: string;
//   slug: string;
//   image?: string;
//   movieCount?: number;
//   dateCreate?: string;
//   isDelete?: boolean;
// }
//
// export interface GenresState {
//   items: GenreMovieAdmin[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

export interface IGenreItem {
  id: number;
  slug: string;
  image?: string;
  name: string;
}

export interface IGenreSearch extends IBaseSearch {
  id?: number;
  slug?: string;
  name?: string;
}

export interface IGenreGetBySlug {
  slug: string;
}

export interface IGenreCreate {
  name: string;
  slug: string;
  image?: File;
}

export interface IGenreEdit {
  id: number;
  name: string;
  slug: string;
  image?: File;
}

export interface IGenreDelete {
  id: number;
}