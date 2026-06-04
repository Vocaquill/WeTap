import { useState } from 'react';
import {useSearchGenresQuery} from "../../services/api/apiGenres.ts";
import type { IGenreItemResponse as IGenreItem } from '../../types/Genre/IGenreItemResponse';
import { InputField } from '../form/InputField';
import { Button } from '../form/Button';

interface Props {
    value?: number;
    onChange: (genreId?: number) => void;
}

export function GenreSelect({ value, onChange }: Props) {
    const { data } = useSearchGenresQuery({ page: 1, itemPerPage: 100 });
    const [search, setSearch] = useState('');

    const genres =
        data?.items.filter((g: IGenreItem) =>
            g.name.toLowerCase().includes(search.toLowerCase())
        ) ?? [];

    const selectedGenre = data?.items.find(g => g.id === value);

    return (
        <div className="relative">
            <InputField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={selectedGenre?.name ?? 'Жанр'}
                inputClassName="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-red-600 outline-none text-white"
            />

            {search && (
                <div className="absolute z-10 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl max-h-60 overflow-auto">
                    {genres.map((genre : IGenreItem) => (
                        <Button
                            key={genre.id}
                            variant="menuItem"
                            onClick={() => {
                                onChange(genre.id);
                                setSearch('');
                            }}
                        >
                            {genre.name}
                        </Button>
                    ))}

                    {genres.length === 0 && (
                        <div className="px-4 py-2 text-zinc-500">
                            Нічого не знайдено
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
