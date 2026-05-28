import {useState, useEffect, type ChangeEvent, type FormEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVideoMutation, useGetPrivaciesQuery } from '../../services/api/apiVideos';
import { useSearchGenresQuery } from '../../services/api/apiGenres';
import {useCreateTagMutation, useSearchTagsQuery} from '../../services/api/apiTags';
import { useSearchLanguagesQuery } from '../../services/api/apiLanguages';
import type { IVideoCreateRequest } from '../../types/Video/IVideoCreateRequest';
import type { IGenreItemResponse } from '../../types/Genre/IGenreItemResponse';
import type { ITagItemResponse } from '../../types/Tag/ITagItemResponse';
import { useVideoProgress } from '../../hooks/useVideoProgress';
import { Progress, Modal } from 'antd';

import { InputField } from '../../components/form/InputField';
import { TextAreaField } from '../../components/form/TextAreaField';
import { FileUploadField } from '../../components/form/FileUploadField';
import { Button } from '../../components/form/Button';
import { SelectField } from '../../components/form/SelectField';
import { useFormServerErrors } from "../../hooks/useFormServerErrors";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";

import { slugify } from '../../utils/slugify';

export default function CreateVideoPage() {
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [createVideo, { isLoading }] = useCreateVideoMutation();
    const [createTag, { isLoading: isLoadingTag }] = useCreateTagMutation();
    const { progress, isConnected } = useVideoProgress(trackingId);
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

    const [form, setForm] = useState<IVideoCreateRequest>({
        title: '',
        slug: '',
        description: '',
        genreIds: [],
        tagIds: [],
        image: undefined,
        video: undefined,
        languageId: 1,
        privacyId: 1,
    });

    const [knownTags, setKnownTags] = useState<ITagItemResponse[]>([]);

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

    const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
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
        setForm(prev => {
            const current = prev.tagIds || [];
            return {
                ...prev,
                tagIds: current.includes(id)
                    ? current.filter(g => g !== id)
                    : [...current, id],
            };
        });

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
        if (!form.video) validationErrors.video = ['Відео файл обовʼязковий'];
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
            const result = await createVideo(form).unwrap();
            setTrackingId(result.trackingId);
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

        const createdTag = await createTag({
            name,
            slug: slugify(name),
        }).unwrap();

        setKnownTags(prev =>
            prev.some(t => t.id === createdTag.id) ? prev : [...prev, createdTag]
        );
        handleTagToggle(createdTag.id);
        setTagInput('');
    }

    useEffect(() => {
        if (!tagsData?.items?.length) return;

        setKnownTags(prev => {
            const map = new Map(prev.map(tag => [tag.id, tag]));
            tagsData.items.forEach(tag => map.set(tag.id, tag));
            return Array.from(map.values());
        });
    }, [tagsData]);

    useEffect(() => {
        if (progress?.status === 'Completed' || progress?.status === 'Завершено') {
            const timer = setTimeout(() => navigate(`/video/${form.slug}`), 2000);
            return () => clearTimeout(timer);
        }
    }, [progress?.status, navigate, form.slug]);

    return (
        <>
            {isLoading || isLoadingTag && <LoadingOverlay />}

            <Modal
                open={!!trackingId}
                footer={null}
                closable={false}
                centered
                styles={{
                    mask: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.8)' }
                }}
                width={600}
                modalRender={() => (
                    <div className="bg-[#121213] border border-zinc-800 rounded-[32px] p-8 shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
                            <h2 className="text-white text-xl font-black uppercase tracking-tight">
                                Завантаження та обробка відео
                            </h2>
                            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 animate-pulse'}`}></div>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    {isConnected ? "Connected" : "Disconnected"}
                                </span>
                            </div>
                        </div>

                        {progress ? (
                            <div className="space-y-8">
                                <div className="relative">
                                    <Progress
                                        percent={Math.round(progress.percentage)}
                                        status={(progress.status === 'Completed' || progress.status === 'Завершено') ? 'success' : 'active'}
                                        strokeColor={(progress.status === 'Completed' || progress.status === 'Завершено') ? '#22c55e' : '#dc2626'}
                                        trailColor="#18181b"
                                        format={(percent) => <span className="text-white text-lg font-black tracking-tighter">{percent}%</span>}
                                        strokeWidth={14}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Статус процесу</p>
                                        <p className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                            {progress.status}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Залишилось часу</p>
                                        <p className="text-sm font-bold text-zinc-100 italic">
                                            {progress.estimatedTimeRemaining || "Calculating..."}
                                        </p>
                                    </div>
                                </div>

                                {(progress.status === 'Completed' || progress.status === 'Завершено') && (
                                    <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-2xl text-green-500 text-sm text-center font-bold animate-in fade-in zoom-in duration-500">
                                        <div className="mb-1 flex justify-center">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black">
                                                ✓
                                            </div>
                                        </div>
                                        Відео успішно завантажено та оброблено!<br />
                                        <span className="text-zinc-500 font-medium text-xs">Перенаправлення на сторінку перегляду...</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-zinc-800 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-bold tracking-tight">Ініціалізація завантаження</p>
                                    <p className="text-zinc-500 text-xs mt-1">Очікуємо відповідь від сервера...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            />


            <div className="p-6 bg-[#121213] min-h-screen">
                <h1 className="text-3xl font-black text-white mb-8">Створити відео</h1>

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
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-zinc-400 mb-1 font-semibold block">
                                Жанри
                            </label>

                            <div className="flex flex-wrap gap-2">
                                {genresData?.items.map((genre: IGenreItemResponse) => (
                                    <button
                                        key={genre.id}
                                        type="button"
                                        onClick={() => handleGenreToggle(genre.id)}
                                        className={`px-3 py-1 rounded-xl border transition ${form.genreIds?.includes(genre.id)
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

                        <div>
                            <label className="text-zinc-400 mb-1 font-semibold block">
                                Теги
                            </label>

                            {!!form.tagIds?.length && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {knownTags
                                        .filter(tag => form.tagIds?.includes(tag.id))
                                        .map((tag: ITagItemResponse) => (
                                            <button
                                                key={`selected-${tag.id}`}
                                                type="button"
                                                onClick={() => handleTagToggle(tag.id)}
                                                className="px-3 py-1 rounded-xl border transition bg-red-600 border-red-600 text-white"
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {tagsData?.items.map((tag: ITagItemResponse) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => handleTagToggle(tag.id)}
                                        className={`px-3 py-1 rounded-xl border transition ${form.tagIds?.includes(tag.id)
                                            ? 'bg-red-600 border-red-600 text-white'
                                            : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>

                            <label className="text-zinc-400 mb-1 font-semibold block">
                                Пошук або створення тегу
                            </label>

                            <InputField
                                label="Тег"
                                name="tag"
                                value={tagInput}
                                onChange={handleTagChange}
                            />

                            <Button onClick={handleTagSubmit} variant="primary" size="md">
                                Створити тег
                            </Button>

                            {errors.tagIds && (
                                <span className="text-red-500 text-sm mt-1 block">
                                    {errors.tagIds[0]}
                                </span>
                            )}
                        </div>

                        <FileUploadField
                            label="Зображення (Прев'ю)"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            error={errors.image}
                        />

                        <FileUploadField
                            label="Відео файл"
                            name="video"
                            accept="video/*"
                            onChange={handleFileChange}
                            error={errors.video}
                        />
                    </div>

                    <div className="col-span-2 flex justify-end mt-4">
                        <Button type="submit" variant="primary" size="md">
                            Створити
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
