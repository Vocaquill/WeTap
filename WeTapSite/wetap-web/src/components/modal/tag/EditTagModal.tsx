import { useState, type ChangeEvent, type FormEvent } from 'react';
import { slugify } from '../../../utils/slugify';
import { useEditTagMutation } from '../../../services/api/apiTags';
import { useFormServerErrors } from "../../../hooks/useFormServerErrors";
import type { ITagItemResponse as ITagItem } from '../../../types/Tag/ITagItemResponse';
import type { ITagEditRequest as ITagEdit } from '../../../types/Tag/ITagEditRequest';
import { InputField } from '../../form/InputField';
import { Button } from '../../form/Button';
import { BaseModal } from '../common/BaseModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    tag: ITagItem | null;
}

function EditTagModal({ isOpen, onClose, tag }: Props) {
    const [editTag, { isLoading }] = useEditTagMutation();
    const { errors, setServerErrors, clearError, clearAllErrors } = useFormServerErrors();

    const [form, setForm] = useState<ITagEdit | null>(null);

    if (!isOpen) {
        if (form) setForm(null);
        return null;
    }

    if (!tag) return null;

    if (!form || form.id !== tag.id) {
        setForm({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearAllErrors();
        try {
            await editTag(form).unwrap();
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
                    <span className="text-2xl font-black text-white">Редагувати тег</span>
                    <p className="text-xs text-zinc-500 font-mono italic normal-case not-italic tracking-normal mt-0.5">ID: #{tag.id}</p>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Назва" name="name" value={form.name} onChange={handleChange} error={errors.name} />
                <InputField label="Slug" name="slug" value={form.slug} onChange={handleChange} error={errors.slug} />

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

export default EditTagModal;
