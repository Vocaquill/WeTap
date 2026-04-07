import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { slugify } from '../utils/slugify';

import { useEditGenreMutation } from '../services/api/apiGenres';
import { useFormServerErrors } from "../utils/useFormServerErrors";
import type { IGenreItem, IGenreEdit } from '../types/genre';
import { InputField } from '../components/form/InputField';
import { FileUploadField } from '../components/form/FileUploadField';
import { PrimaryButton } from '../components/form/PrimaryButton';
import { APP_ENV } from '../env';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  genre: IGenreItem | null;
}

function EditGenreModal({ isOpen, onClose, genre }: Props) {
  const [editGenre, { isLoading }] = useEditGenreMutation();
  const { errors, setServerErrors, clearError, clearAllErrors } = useFormServerErrors();

  const [form, setForm] = useState<IGenreEdit | null>(null);

  if (!isOpen) {
    if (form) setForm(null); // Скидаємо стейт, коли модалка закрита
    return null;
  }

  if (!genre) return null;

  // Ініціалізація форми як у твоїх фільмах
  if (!form || form.id !== genre.id) {
    setForm({
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
      image: undefined
    });
    return null;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => prev ? ({
      ...prev,
      [name]: value,
      ...(name === 'name' ? { slug: slugify(value) } : {})
    }) : null);
    clearError(name);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => prev ? ({ ...prev, image: e.target.files?.[0] }) : null);
    clearError('image');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearAllErrors();
    try {
      await editGenre(form).unwrap();
      onClose();
    } catch (err: any) {
      if (err?.data?.errors) setServerErrors(err.data.errors);
    }
  };

  return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative z-10 w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-white">Редагувати</h3>
                <p className="text-xs text-zinc-500 font-mono italic">ID: #{genre.id}</p>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <InputField label="Назва" name="name" value={form.name} onChange={handleChange} error={errors.name} />
              <InputField label="Slug" name="slug" value={form.slug} onChange={handleChange} error={errors.slug} />
              <FileUploadField label="Змінити фото" name="image" onChange={handleFileChange} accept="image/*" error={errors.image} />

              <div className="mt-2">
                {form.image ? (
                    <img src={URL.createObjectURL(form.image)} className="w-full h-32 object-cover rounded-xl border border-red-600/50" />
                ) : genre.image ? (
                    <img src={APP_ENV.IMAGES_400_URL + genre.image} className="w-full h-32 object-cover rounded-xl border border-zinc-800" />
                ) : null}
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-zinc-900 text-white font-bold transition-all">Скасувати</button>
                <PrimaryButton type="submit">
                  {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Оновити'}
                </PrimaryButton>
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>
  );
}

export default EditGenreModal;