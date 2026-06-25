import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { message } from 'antd';

import {useLoginByGoogleMutation, useLoginMutation} from "../../services/api/apiAccount";
import { useGoogleLogin } from '@react-oauth/google';
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";
import { InputField } from "../../components/form/InputField";
import { Button } from "../../components/form/Button";
import type {ServerError} from "../../types/Account/ServerError.ts";
import type {ILogin} from "../../types/Account/ILogin.ts";

function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ILogin>({
        email: '',
        password: '',
    });

    const [login, { isLoading: isLoginLoading, isError }] = useLoginMutation();
    const [loginByGoogle, { isLoading: isGoogleLoading }] = useLoginByGoogleMutation();

    /* ================= EMAIL / PASSWORD LOGIN ================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(formData).unwrap();
            navigate('/');
        } catch (error) {
            const serverError = error as ServerError;

            if (serverError?.status === 400) {
                message.error('Неправильний логін або пароль');
            } else {
                message.error('Сталася помилка при вході');
            }
        }
    };

    /* ================= GOOGLE LOGIN ================= */
    const loginUseGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                await loginByGoogle(tokenResponse.access_token).unwrap();
                navigate('/');
            } catch (error) {
                const serverError = error as ServerError;

                if (serverError?.status === 400) {
                    message.error('Помилка входу через Google');
                } else {
                    message.error('Сталася помилка при вході');
                }
            }
        },
    });

    const GoogleIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
    );

    return (
        <div className="min-h-screen bg-theme-bg text-white flex items-center justify-center relative overflow-hidden">
            {(isLoginLoading || isGoogleLoading) && <LoadingOverlay />}

            {/* Background blur */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10 px-6"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center font-black text-2xl mb-4">
                        CW
                    </div>
                    <h1 className="text-3xl font-black uppercase italic">
                        Вітаємо у <span className="text-red-600">CounterWatch</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2">Введіть свої дані</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* EMAIL */}
                    <InputField
                        label="Email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        icon={<Mail className="text-zinc-500" size={20} />}
                        inputClassName="bg-zinc-900 rounded-2xl py-4"
                        labelClassName="text-xs text-zinc-400 uppercase ml-1"
                    />

                    {/* PASSWORD */}
                    <InputField
                        label="Пароль"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        icon={<Lock className="text-zinc-500" size={20} />}
                        inputClassName="bg-zinc-900 rounded-2xl py-4"
                        labelClassName="text-xs text-zinc-400 uppercase ml-1"
                    />

                    {isError && (
                        <p className="text-red-500 text-sm">Неправильний логін або пароль</p>
                    )}

                    <div className="text-right">
                        <Button
                            type="button"
                            variant="linkDanger"
                            onClick={() => navigate('/forgot-password')}
                        >
                            Забули пароль?
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="xl"
                        fullWidth
                        iconRight={<ArrowRight />}
                    >
                        Увійти
                    </Button>
                </form>

                {/* GOOGLE */}
                <Button
                    type="button"
                    variant="google"
                    size="xl"
                    fullWidth
                    className="mt-6"
                    icon={<GoogleIcon />}
                    onClick={() => loginUseGoogle()}
                >
                    Google
                </Button>

                {/* REGISTER */}
                <p className="text-center mt-6 text-zinc-500">
                    Немає акаунту?{' '}
                    <Button variant="linkPlain" onClick={() => navigate('/register')}>
                        Створити
                    </Button>
                </p>
            </motion.div>
        </div>
    );
}

export default LoginPage;
