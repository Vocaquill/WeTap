import {useState, type ChangeEvent, type FormEvent} from 'react';
import {slugify} from '../../../utils/slugify';
import {useCreateGenreMutation} from '../../../services/api/apiGenres';
import {useFormServerErrors} from "../../../hooks/useFormServerErrors";
import type {IGenreCreateRequest as IGenreCreate} from '../../../types/Genre/IGenreCreateRequest';
import {InputField} from "../../form/InputField";
import {FileUploadField} from '../../form/FileUploadField';
import {Button} from "../../form/Button";
import {BaseModal} from '../common/BaseModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function AddGenreModal({isOpen, onClose}: Props) {
    const [createGenre, {isLoading}] = useCreateGenreMutation();
    const {errors, setServerErrors, clearError, clearAllErrors} = useFormServerErrors();

    const [form, setForm] = useState<IGenreCreate>({
        name: '',
        slug: '',
        image: undefined
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'name' ? {slug: slugify(value)} : {})
        }));

        clearError(name);
        if (name === 'name') clearError('slug');
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({...prev, image: e.target.files?.[0]}));
        clearError('image');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearAllErrors();

        try {
            await createGenre(form).unwrap();
            setForm({name: '', slug: '', image: undefined});
            onClose();
        } catch (err: any) {
            if (err?.data?.errors) setServerErrors(err.data.errors);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Новий жанр"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Назва" name="name" value={form.name} onChange={handleChange} error={errors.name}
                            required/>
                <InputField label="Slug" name="slug" value={form.slug} onChange={handleChange} error={errors.slug}
                            required/>
                <FileUploadField label="Фото" name="image" onChange={handleFileChange} accept="image/*"
                                 error={errors.image}/>

                {form.image && (
                    <img src={URL.createObjectURL(form.image)} alt="Preview"
                         className="w-full h-32 object-cover rounded-xl border border-zinc-800"/>
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
        </BaseModal>
    );
}

export default AddGenreModal;
