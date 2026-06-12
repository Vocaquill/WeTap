import {useState, type ChangeEvent, type FormEvent} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {X} from 'lucide-react';
import {slugify} from '../../utils/slugify';

import {useFormServerErrors} from "../../hooks/useFormServerErrors";
import {InputField} from '../form/InputField';
import {FileUploadField} from '../form/FileUploadField';
import {Button} from '../form/Button';
import {APP_ENV} from '../../env/index';
import type {IUserItemResponse} from "../../types/User/IUserItemResponse.ts";
import type {IUserEditRequest} from "../../types/User/IUserEditRequest.ts";
import {useEditUserMutation} from "../../services/api/apiUsers.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: IUserItemResponse | null;
}

function EditUserModal({isOpen, onClose, user}: Props) {
    const [editUser, {isLoading}] = useEditUserMutation();
    const {errors, setServerErrors, clearError, clearAllErrors} = useFormServerErrors();

    const [form, setForm] = useState<IUserEditRequest | null>(null);

    if (!isOpen) {
        if (form) setForm(null); // Скидаємо стейт, коли модалка закрита
        return null;
    }

    if (!user) return null;

    if (!form || form.id !== user.id) {
        setForm({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image: undefined,
            roles: user.roles,
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
            await editUser(form).unwrap();
            onClose();
        } catch (err: any) {
            if (err?.data?.errors) setServerErrors(err.data.errors);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}/>

                <motion.div initial={{scale: 0.95}} animate={{scale: 1}}
                            className="relative z-10 w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-black text-white">Редагувати</h3>
                            <p className="text-xs text-zinc-500 font-mono italic">ID: #{user.id}</p>
                        </div>
                        <Button variant="ghostIcon" onClick={onClose}><X size={24}/></Button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <InputField label="Електрона пошта" name="email" value={form.email} onChange={handleChange}
                                    error={errors.email}/>
                        <InputField label="Ім'я" name="firstName" value={form.firstName} onChange={handleChange}
                                    error={errors.firstName}/>
                        <InputField label="Прізвище" name="lastName" value={form.lastName} onChange={handleChange}
                                    error={errors.lastName}/>
                        <FileUploadField label="Змінити фото" name="image" onChange={handleFileChange} accept="image/*"
                                         error={errors.image}/>

                        <div className="mt-2">
                            {form.image ? (
                                <img src={URL.createObjectURL(form.image)}
                                     className="w-full h-32 object-cover rounded-xl border border-red-600/50"/>
                            ) : user.image ? (
                                <img src={APP_ENV.IMAGES_400_URL + user.image}
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
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default EditUserModal;