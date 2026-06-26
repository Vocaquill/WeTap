import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Camera, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../../store/slices/authSlice";
import { useRegisterMutation } from "../../services/api/apiAccount";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";
import { InputField } from "../../components/form/InputField";
import { Button } from "../../components/form/Button";
import { BackButton } from "../../components/ui/common/BackButton";
import type {ServerError} from "../../types/Account/ServerError.ts";
import type {IRegister} from "../../types/Account/IRegister.ts";

function RegisterPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [register, { isLoading }] = useRegisterMutation();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    /* ================= IMAGE ================= */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const reg: IRegister={
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
        }
        if(imageFile){
            reg.imageFile = imageFile;
        }
        else {
            setErrorMessage("Оберіть фото");
            return;
        }

        try {
            const result = await register(reg).unwrap();
            dispatch(loginSuccess(result.token));
            navigate('/');
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Помилка реєстрації");
            const serverError = error as ServerError;

            if (serverError?.status === 400) {
                message.error('Перевірте введені дані');
            } else {
                message.error('Сталася помилка при створенні акаунта');
            }
        }
    };

    return (
        <div className="min-h-screen bg-theme-bg text-white flex items-center justify-center relative overflow-hidden py-12">
            {isLoading && <LoadingOverlay />}

            {/* Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl z-10 px-6"
            >
                <BackButton
                    label="Назад до входу"
                    onClick={() => navigate('/login')}
                />

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black uppercase italic">
                        Створити <span className="text-red-600">акаунт</span>
                    </h1>
                    <p className="text-zinc-500 mt-2">Приєднуйся до CounterWatch</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-zinc-900/30 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md"
                >
                    {/* AVATAR */}
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-24 h-24 rounded-3xl bg-zinc-800 border-2 border-dashed border-zinc-700 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-red-600"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} className="w-full h-full object-cover" />
                            ) : (
                                <Camera size={32} className="text-zinc-500 group-hover:text-red-600" />
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <span className="text-[10px] text-zinc-500 mt-3 font-bold uppercase">
              Фото профілю
            </span>
                    </div>

                    {/* NAMES */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {['firstName', 'lastName'].map((field, i) => (
                            <InputField
                                key={field}
                                label={i === 0 ? "Ім'я" : 'Прізвище'}
                                name={field}
                                required
                                value={formData[field as 'firstName' | 'lastName']}
                                onChange={(e) =>
                                    setFormData({ ...formData, [field]: e.target.value })
                                }
                                icon={<User className="text-zinc-600" size={20} />}
                                inputClassName="bg-black/40 rounded-2xl py-3.5"
                                labelClassName="text-[10px] uppercase text-zinc-500 ml-1"
                            />
                        ))}
                    </div>

                    {/* EMAIL */}
                    <InputField
                        label="Email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        icon={<Mail className="text-zinc-600" size={20} />}
                        inputClassName="bg-black/40 rounded-2xl py-3.5"
                        labelClassName="text-[10px] uppercase text-zinc-500 ml-1"
                    />

                    {/* PASSWORD */}
                    <InputField
                        label="Пароль"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        icon={<Lock className="text-zinc-600" size={20} />}
                        inputClassName="bg-black/40 rounded-2xl py-3.5"
                        labelClassName="text-[10px] uppercase text-zinc-500 ml-1"
                    />

                    {errorMessage && (
                        <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="xl"
                        fullWidth
                        iconRight={<ArrowRight />}
                    >
                        Створити акаунт
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}

export default RegisterPage;
