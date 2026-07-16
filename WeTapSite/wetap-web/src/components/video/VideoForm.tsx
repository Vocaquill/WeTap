import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useGetPrivaciesQuery } from '../../services/api/apiVideos';
import { useSearchGenresQuery } from '../../services/api/apiGenres';
import { useCreateTagMutation, useSearchTagsQuery } from '../../services/api/apiTags';
import { useSearchLanguagesQuery } from '../../services/api/apiLanguages';
import type { IVideoCreateRequest } from '../../types/Video/IVideoCreateRequest';
import type { IGenreItemResponse } from '../../types/Genre/IGenreItemResponse';
import type { ITagItemResponse } from '../../types/Tag/ITagItemResponse';

import { InputField } from '../form/InputField';
import { TextAreaField } from '../form/TextAreaField';
import { FileUploadField } from '../form/FileUploadField';
import { Button } from '../form/Button';
import { SelectField } from '../form/SelectField';
import { useFormServerErrors } from "../../hooks/useFormServerErrors";
import LoadingOverlay from "../ui/loading/LoadingOverlay";
import { MoviePlayer } from '../movie/MoviePlayer';
import { APP_ENV } from '../../env';

import { slugify } from '../../utils/slugify';

export interface VideoFormProps {
    title: string;
    submitButtonText: string;
    onSubmit: (form: IVideoCreateRequest) => Promise<void>;
    isLoading: boolean;
    initialData?: Partial<IVideoCreateRequest>;
    initialTags?: ITagItemResponse[];
    requireVideoFile?: boolean;
    initialImageUrl?: string;
    initialVideoUrl?: string;
}

export function VideoForm({
    title,
    submitButtonText,
    onSubmit,
    isLoading,
    initialData,
    initialTags,
    requireVideoFile = true,
    initialImageUrl,
    initialVideoUrl,
}: VideoFormProps) {
    const [createTag, { isLoading: isLoadingTag }] = useCreateTagMutation();
    const { data: genresData } = useSearchGenresQuery({ page: 1, itemPerPage: 100 });
    const [tagInput, setTagInput] = useState('');
    const { data: tagsData } = useSearchTagsQuery({
        page: 1,
        itemPerPage: 10,
        name: tagInput.trim() || undefined,
    });
    const { data: languagesData } = useSearchLanguagesQuery({ page: 1, itemPerPage: 100 });
    const { data: privaciesData } = useGetPrivaciesQuery();

    const {
        errors,
        setServerErrors,
        clearError,
        clearAllErrors,
    } = useFormServerErrors();

    const [form, setForm] = useState<IVideoCreateRequest>(() => ({
        title: initialData?.title ?? '',
        slug: initialData?.slug ?? '',
        description: initialData?.description ?? '',
        genreIds: initialData?.genreIds ?? [],
        tagIds: initialData?.tagIds ?? [],
        image: initialData?.image ?? undefined,
        video: initialData?.video ?? undefined,
        languageId: initialData?.languageId ?? 1,
        privacyId: initialData?.privacyId ?? 1,
    }));

    const [extraTags, setExtraTags] = useState<ITagItemResponse[]>(() => initialTags ?? []);
    const [tagError, setTagError] = useState<string | null>(null);
    // const [imagePreview, setImagePreview] = useState<string>('');
    const imagePreview =
        form.image instanceof File
            ? URL.createObjectURL(form.image)
            : initialImageUrl
                ? `${APP_ENV.IMAGES_400_URL}${initialImageUrl}`
                : "";
    // const [videoPreview, setVideoPreview] = useState<string>('');

    const videoPreview =
        form.video instanceof File
            ? URL.createObjectURL(form.video)
            : "";


    // Generate previews when files change
    // useEffect(() => {
    //     if (form.image instanceof File) {
    //         const objectUrl = URL.createObjectURL(form.image);
    //         setImagePreview(objectUrl);
    //         return () => URL.revokeObjectURL(objectUrl);
    //     } else if (initialImageUrl) {
    //         setImagePreview(`${APP_ENV.IMAGES_400_URL}${initialImageUrl}`);
    //     } else {
    //         setImagePreview('');
    //     }
    // }, [form.image, initialImageUrl]);



    // useEffect(() => {
    //     if (form.video instanceof File) {
    //         const objectUrl = URL.createObjectURL(form.video);
    //         setVideoPreview(objectUrl);
    //         return () => URL.revokeObjectURL(objectUrl);
    //     } else {
    //         setVideoPreview('');
    //     }
    // }, [form.video]);

    const knownTags = useMemo(() => {
        const map = new Map(extraTags.map(tag => [tag.id, tag]));
        tagsData?.items?.forEach(tag => map.set(tag.id, tag));
        return Array.from(map.values());
    }, [extraTags, tagsData?.items]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setForm(prev => {
            const nextState = { ...prev, [name]: value };

            if (name === 'title' && (requireVideoFile || !prev.slug)) {
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

    const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
        if (tagError) setTagError(null);
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

    const handleTagToggle = (id: number) => {
        const tagFromSearch = tagsData?.items?.find(tag => tag.id === id);
        const isSelected = form.tagIds?.includes(id);

        setForm(prev => {
            const current = prev.tagIds || [];
            return {
                ...prev,
                tagIds: isSelected
                    ? current.filter(g => g !== id)
                    : [...current, id],
            };
        });

        if (!isSelected && tagFromSearch) {
            setExtraTags(prev =>
                prev.some(tag => tag.id === id) ? prev : [...prev, tagFromSearch],
            );
        }

        clearError('tagIds');
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: Number(value) }));
        clearError(name);
    };

    const validateClient = () => {
        const validationErrors: Record<string, string[]> = {};

        if (!form.title.trim()) validationErrors.title = ['Назва обовʼязкова'];
        if (!form.slug.trim()) validationErrors.slug = ['Slug обовʼязковий'];
        if (!form.description?.trim()) validationErrors.description = ['Опис не може бути порожнім'];
        if (!form.video && requireVideoFile) validationErrors.video = ['Відео файл обовʼязковий'];
        if (form.languageId === 0) validationErrors.languageId = ['Оберіть мову'];
        if (form.privacyId === 0) validationErrors.privacyId = ['Оберіть рівень приватності'];

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
            await onSubmit(form);
        }
        catch (err: any) {
            if (err?.data?.errors) {
                setServerErrors(err.data.errors);
            }
        }
    };

    const handleTagSubmit = async (e: any) => {
        e.preventDefault();
        const name = tagInput.trim();
        if (!name) return;

        setTagError(null);

        try {
            const createdTag = await createTag({
                name,
                slug: slugify(name),
            }).unwrap();

            setExtraTags(prev =>
                prev.some(t => t.id === createdTag.id) ? prev : [...prev, createdTag],
            );
            handleTagToggle(createdTag.id);
            setTagInput('');
        } catch (err: any) {
            if (err?.data?.errors) {
                const errorsObj = err.data.errors;
                const errorMsg = errorsObj.Name?.[0] || errorsObj.name?.[0] || errorsObj.Slug?.[0] || errorsObj.slug?.[0] || 'Помилка створення тегу';
                setTagError(errorMsg);
            } else {
                setTagError('Не вдалося створити тег');
            }
        }
    };

    return (
        <>
            {(isLoading || isLoadingTag) && <LoadingOverlay />}

            <div className="p-6 bg-[#121213] min-h-screen">
                <h1 className="text-3xl font-black text-white mb-8">{title}</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-7 space-y-6">
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
                            required
                            error={errors.description}
                        />

                        <SelectField
                            label="Мова"
                            name="languageId"
                            value={form.languageId}
                            options={languagesData?.items.map(l => ({ id: l.id, name: l.name })) || []}
                            onChange={handleSelectChange}
                            required
                            error={errors.languageId}
                        />

                        <SelectField
                            label="Приватність"
                            name="privacyId"
                            value={form.privacyId}
                            options={privaciesData?.map(p => ({ id: p.id, name: p.name })) || []}
                            onChange={handleSelectChange}
                            required
                            error={errors.privacyId}
                        />

                        <div>
                            <label className="text-zinc-400 mb-1 font-semibold block">
                                Жанри
                            </label>

                            <div className="flex flex-wrap gap-2">
                                {genresData?.items.map((genre: IGenreItemResponse) => (
                                    <Button
                                        key={genre.id}
                                        type="button"
                                        variant="chip"
                                        active={form.genreIds?.includes(genre.id)}
                                        onClick={() => handleGenreToggle(genre.id)}
                                    >
                                        {genre.name}
                                    </Button>
                                ))}
                            </div>

                            {errors.genreIds && (
                                <span className="text-red-500 text-sm mt-1 block">
                                    {errors.genreIds[0]}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="text-zinc-400 mb-2 font-semibold block">
                                Теги
                            </label>

                            {!!form.tagIds?.length && (
                                <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-zinc-800">
                                    {knownTags
                                        .filter(tag => form.tagIds?.includes(tag.id))
                                        .map((tag: ITagItemResponse) => (
                                            <Button
                                                key={`selected-${tag.id}`}
                                                type="button"
                                                variant="chip"
                                                active
                                                onClick={() => handleTagToggle(tag.id)}
                                            >
                                                {tag.name}
                                            </Button>
                                        ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto pr-1">
                                {tagsData?.items.map((tag: ITagItemResponse) => (
                                    <Button
                                        key={tag.id}
                                        type="button"
                                        variant="chip"
                                        active={form.tagIds?.includes(tag.id)}
                                        onClick={() => handleTagToggle(tag.id)}
                                    >
                                        {tag.name}
                                    </Button>
                                ))}
                            </div>

                            {errors.tagIds && (
                                <span className="text-red-500 text-sm mt-1 mb-4 block">
                                    {errors.tagIds[0]}
                                </span>
                            )}

                            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80 space-y-3 mt-4">
                                <InputField
                                    label="Пошук або створення тегу"
                                    name="tag"
                                    value={tagInput}
                                    onChange={handleTagChange}
                                    error={tagError??undefined}
                                    placeholder="Введіть назву тегу..."
                                />

                                <Button onClick={handleTagSubmit} variant="primary" size="md" className="w-full justify-center">
                                    Створити тег
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="space-y-2">
                            <FileUploadField
                                label="Зображення (Прев'ю)"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                error={errors.image}
                            />
                            {imagePreview && (
                                <div className="mt-2 aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center shadow-lg">
                                    <img src={imagePreview} alt="Image Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <FileUploadField
                                label="Відео файл"
                                name="video"
                                accept="video/*"
                                onChange={handleFileChange}
                                error={errors.video}
                                required={requireVideoFile}
                            />
                            {videoPreview && (
                                <div className="mt-2 w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-lg">
                                    <MoviePlayer src={videoPreview} />
                                </div>
                            )}
                            {initialVideoUrl && !videoPreview && (
                                <div className="mt-2 w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-lg">
                                    <MoviePlayer videoName={initialVideoUrl} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-12 flex justify-end mt-4">
                        <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
                            {submitButtonText}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
