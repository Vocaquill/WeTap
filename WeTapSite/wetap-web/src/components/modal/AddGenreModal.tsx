import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { slugify } from '../../utils/slugify';

import { useCreateGenreMutation } from '../../services/api/apiGenres';
import { useFormServerErrors } from "../../hooks/useFormServerErrors";
import type { IGenreCreateRequest as IGenreCreate } from '../../types/Genre/IGenreCreateRequest';
import {InputField} from "../form/InputField";
import { FileUploadField } from '../form/FileUploadField';
import { Button } from "../form/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function AddGenreModal({ isOpen, onClose }: Props) {
  const [createGenre, { isLoading }] = useCreateGenreMutation();
  const { errors, setServerErrors, clearError, clearAllErrors } = useFormServerErrors();

  const [form, setForm] = useState<IGenreCreate>({
    name: '',
    slug: '',
    image: undefined
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
      // Якщо міняємо name — автоматично оновлюємо slug
      ...(name === 'name' ? { slug: slugify(value) } : {})
    }));

    clearError(name);
    if (name === 'name') clearError('slug');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, image: e.target.files?.[0] }));
    clearError('image');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearAllErrors();

    try {
      await createGenre(form).unwrap();
      // Очищуємо форму перед закриттям
      setForm({ name: '', slug: '', image: undefined });
      onClose();
    }
    catch (err: any) {
      if (err?.data?.errors) setServerErrors(err.data.errors);
    }
  };

  if (!isOpen) return null;

  return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative z-10 w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-2xl font-black text-white">Новий жанр</h3>
              <Button variant="ghostIcon" onClick={onClose}><X size={24} /></Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <InputField label="Назва" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
              <InputField label="Slug" name="slug" value={form.slug} onChange={handleChange} error={errors.slug} required />
              <FileUploadField label="Фото" name="image" onChange={handleFileChange} accept="image/*" error={errors.image} />

              {form.image && (
                  <img src={URL.createObjectURL(form.image)} className="w-full h-32 object-cover rounded-xl border border-zinc-800" />
              )}

              <div className="pt-4 flex gap-3">
                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={onClose}
                >
                    Скасувати
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="flex-1"
                    isLoading={isLoading}
                >
                    Створити
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>
  );
}

export default AddGenreModal;