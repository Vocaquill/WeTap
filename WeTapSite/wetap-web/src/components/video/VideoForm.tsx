import {useMemo, useState, useRef, type ChangeEvent, type FormEvent} from 'react';
import {ImagePlus, Plus, X, Copy, Upload} from 'lucide-react';
import {useGetPrivaciesQuery} from '../../services/api/apiVideos';
import {useSearchGenresQuery} from '../../services/api/apiGenres';
import {useCreateTagMutation, useSearchTagsQuery} from '../../services/api/apiTags';
import {useSearchLanguagesQuery} from '../../services/api/apiLanguages';
import type {IVideoCreateRequest} from '../../types/Video/IVideoCreateRequest';
import type {IGenreItemResponse} from '../../types/Genre/IGenreItemResponse';
import type {ITagItemResponse} from '../../types/Tag/ITagItemResponse';

import {useFormServerErrors} from "../../hooks/useFormServerErrors";
import LoadingOverlay from "../ui/loading/LoadingOverlay";
import {MoviePlayer} from '../movie/MoviePlayer';
import {APP_ENV} from '../../env';
import {slugify} from '../../utils/slugify';

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
    const [createTag, {isLoading: isLoadingTag}] = useCreateTagMutation();
    const {data: genresData} = useSearchGenresQuery({page: 1, itemPerPage: 100});
    const [tagInput, setTagInput] = useState('');
    const {data: tagsData} = useSearchTagsQuery({
        page: 1,
        itemPerPage: 10,
        name: tagInput.trim() || undefined,
    });
    const {data: languagesData} = useSearchLanguagesQuery({page: 1, itemPerPage: 100});
    const {data: privaciesData} = useGetPrivaciesQuery();

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

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

    const imagePreview =
        form.image instanceof File
            ? URL.createObjectURL(form.image)
            : initialImageUrl
                ? `${APP_ENV.IMAGES_400_URL}${initialImageUrl}`
                : "";

    const videoPreview =
        form.video instanceof File
            ? URL.createObjectURL(form.video)
            : "";

    const knownTags = useMemo(() => {
        const map = new Map(extraTags.map(tag => [tag.id, tag]));
        tagsData?.items?.forEach(tag => map.set(tag.id, tag));
        return Array.from(map.values());
    }, [extraTags, tagsData?.items]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;

        setForm(prev => {
            const nextState = {...prev, [name]: value};

            if (name === 'title' && (requireVideoFile || !prev.slug)) {
                nextState.slug = slugify(value);
            }

            return nextState;
        });

        clearError(name);
        if (name === 'title') clearError('slug');
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files?.[0]) {
            setForm(prev => ({...prev, [name]: files[0]}));
            clearError(name);
        }
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
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: Number(value)}));
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
        } catch (err: any) {
            if (err?.data?.errors) {
                setServerErrors(err.data.errors);
            }
        }
    };

    const handleTagSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
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
        <div
            className="min-h-screen bg-[#111216] text-white flex flex-col justify-between p-6 lg:p-10 font-sans relative">
            {(isLoading || isLoadingTag) && <LoadingOverlay/>}

            <input
                ref={imageInputRef}
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <input
                ref={videoInputRef}
                type="file"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <form onSubmit={handleSubmit}
                  className="flex-1 flex flex-col justify-between max-w-[1400px] w-full mx-auto">
                <div>
                    <div className="flex items-center justify-between pb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">

                        <div className="lg:col-span-7 space-y-6">

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-300">Video title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter video title"
                                    className="w-full bg-[#1c1d22] border border-white/5 text-white placeholder-zinc-500 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff2a6d] transition-all"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-300">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="video-slug"
                                    className="w-full bg-[#1c1d22] border border-white/5 text-white placeholder-zinc-500 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff2a6d] transition-all"
                                />
                                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-300">Description</label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Tell the viewers about your video."
                                    className="w-full bg-[#1c1d22] border border-white/5 text-white placeholder-zinc-500 rounded-3xl p-5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#ff2a6d] transition-all"
                                />
                                {errors.description &&
                                    <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-300">Tags</label>
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagSubmit}
                                        placeholder="Type & Enter to add"
                                        className="w-full bg-[#1c1d22] border border-white/5 text-white placeholder-zinc-500 rounded-full px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff2a6d] transition-all"
                                    />
                                    {tagError && <p className="text-red-500 text-[10px] mt-0.5">{tagError}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-300">Genre</label>
                                    <div className="relative">
                                        <select
                                            name="genreIds"
                                            value={form.genreIds?.[0] || ''}
                                            onChange={(e) => handleGenreToggle(Number(e.target.value))}
                                            className="w-full bg-[#1c1d22] border border-white/5 text-zinc-300 rounded-full px-4 py-3 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-[#ff2a6d] cursor-pointer"
                                        >
                                            <option value="">Select a genre</option>
                                            {genresData?.items.map((genre: IGenreItemResponse) => (
                                                <option key={genre.id} value={genre.id}
                                                        className="bg-[#1c1d22] text-white">
                                                    {genre.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.genreIds &&
                                        <p className="text-red-500 text-xs mt-0.5">{errors.genreIds[0]}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-300">Language</label>
                                    <div className="relative">
                                        <select
                                            name="languageId"
                                            value={form.languageId}
                                            onChange={handleSelectChange}
                                            className="w-full bg-[#1c1d22] border border-white/5 text-zinc-300 rounded-full px-4 py-3 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-[#ff2a6d] cursor-pointer"
                                        >
                                            <option value={0}>Select a Language</option>
                                            {languagesData?.items.map(l => (
                                                <option key={l.id} value={l.id} className="bg-[#1c1d22] text-white">
                                                    {l.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.languageId &&
                                        <p className="text-red-500 text-xs mt-0.5">{errors.languageId[0]}</p>}
                                </div>
                            </div>

                            {(!!form.tagIds?.length || !!tagsData?.items?.length) && (
                                <div className="space-y-2 pt-1">
                                    <p className="text-[11px] text-zinc-500">
                                        Tags can be useful if viewers often make spelling mistakes.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                        {knownTags
                                            .filter(tag => form.tagIds?.includes(tag.id))
                                            .map((tag: ITagItemResponse) => (
                                                <span
                                                    key={`selected-${tag.id}`}
                                                    onClick={() => handleTagToggle(tag.id)}
                                                    className="inline-flex items-center gap-1 bg-[#ff2a6d]/20 text-[#ff2a6d] border border-[#ff2a6d]/30 text-xs px-2.5 py-1 rounded-full cursor-pointer hover:bg-[#ff2a6d]/30 transition-colors"
                                                >
                                                    #{tag.name}
                                                    <X size={12}/>
                                                </span>
                                            ))}
                                        {tagsData?.items
                                            .filter(tag => !form.tagIds?.includes(tag.id))
                                            .map((tag: ITagItemResponse) => (
                                                <span
                                                    key={tag.id}
                                                    onClick={() => handleTagToggle(tag.id)}
                                                    className="inline-flex items-center gap-1 bg-white/5 text-zinc-400 text-xs px-2.5 py-1 rounded-full cursor-pointer hover:bg-white/10 hover:text-white transition-colors"
                                                >
                                                    <Plus size={10}/>
                                                    {tag.name}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 pt-2">
                                <div>
                                    <h3 className="text-sm font-semibold">Cover</h3>
                                    <p className="text-xs text-zinc-500">Choose a cover that stands out and grabs the
                                        viewers' attention.</p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div
                                        onClick={() => imageInputRef.current?.click()}
                                        className="h-32 rounded-2xl border-2 border-dashed border-[#ff2a6d]/50 hover:border-[#ff2a6d] bg-[#ff2a6d]/5 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group"
                                    >
                                        <ImagePlus
                                            className="text-[#ff2a6d] mb-2 group-hover:scale-110 transition-transform"
                                            size={24}/>
                                        <p className="text-[11px] text-zinc-300">
                                            Drag and drop a file to select it, or{' '}
                                            <span className="text-[#ff2a6d] underline font-medium">click here</span>.
                                        </p>
                                    </div>

                                    {imagePreview ? (
                                        <div
                                            className="h-32 rounded-2xl overflow-hidden border border-white/10 bg-[#1c1d22] relative group">
                                            <img src={imagePreview} alt="Cover Preview"
                                                 className="w-full h-full object-cover"/>
                                            <div
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => imageInputRef.current?.click()}
                                                    className="text-xs bg-black/60 text-white px-3 py-1.5 rounded-full border border-white/20"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="h-32 rounded-2xl bg-[#1c1d22]/50 border border-white/5 flex items-center justify-center text-zinc-600 text-xs">
                                            No image
                                        </div>
                                    )}

                                    <div
                                        className="h-32 rounded-2xl bg-[#1c1d22]/30 border border-white/5 hidden md:block"/>

                                    <div
                                        onClick={() => videoInputRef.current?.click()}
                                        className="h-32 rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 bg-[#1c1d22]/40 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group"
                                    >
                                        <Upload className="text-zinc-400 group-hover:text-white mb-2 transition-colors"
                                                size={20}/>
                                        <p className="text-xs text-zinc-400 font-medium">Upload new video</p>
                                    </div>
                                </div>
                                {errors.image && <p className="text-red-500 text-xs">{errors.image[0]}</p>}
                                {errors.video && <p className="text-red-500 text-xs">{errors.video[0]}</p>}
                            </div>

                        </div>

                        <div className="lg:col-span-5 space-y-6">

                            <div
                                className="bg-[#1c1d22] border border-white/5 rounded-3xl overflow-hidden p-3 space-y-4">
                                <div
                                    className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center relative">
                                    {videoPreview ? (
                                        <MoviePlayer src={videoPreview}/>
                                    ) : initialVideoUrl ? (
                                        <MoviePlayer videoName={initialVideoUrl}/>
                                    ) : (
                                        <div
                                            onClick={() => videoInputRef.current?.click()}
                                            className="flex flex-col items-center gap-2 text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors"
                                        >
                                            <Upload size={32}/>
                                            <span className="text-xs">Click to select video file</span>
                                        </div>
                                    )}
                                </div>

                                <div className="px-2 pb-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-semibold">File
                                                name</p>
                                            <p className="text-sm font-semibold text-white truncate max-w-[240px]">
                                                {form.video instanceof File ? form.video.name : form.title || 'Untitled'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => navigator.clipboard.writeText(form.title)}
                                            className="text-zinc-400 hover:text-white p-2 rounded-lg bg-white/5 transition-colors"
                                        >
                                            <Copy size={16}/>
                                        </button>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs">
                                        <div className="flex justify-between text-zinc-400">
                                            <span>Format</span>
                                            <span className="text-white font-medium">
                                                {form.video instanceof File ? form.video.type.split('/')[1]?.toUpperCase() || 'MP4' : 'MP4'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-zinc-400">
                                            <span>File Size</span>
                                            <span className="text-white font-medium">
                                                {form.video instanceof File ? `${(form.video.size / (1024 * 1024)).toFixed(1)} MB` : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1c1d22] border border-white/5 rounded-3xl p-6 space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold">Visibility</h3>
                                    <p className="text-xs text-zinc-500">Choose when to publish your video and who can
                                        view it.</p>
                                </div>

                                <div className="space-y-3">
                                    {privaciesData?.map((privacy) => {
                                        const isSelected = form.privacyId === privacy.id;
                                        return (
                                            <label
                                                key={privacy.id}
                                                onClick={() => {
                                                    setForm(prev => ({...prev, privacyId: privacy.id}));
                                                    clearError('privacyId');
                                                }}
                                                className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer border transition-all ${isSelected
                                                    ? 'bg-[#ff2a6d]/10 border-[#ff2a6d]/40'
                                                    : 'bg-transparent border-transparent hover:bg-white/5'
                                                }`}
                                            >
                                                <div className="pt-0.5">
                                                    <div
                                                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#ff2a6d]' : 'border-zinc-600'
                                                        }`}>
                                                        {isSelected &&
                                                            <div className="w-2 h-2 rounded-full bg-[#ff2a6d]"/>}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                                                        {privacy.name}
                                                    </p>
                                                    <p className="text-[11px] text-zinc-500">
                                                        {(privacy.systemCode === 'PRIVATE' || privacy.id === 2) && "Only you and admins can watch this video."}
                                                        {(privacy.systemCode === 'URL_ONLY' || privacy.id === 3) && "Anyone with the link can watch this video."}
                                                        {(privacy.systemCode === 'PUBLIC' || privacy.id === 1) && "Anyone can search and watch this video."}
                                                    </p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                                {errors.privacyId && <p className="text-red-500 text-xs">{errors.privacyId[0]}</p>}
                            </div>

                        </div>

                    </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#ff2a6d] hover:bg-[#e0245e] text-white font-semibold px-8 py-2.5 rounded-full text-sm transition-all shadow-lg shadow-[#ff2a6d]/20 disabled:opacity-50"
                    >
                        {submitButtonText}
                    </button>
                </div>
            </form>
        </div>
    );
}
