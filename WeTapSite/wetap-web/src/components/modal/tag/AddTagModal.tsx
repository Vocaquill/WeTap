import { useState, type ChangeEvent, type FormEvent } from 'react';
import { slugify } from '../../../utils/slugify';
import { useCreateTagMutation } from '../../../services/api/apiTags';
import { useFormServerErrors } from "../../../hooks/useFormServerErrors";
import type { ITagCreateRequest as ITagCreate } from '../../../types/Tag/ITagCreateRequest';
import { InputField } from "../../form/InputField";
import { Button } from "../../form/Button";
import { BaseModal } from '../common/BaseModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function AddTagModal({ isOpen, onClose }: Props) {
    const [createTag, { isLoading }] = useCreateTagMutation();
    const { errors, setServerErrors, clearError, clearAllErrors } = useFormServerErrors();

    const [form, setForm] = useState<ITagCreate>({
        name: '',
        slug: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'name' ? { slug: slugify(value) } : {})
        }));

        clearError(name);
        if (name === 'name') clearError('slug');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearAllErrors();

        try {
            await createTag(form).unwrap();
            setForm({ name: '', slug: '' });
            onClose();
        } catch (err: any) {
            if (err?.data?.errors) setServerErrors(err.data.errors);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Новий тег"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Назва" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
                <InputField label="Slug" name="slug" value={form.slug} onChange={handleChange} error={errors.slug} required />

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

export default AddTagModal;
