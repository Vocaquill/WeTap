import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBySlugQuery, useEditMovieMutation } from '../../services/api/apiMovies.ts';
import { useSearchGenresQuery } from '../../services/api/apiGenres.ts';
import type { IMovieEdit } from '../../types/movie.ts';
import type { IGenreItem } from '../../types/genre.ts';

import { InputField } from '../../components/form/InputField.tsx';
import { TextAreaField } from '../../components/form/TextAreaField.tsx';
import { FileUploadField } from '../../components/form/FileUploadField.tsx';
import { PrimaryButton } from '../../components/form/PrimaryButton.tsx';
import { MoviePlayer } from '../../components/movie/MoviePlayer.tsx';
import { APP_ENV } from '../../env/index.ts';
import { useFormServerErrors } from '../../utils/useFormServerErrors.ts';
import LoadingOverlay from "../../components/LoadingOverlay.tsx";

function EditMoviePage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const { data: movie, isLoading } = useGetBySlugQuery({ slug: slug! });
    const [editMovie] = useEditMovieMutation();
    const { data: genresData } = useSearchGenresQuery({ page: 1, itemPerPage: 100 });

    const {
        errors,
        setServerErrors,
        clearError,
        clearAllErrors,
    } = useFormServerErrors();

    const [form, setForm] = useState<IMovieEdit | null>(null);

    if (!movie) {
        return <div className="text-center text-white py-20">Фільм не знайдено</div>;
    }

    if (!form) {
        setForm({
            id: movie.id,
            title: movie.title,
            slug: movie.slug,
            description: movie.description || '',
            releaseDate: movie.releaseDate
                ? new Date(movie.releaseDate).toISOString().slice(0, 10)
                : '',
            imdbRating: movie.imdbRating || '',
            trailerUrl: movie.trailerUrl || '',
            image: undefined,
            video: undefined,
            genreIds: movie.genres?.map(g => g.id) || [],
        });

        return <div className="text-center text-white py-20">Завантаження форми...</div>;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setForm(prev => prev ? { ...prev, [name]: value } : prev);
        clearError(name);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;

        setForm(prev => prev ? { ...prev, [name]: files?.[0] } : prev);
        clearError(name);
    };

    const handleGenreToggle = (id: number) => {
        setForm(prev => {
            if (!prev) return prev;

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
            await editMovie(form).unwrap();
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
                <h1 className="text-3xl font-black text-white mb-8">
                    Редагувати фільм
                </h1>

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

                        <div className="space-y-2">
                            <FileUploadField
                                label="Зображення"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                error={errors.image}
                            />

                            {form.image ? (
                                <img
                                    src={
                                        typeof form.image === 'string'
                                            ? `${APP_ENV.IMAGES_1200_URL}${form.image}`
                                            : URL.createObjectURL(form.image)
                                    }
                                    className="w-full h-40 object-cover rounded-xl border border-zinc-800"
                                />
                            ) : movie.image ? (
                                <img
                                    src={`${APP_ENV.IMAGES_1200_URL}${movie.image}`}
                                    className="w-full h-40 object-cover rounded-xl border border-zinc-800"
                                />
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <FileUploadField
                                label="Відео"
                                name="video"
                                accept="video/*"
                                onChange={handleFileChange}
                                error={errors.video}
                            />

                            {form.video ? (
                                <MoviePlayer
                                    src={
                                        typeof form.video === 'string'
                                            ? form.video
                                            : URL.createObjectURL(form.video)
                                    }
                                />
                            ) : movie.video ? (
                                <MoviePlayer src={`${APP_ENV.VIDEO_URL}${movie.video}`} />
                            ) : null}
                        </div>
                    </div>

                    <div className="col-span-2 flex justify-end mt-6">
                        <PrimaryButton type="submit">
                            Зберегти
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditMoviePage;
