import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateMovieMutation } from '../../services/api/apiMovies';
import { useSearchGenresQuery } from '../../services/api/apiGenres';
import type { IMovieCreate } from '../../types/movie';
import type { IGenreItem } from '../../types/genre';

import { InputField } from '../../components/form/InputField';
import { TextAreaField } from '../../components/form/TextAreaField';
import { FileUploadField } from '../../components/form/FileUploadField';
import { PrimaryButton } from '../../components/form/PrimaryButton';
import {useFormServerErrors} from "../../utils/useFormServerErrors.ts";
import LoadingOverlay from "../../components/LoadingOverlay.tsx";

import { slugify } from '../../utils/slugify';

export default function CreateMoviePage() {
    const navigate = useNavigate();
    const [createMovie, {isLoading}] = useCreateMovieMutation();
    const { data: genresData } = useSearchGenresQuery({ page: 1, itemPerPage: 100 });

    const {
        errors,
        setServerErrors,
        clearError,
        clearAllErrors,
    } = useFormServerErrors();

    const [form, setForm] = useState<IMovieCreate>({
        title: '',
        slug: '',
        description: '',
        releaseDate: '',
        imdbRating: '',
        trailerUrl: '',
        image: undefined,
        video: undefined,
        genreIds: [],
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setForm(prev => {
            const nextState = { ...prev, [name]: value };

            if (name === 'title') {
                nextState.slug = slugify(value);
            }

            return nextState;
        });

        clearError(name);
        if (name === 'title') clearError('slug');
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;

        setForm(prev => ({ ...prev, [name]: files?.[0] }));
        clearError(name);
    };

    const handleGenreToggle = (id: number) => {
        setForm(prev => {
            const current = prev.genreIds || [];
            return {
                ...prev,
                genreIds: current.includes(id)
                    ? current.filter(g => g !== id)
                    : [...current, id],
            };
        });

        clearError('genreIds');
    };

    const validateClient = () => {
        const validationErrors: Record<string, string[]> = {};

        if (!form.title.trim()) validationErrors.title = ['Назва обовʼязкова'];
        if (!form.slug.trim()) validationErrors.slug = ['Slug обовʼязковий'];
        if (!form.releaseDate) validationErrors.releaseDate = ['Дата релізу обовʼязкова'];
        if (!form.genreIds?.length) validationErrors.genreIds = ['Оберіть хоча б один жанр'];

        if (Object.keys(validationErrors).length) {
            setServerErrors(validationErrors);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearAllErrors();

        if (!validateClient()) return;

        try {
            await createMovie(form).unwrap();
            navigate('/admin/movies');
        }
        catch (err: any) {
            if (err?.data?.errors) {
                setServerErrors(err.data.errors);
            }
        }
    };

    return (
        <>
            {isLoading && <LoadingOverlay />}

            <div className="p-6 bg-zinc-950 min-h-screen">
                <h1 className="text-3xl font-black text-white mb-8">Створити фільм</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-4">
                        <InputField
                            label="Назва"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            error={errors.title}
                        />

                        <InputField
                            label="Slug"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            required
                            error={errors.slug}
                        />

                        <TextAreaField
                            label="Опис"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            error={errors.description}
                        />

                        <InputField
                            label="Дата релізу"
                            name="releaseDate"
                            type="date"
                            value={form.releaseDate}
                            onChange={handleChange}
                            required
                            error={errors.releaseDate}
                        />

                        <InputField
                            label="IMDB"
                            name="imdbRating"
                            value={form.imdbRating}
                            onChange={handleChange}
                            error={errors.imdbRating}
                        />
                    </div>

                    <div className="space-y-4">
                        <InputField
                            label="Trailer URL"
                            name="trailerUrl"
                            value={form.trailerUrl}
                            onChange={handleChange}
                            error={errors.trailerUrl}
                        />

                        <div>
                            <label className="text-zinc-400 mb-1 font-semibold block">
                                Жанри
                            </label>

                            <div className="flex flex-wrap gap-2">
                                {genresData?.items.map((genre: IGenreItem) => (
                                    <button
                                        key={genre.id}
                                        type="button"
                                        onClick={() => handleGenreToggle(genre.id)}
                                        className={`px-3 py-1 rounded-xl border transition ${
                                            form.genreIds?.includes(genre.id)
                                                ? 'bg-red-600 border-red-600 text-white'
                                                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                                        }`}
                                    >
                                        {genre.name}
                                    </button>
                                ))}
                            </div>

                            {errors.genreIds && (
                                <span className="text-red-500 text-sm mt-1 block">
                                {errors.genreIds[0]}
                            </span>
                            )}
                        </div>

                        <FileUploadField
                            label="Зображення"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            error={errors.image}
                        />

                        <FileUploadField
                            label="Відео"
                            name="video"
                            accept="video/*"
                            onChange={handleFileChange}
                            error={errors.video}
                        />
                    </div>

                    <div className="col-span-2 flex justify-end mt-4">
                        <PrimaryButton type="submit">
                            Створити
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </>
    );
}
