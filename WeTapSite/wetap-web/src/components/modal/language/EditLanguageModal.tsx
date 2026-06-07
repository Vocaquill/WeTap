import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useEditLanguageMutation } from '../../../services/api/apiLanguages';
import { useFormServerErrors } from "../../../hooks/useFormServerErrors";
import type { ILanguageItemResponse } from '../../../types/Language/ILanguageItemResponse';
import type { ILanguageEditRequest } from '../../../types/Language/ILanguageEditRequest';
import { InputField } from '../../form/InputField';
import { Button } from '../../form/Button';
import { BaseModal } from '../common/BaseModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    language: ILanguageItemResponse | null;
}

function EditLanguageModal({ isOpen, onClose, language }: Props) {
    const [editLanguage, { isLoading }] = useEditLanguageMutation();
    const { errors, setServerErrors, clearError, clearAllErrors } = useFormServerErrors();

    const [form, setForm] = useState<ILanguageEditRequest | null>(null);

    if (!isOpen) {
        if (form) setForm(null);
        return null;
    }

    if (!language) return null;

    if (!form || form.id !== language.id) {
        setForm({
            id: language.id,
            name: language.name,
            languageCode: language.languageCode,
        });
        return null;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => prev ? ({ ...prev, [name]: value }) : null);
        clearError(name);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearAllErrors();
        try {
            await editLanguage(form).unwrap();
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
                    <span className="text-2xl font-black text-white">Редагувати мову</span>
                    <p className="text-xs text-zinc-500 font-mono italic normal-case not-italic tracking-normal mt-0.5">ID: #{language.id}</p>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Назва" name="name" value={form.name} onChange={handleChange} error={errors.name} />
                <InputField label="Код мови" name="languageCode" value={form.languageCode} onChange={handleChange} error={errors.languageCode} placeholder="uk, en, de..." />

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

export default EditLanguageModal;
