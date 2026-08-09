import { useMemo, useState, useRef, useEffect, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { ImagePlus, Plus, X, Upload, AlertCircle } from 'lucide-react';
import { useGetPrivaciesQuery } from '../../services/api/apiVideos';
import { useSearchGenresQuery } from '../../services/api/apiGenres';
import { useCreateTagMutation, useSearchTagsQuery } from '../../services/api/apiTags';
import { useSearchLanguagesQuery } from '../../services/api/apiLanguages';
import type { IVideoCreateRequest } from '../../types/Video/IVideoCreateRequest';
import type { IGenreItemResponse } from '../../types/Genre/IGenreItemResponse';
import type { ITagItemResponse } from '../../types/Tag/ITagItemResponse';

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

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    errors,
    setServerErrors,
    clearError,
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

  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<string>('');

  useEffect(() => {
    if (form.image instanceof File) {
      const url = URL.createObjectURL(form.image);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (initialImageUrl) {
      setImagePreview(`${APP_ENV.IMAGES_400_URL}${initialImageUrl}`);
    } else {
      setImagePreview('');
    }
  }, [form.image, initialImageUrl]);

  useEffect(() => {
    if (form.video instanceof File) {
      const url = URL.createObjectURL(form.video);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoPreview('');
    }
  }, [form.video]);

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

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
    clearError(name);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
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
    const isSelected = form.tagIds?.includes(id);
    const tagFromSearch = tagsData?.items?.find(t => t.id === id);

    setForm(prev => {
      const current = prev.tagIds || [];
      return {
        ...prev,
        tagIds: isSelected
          ? current.filter(t => t !== id)
          : [...current, id],
      };
    });

    if (!isSelected && tagFromSearch) {
      setExtraTags(prev => prev.some(tag => tag.id === id) ? prev : [...prev, tagFromSearch]);
    }
    clearError('tagIds');
  };

  const handleTagSubmit = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    setTagError(null);

    const name = tagInput.trim();
    if (!name) return;

    try {
      const createdTag = await createTag({ name, slug: slugify(name) }).unwrap();
      setExtraTags(prev => prev.some(t => t.id === createdTag.id) ? prev : [...prev, createdTag]);
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

  const validateClient = () => {
    const validationErrors: Record<string, string[]> = {};

    if (!form.title.trim()) validationErrors.title = ['Назва обовʼязкова'];
    if (!form.slug.trim()) validationErrors.slug = ['Slug обовʼязковий'];
    if (!form.description?.trim()) validationErrors.description = ['Опис не може бути порожнім'];

    if (!form.genreIds || form.genreIds.length === 0) {
      validationErrors.genreIds = ['Оберіть принаймні один жанр'];
    }

    if (!form.tagIds || form.tagIds.length === 0) {
      validationErrors.tagIds = ['Додайте або виберіть принаймні один тег'];
    }

    if (!form.video && requireVideoFile && !initialVideoUrl) {
      validationErrors.video = ['Відеофайл обовʼязковий для завантаження'];
    }

    if (form.languageId === 0) validationErrors.languageId = ['Оберіть мову'];
    if (form.privacyId === 0) validationErrors.privacyId = ['Оберіть рівень приватності'];

    if (Object.keys(validationErrors).length) {
      setServerErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateClient()) return;

    try {
      await onSubmit(form);
    } catch (err: any) {
      if (err?.data?.errors) {
        setServerErrors(err.data.errors);
      }
    }
  };

  // --- ЗМІНЕНО СТИЛІ ДЛЯ СВІТЛОЇ ТЕМИ ---
  // inputBaseStyle: border-zinc-200 -> border-zinc-400
  const inputBaseStyle = "w-full bg-white dark:bg-white/[0.03] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff2a6d]/80 focus:border-transparent transition-all duration-200 border border-zinc-400 dark:border-white/20 hover:border-zinc-500 dark:hover:border-white/30 shadow-xs";

  const cardContainerStyle = "bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-white/15 rounded-2xl shadow-xs backdrop-blur-md overflow-hidden";

  // boxWrapperStyle: border-zinc-200 -> border-zinc-400
  const boxWrapperStyle = "p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-400 dark:border-white/20";

  return (
    <div className="relative min-h-screen bg-theme-bg text-theme-zinc-100 p-6 lg:p-10 flex flex-col justify-between transition-colors duration-300">
      {isLoading && <LoadingOverlay />}

      <input ref={imageInputRef} type="file" name="image" accept="image/*" onChange={handleFileChange} className="hidden" />
      <input ref={videoInputRef} type="file" name="video" accept="video/*" onChange={handleFileChange} className="hidden" />

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between max-w-[1400px] w-full mx-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-300 dark:border-white/10">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Назва відео *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Введіть назву відео"
                  className={`${inputBaseStyle} ${errors.title ? '!border-red-500' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="video-slug"
                  className={`${inputBaseStyle} ${errors.slug ? '!border-red-500' : ''}`}
                />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Опис *</label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Розкажіть глядачам про ваше відео."
                  className={`${inputBaseStyle} rounded-2xl p-5 resize-none ${errors.description ? '!border-red-500' : ''}`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Мова *</label>
                  <select
                    name="languageId"
                    value={form.languageId}
                    onChange={handleSelectChange}
                    className={`${inputBaseStyle} appearance-none cursor-pointer py-3 ${errors.languageId ? '!border-red-500' : ''}`}
                  >
                    <option value={0} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Виберіть мову</option>
                    {languagesData?.items.map(l => (
                      <option key={l.id} value={l.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                        {l.name}
                      </option>
                    ))}
                  </select>
                  {errors.languageId && <p className="text-red-500 text-xs mt-0.5">{errors.languageId[0]}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Створити новий тег</label>
                  <input
                    type="text"
                    value={tagInput}
                    disabled={isLoadingTag}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagSubmit}
                    placeholder="Напишіть та натисніть Enter"
                    className={`${inputBaseStyle} py-3 text-xs disabled:opacity-50`}
                  />
                </div>
              </div>

              {/* Блок Жанрів */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Жанри * <span className="text-zinc-500 dark:text-zinc-400 font-normal">(Можна вибрати декілька)</span>
                </label>
                <div className={`${boxWrapperStyle} ${errors.genreIds ? '!border-red-500' : ''}`}>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                    {genresData?.items
                      .filter(genre => form.genreIds?.includes(genre.id))
                      .map((genre: IGenreItemResponse) => (
                        <span
                          key={`selected-genre-${genre.id}`}
                          onClick={() => handleGenreToggle(genre.id)}
                          className="inline-flex items-center gap-1 bg-[#ff2a6d]/15 text-[#ff2a6d] border border-[#ff2a6d]/60 text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#ff2a6d]/25 transition-colors font-medium"
                        >
                          {genre.name}
                          <X size={12} />
                        </span>
                      ))}
                    {genresData?.items
                      .filter(genre => !form.genreIds?.includes(genre.id))
                      .map((genre: IGenreItemResponse) => (
                        <span
                          key={`genre-${genre.id}`}
                          onClick={() => handleGenreToggle(genre.id)}
                          // Світла тема: border-zinc-200 -> border-zinc-400
                          className="inline-flex items-center gap-1 bg-white dark:bg-white/[0.05] text-zinc-800 dark:text-zinc-200 border border-zinc-400 dark:border-white/20 text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-zinc-100 hover:border-zinc-500 transition-all font-medium"
                        >
                          <Plus size={11} />
                          {genre.name}
                        </span>
                      ))}
                  </div>
                </div>
                {errors.genreIds && (
                  <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} /> {errors.genreIds[0]}
                  </p>
                )}
              </div>

              {/* Блок Тегів */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Теги *</label>
                <div className={`${boxWrapperStyle} ${errors.tagIds ? '!border-red-500' : ''}`}>
                  <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                    {knownTags
                      .filter(tag => form.tagIds?.includes(tag.id))
                      .map((tag: ITagItemResponse) => (
                        <span
                          key={`selected-tag-${tag.id}`}
                          onClick={() => handleTagToggle(tag.id)}
                          className="inline-flex items-center gap-1 bg-[#ff2a6d]/15 text-[#ff2a6d] border border-[#ff2a6d]/60 text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#ff2a6d]/25 transition-colors font-medium"
                        >
                          #{tag.name}
                          <X size={12} />
                        </span>
                      ))}
                    {tagsData?.items
                      .filter(tag => !form.tagIds?.includes(tag.id))
                      .map((tag: ITagItemResponse) => (
                        <span
                          key={`tag-${tag.id}`}
                          onClick={() => handleTagToggle(tag.id)}
                          // Світла тема: border-zinc-200 -> border-zinc-400
                          className="inline-flex items-center gap-1 bg-white dark:bg-white/[0.05] text-zinc-800 dark:text-zinc-200 border border-zinc-400 dark:border-white/20 text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-zinc-100 hover:border-zinc-500 transition-all font-medium"
                        >
                          <Plus size={11} />
                          {tag.name}
                        </span>
                      ))}
                  </div>
                </div>
                {tagError && <p className="text-red-500 text-xs mt-1">{tagError}</p>}
                {errors.tagIds && (
                  <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} /> {errors.tagIds[0]}
                  </p>
                )}
              </div>

              {/* Обкладинка */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Обкладинка відео</h3>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  // Світла тема (border-dashed): border-zinc-300 -> border-zinc-400
                  className={`w-full max-w-sm aspect-video rounded-2xl border-2 border-dashed ${errors.image ? 'border-red-500' : 'border-zinc-400 dark:border-white/30 hover:border-[#ff2a6d]'
                    } bg-zinc-50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.04] flex flex-col items-center justify-center text-center cursor-pointer transition-all group relative overflow-hidden`}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-xs">
                        <ImagePlus className="text-white" size={24} />
                        <span className="text-xs bg-[#ff2a6d] text-white px-3 py-1 rounded-full font-medium">Змінити обкладинку</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="text-zinc-500 dark:text-zinc-400 mb-2 group-hover:text-[#ff2a6d] group-hover:scale-110 transition-all" size={28} />
                      <p className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        Натисніть, щоб завантажити фото
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Формат: 16:9 (PNG, JPG)</p>
                    </>
                  )}
                </div>
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-5 space-y-6">
              {/* Блок завантаження відео */}
              <div className={`${cardContainerStyle} p-4 space-y-4`}>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center relative border border-zinc-100 dark:border-white/10">
                  {videoPreview ? (
                    <MoviePlayer src={videoPreview} />
                  ) : initialVideoUrl ? (
                    <MoviePlayer videoName={initialVideoUrl} />
                  ) : (
                    <div
                      onClick={() => videoInputRef.current?.click()}
                      className="flex flex-col items-center gap-3 text-zinc-400 cursor-pointer hover:text-white transition-colors w-full h-full justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                        <Upload size={28} className="text-[#ff2a6d]" />
                      </div>
                      <span className="text-sm font-medium text-zinc-300">Відео не вибрано</span>
                    </div>
                  )}
                </div>

                <div className="px-1">
                  <div className="flex items-center justify-between mt-2">
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold">Назва файлу</p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate w-48">
                        {form.video instanceof File ? form.video.name : (form.title || 'Немає відео')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="flex items-center gap-1.5 bg-[#ff2a6d] hover:bg-[#e0245e] text-white text-xs px-4 py-2.5 rounded-xl transition-colors font-medium shrink-0 cursor-pointer shadow-md shadow-[#ff2a6d]/20"
                    >
                      <Upload size={14} />
                      {form.video || initialVideoUrl ? 'Змінити відео' : 'Завантажити'}
                    </button>
                  </div>
                </div>

                {errors.video && (
                  <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                    <AlertCircle className="text-red-500 shrink-0" size={16} />
                    <p className="text-red-500 text-xs font-medium">{errors.video[0]}</p>
                  </div>
                )}
              </div>

              {/* Visibility Card */}
              <div className={`${cardContainerStyle} p-6 space-y-4`}>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Приватність *</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Виберіть, хто зможе бачити це відео.</p>
                </div>

                <div className="space-y-3">
                  {privaciesData?.map((privacy) => {
                    const isSelected = form.privacyId === privacy.id;
                    return (
                      <label
                        key={privacy.id}
                        onClick={() => {
                          setForm(prev => ({ ...prev, privacyId: privacy.id }));
                          clearError('privacyId');
                        }}
                        // Світла тема: border-zinc-200 -> border-zinc-400
                        className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${isSelected
                          ? 'bg-[#ff2a6d]/10 border-[#ff2a6d] shadow-md shadow-[#ff2a6d]/10'
                          : 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-400 dark:border-white/15 hover:border-zinc-500 dark:hover:border-white/25 hover:bg-zinc-100 dark:hover:bg-white/[0.04]'
                          }`}
                      >
                        <div className="pt-0.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-[#ff2a6d]' : 'border-zinc-500 dark:border-white/40'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#ff2a6d]" />}
                          </div>
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${isSelected ? 'text-[#ff2a6d]' : 'text-zinc-800 dark:text-zinc-200'}`}>
                            {privacy.name}
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

        {/* Footer / Submit bar */}
        <div className="pt-6 mt-6 border-t border-zinc-300 dark:border-white/10 flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#ff2a6d] hover:bg-[#e0245e] text-white font-semibold px-8 py-3 rounded-full text-sm transition-all shadow-lg shadow-[#ff2a6d]/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
