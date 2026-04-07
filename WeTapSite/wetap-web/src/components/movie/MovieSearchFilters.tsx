import {GenreSelect} from "./GenreSelect.tsx";
import { ImdbSlider } from "./ImdbSlider.tsx";
import { YearRange } from "./YearRange.tsx";
import type {IMovieSearch} from "../../types/movie.ts";

interface Props {
    searchParams: IMovieSearch;
    onChange: <K extends keyof IMovieSearch>(
        key: K,
        value: IMovieSearch[K]
    ) => void;
}

export function MovieSearchFilters({ searchParams, onChange }: Props) {
    return (
        <section className="px-6 md:px-12 max-w-5xl mx-auto mb-12 space-y-6">

            <input
                value={searchParams.title ?? ''}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="Назва фільму"
                className="w-full px-6 py-4 rounded-xl bg-zinc-900 border border-zinc-800
                   focus:border-red-600 outline-none text-white"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <GenreSelect
                    value={searchParams.genreId}
                    onChange={(id) => onChange('genreId', id)}
                />

                <YearRange
                    from={searchParams.releaseYearFrom}
                    to={searchParams.releaseYearTo}
                    onChange={(from, to) => {
                        onChange('releaseYearFrom', from);
                        onChange('releaseYearTo', to);
                    }}
                />

                <ImdbSlider
                    value={searchParams.imdbRatingFrom}
                    onChange={(v) => onChange('imdbRatingFrom', v)}
                />
            </div>
        </section>
    );
}
