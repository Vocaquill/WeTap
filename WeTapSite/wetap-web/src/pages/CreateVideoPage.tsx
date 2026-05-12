import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVideoMutation, useGetPrivaciesQuery } from '../services/api/apiVideos';
import { useSearchGenresQuery } from '../services/api/apiGenres';
import { useSearchTagsQuery } from '../services/api/apiTags';
import { useSearchLanguagesQuery } from '../services/api/apiLanguages';
import type { IVideoCreateRequest } from '../types/Video/IVideoCreateRequest';
import type { IGenreItemResponse } from '../types/Genre/IGenreItemResponse';
import type { ITagItemResponse } from '../types/Tag/ITagItemResponse';
import { useVideoProgress } from '../hooks/useVideoProgress';
import { Progress, Modal, Typography, Space } from 'antd';

import { InputField } from '../components/form/InputField';
import { TextAreaField } from '../components/form/TextAreaField';
import { FileUploadField } from '../components/form/FileUploadField';
import { PrimaryButton } from '../components/form/PrimaryButton';
import { useFormServerErrors } from "../utils/useFormServerErrors.ts";
import LoadingOverlay from "../components/LoadingOverlay.tsx";

import { slugify } from '../utils/slugify';

interface SelectFieldProps {
    label: string;
    name: string;
    value?: string | number;
    options: { id: string | number; name: string }[];
    required?: boolean;
    error?: string[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField = ({
    label,
    name,
    value,
    options,
    required = false,
    error,
    onChange,
}: SelectFieldProps) => (
    <div className="flex flex-col">
        <label className="text-zinc-400 mb-1 font-semibold">{label}</label>

        <select
            name={name}
            value={value}
            required={required}
            onChange={onChange}
            className={`bg-zinc-900 text-white rounded-xl px-4 py-3 border transition appearance-none
                ${error ? 'border-red-500' : 'border-zinc-800'}
                cursor-pointer focus:border-red-500 outline-none
            `}
        >
            <option value="" disabled>Оберіть...</option>
            {options.map(option => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>

        {error && (
            <span className="text-red-500 text-sm mt-1">
                {error[0]}
            </span>
        )}
    </div>
);

export default function CreateVideoPage() {
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [createVideo, { isLoading }] = useCreateVideoMutation();
    const { progress, isConnected } = useVideoProgress(trackingId);
    const { data: genresData } = useSearchGenresQuery({ page: 1, itemPerPage: 100 });
    const { data: tagsData } = useSearchTagsQuery({ page: 1, itemPerPage: 100 });
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
        languageId: 0,
        privacyId: 0,
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

    useEffect(() => {
        if (progress?.status === 'Completed') {
            const timer = setTimeout(() => navigate('/admin/videos'), 2000);
            return () => clearTimeout(timer);
        }
    }, [progress?.status, navigate]);

    return (
        <>
            {isLoading && <LoadingOverlay />}

            <Modal
                open={!!trackingId}
                footer={null}
                closable={false}
                centered
                title="Завантаження та обробка відео"
                styles={{
                    mask: { backdropFilter: 'blur(10px)' },
                    content: { backgroundColor: '#09090b', color: 'white', border: '1px solid #27272a' }
                }}
            >
                <Space direction="vertical" size="large" className="w-full py-4">
                    <div className="flex justify-between items-center text-sm text-zinc-400">
                        <span>Статус підключення:</span>
                        <span className={isConnected ? "text-green-500" : "text-red-500"}>
                            {isConnected ? "Підключено" : "Відключено"}
                        </span>
                    </div>

                    {progress ? (
                        <div className="space-y-4">
                            <Progress
                                percent={Math.round(progress.percentage)}
                                status={progress.status === 'Completed' ? 'success' : 'active'}
                                strokeColor={progress.status === 'Completed' ? '#22c55e' : '#dc2626'}
                                trailColor="#18181b"
                                format={(percent) => <span className="text-white font-bold">{percent}%</span>}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase font-bold">Статус</p>
                                    <p className="text-sm font-medium text-white">{progress.status}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase font-bold">Залишилось часу</p>
                                    <p className="text-sm font-medium text-white">{progress.estimatedTimeRemaining || "рахуємо..."}</p>
                                </div>
                            </div>

                            {progress.status === 'Completed' && (
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm text-center font-bold">
                                    Відео успішно завантажено та оброблено! Перенаправлення...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-zinc-400 italic">Очікування оновлень прогресу...</p>
                        </div>
                    )}
                </Space>
            </Modal>

            <div className="p-6 bg-zinc-950 min-h-screen">
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
                        <PrimaryButton type="submit">
                            Створити
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </>
    );
}
