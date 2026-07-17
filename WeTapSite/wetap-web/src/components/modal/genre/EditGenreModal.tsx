import {useState, type ChangeEvent, type FormEvent} from 'react';
import {slugify} from '../../../utils/slugify';
import {useEditGenreMutation} from '../../../services/api/apiGenres';
import {useFormServerErrors} from "../../../hooks/useFormServerErrors";
import type {IGenreItemResponse as IGenreItem} from '../../../types/Genre/IGenreItemResponse';
import type {IGenreEditRequest as IGenreEdit} from '../../../types/Genre/IGenreEditRequest';
import {InputField} from '../../form/InputField';
import {FileUploadField} from '../../form/FileUploadField';
import {Button} from '../../form/Button';
import {APP_ENV} from '../../../env/index';
import {BaseModal} from '../common/BaseModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    genre: IGenreItem | null;
}

function EditGenreModal({isOpen, onClose, genre}: Props) {
    const [editGenre, {isLoading}] = useEditGenreMutation();
    const {errors, setServerErrors, clearError, clearAllErrors} = useFormServerErrors();

    const [form, setForm] = useState<IGenreEdit | null>(null);

    if (!isOpen) {
        if (form) setForm(null);
        return null;
    }

    if (!genre) return null;

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
        const {name, value} = e.target;
        setForm(prev => prev ? ({
            ...prev,
            [name]: value,
            ...(name === 'name' ? {slug: slugify(value)} : {})
        }) : null);
        clearError(name);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm(prev => prev ? ({...prev, image: e.target.files?.[0]}) : null);
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
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div>
                    <span className="text-2xl font-black text-theme-text">Редагувати</span>
                    <p className="text-xs text-zinc-500 font-mono italic normal-case not-italic tracking-normal mt-0.5">ID:
                        #{genre.id}</p>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Назва" name="name" value={form.name} onChange={handleChange} error={errors.name}/>
                <InputField label="Slug" name="slug" value={form.slug} onChange={handleChange} error={errors.slug}/>
                <FileUploadField label="Змінити фото" name="image" onChange={handleFileChange} accept="image/*"
                                 error={errors.image}/>

                <div className="mt-2">
                    {form.image ? (
                        <img src={URL.createObjectURL(form.image)} alt="Preview"
                             className="w-full h-32 object-cover rounded-xl border border-red-600/50"/>
                    ) : genre.image ? (
                        <img src={APP_ENV.IMAGES_400_URL + genre.image} alt="Genre photo"
                             className="w-full h-32 object-cover rounded-xl border border-zinc-800"/>
                    ) : null}
                </div>

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
                        Оновити
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
}

export default EditGenreModal;
