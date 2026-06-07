import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useCreateLanguageMutation } from '../../../services/api/apiLanguages';
import { useFormServerErrors } from "../../../hooks/useFormServerErrors";
import type { ILanguageCreateRequest } from '../../../types/Language/ILanguageCreateRequest';
import { InputField } from "../../form/InputField";
import { Button } from "../../form/Button";
import { BaseModal } from '../common/BaseModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function AddLanguageModal({ isOpen, onClose }: Props) {
    const [createLanguage, { isLoading }] = useCreateLanguageMutation();
    const { errors, setServerErrors, clearError, clearAllErrors } = useFormServerErrors();

    const [form, setForm] = useState<ILanguageCreateRequest>({
        name: '',
        languageCode: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        clearError(name);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearAllErrors();

        try {
            await createLanguage(form).unwrap();
            setForm({ name: '', languageCode: '' });
            onClose();
        } catch (err: any) {
            if (err?.data?.errors) setServerErrors(err.data.errors);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Нова мова"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Назва" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
                <InputField label="Код мови" name="languageCode" value={form.languageCode} onChange={handleChange} error={errors.languageCode} required placeholder="uk, en, de..." />

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

export default AddLanguageModal;
