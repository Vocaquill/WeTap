import {useState, type ChangeEvent, type FormEvent} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {X} from 'lucide-react';

import {useRegisterMutation} from "../../services/api/apiAccount.ts";
import {useFormServerErrors} from "../../hooks/useFormServerErrors.ts";

import {InputField} from "../form/InputField";
import {FileUploadField} from '../form/FileUploadField';
import {Button} from "../form/Button";
import type {IRegister} from "../../types/Account/IRegister.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function AddUserModal({isOpen, onClose}: Props) {
    const [createUser, {isLoading}] = useRegisterMutation();
    const {errors, setServerErrors, clearError, clearAllErrors} = useFormServerErrors();

    const [form, setForm] = useState<IRegister>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        imageFile: undefined
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

        clearError(name);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({...prev, imageFile: e.target.files?.[0]}));
        clearError('image');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearAllErrors();

        try {
            await createUser(form).unwrap();
            setForm({firstName: '', lastName: '', email: '', password: '', imageFile: undefined});
            onClose();
        } catch (err: any) {
            if (err?.data?.errors) setServerErrors(err.data.errors);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} onClick={onClose}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"/>

                <motion.div initial={{scale: 0.95}} animate={{scale: 1}}
                            className="relative z-10 w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="text-2xl font-black text-white">Новий користувач</h3>
                        <Button variant="ghostIcon" onClick={onClose}><X size={24}/></Button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">

                        <div className="flex gap-4">
                            <InputField label="Ім'я" name="firstName" value={form.firstName} onChange={handleChange}
                                        error={errors.firstName} required/>
                            <InputField label="Прізвище" name="lastName" value={form.lastName} onChange={handleChange}
                                        error={errors.lastName} required/>
                        </div>

                        <div className="flex gap-4">
                            <InputField label="Електрона пошта" name="email" value={form.email} onChange={handleChange}
                                        error={errors.email} required/>
                            <InputField label="Пароль" type="password" name="password" value={form.password}
                                        onChange={handleChange} error={errors.password} required/>
                        </div>

                        <FileUploadField label="Фото" name="imageFile" onChange={handleFileChange} accept="image/*"
                                         error={errors.imageFile}/>

                        {form.imageFile && (
                            <img alt={form.email} src={URL.createObjectURL(form.imageFile)}
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
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default AddUserModal;