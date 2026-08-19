import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../layouts/logo.png';
import { useForgotPasswordMutation } from "../../services/api/apiAccount";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";

function ForgotPasswordPage() {
    const [forgot, { isLoading }] = useForgotPasswordMutation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            await forgot({ email }).unwrap();
            setIsSubmitted(true);
            setErrorMessage("");
        } catch (err: any) {
            const msg = err?.data?.message || err?.data?.error || "Сталася помилка при відновленні паролю";
            setErrorMessage(msg);
        }
    };

    return (
        <div className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-zinc-50))] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            {isLoading && <LoadingOverlay />}

            <div className="absolute top-1/4 left-1/2 -translate-x-[110%] -translate-y-1/2 w-[30rem] h-[30rem] bg-[#ff2a6d]/25 rounded-full blur-[120px] pointer-events-none" />

            <div className="absolute bottom-1/4 left-1/2 translate-x-[10%] translate-y-1/2 w-[30rem] h-[30rem] bg-[#3b82f6]/25 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-[rgb(var(--color-zinc-950)/0.8)] backdrop-blur-xl border border-[rgb(var(--color-zinc-700))] rounded-3xl p-8 shadow-2xl z-10 flex flex-col items-center transition-colors duration-300"
            >
                <div className="flex items-center gap-2 mb-8">
                    <img src={logoImg} alt="NexPlay Logo" className="h-8 w-auto object-contain" />
                    <span className="text-2xl font-bold tracking-tight text-[#ff2a6d]">NexPlay</span>
                </div>

                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="request-form"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="w-full flex flex-col items-center"
                        >
                            <h1 className="text-2xl font-bold text-center mb-1 text-[rgb(var(--color-zinc-50))]">Забули пароль?</h1>
                            <p className="text-[rgb(var(--color-zinc-400))] text-xs text-center mb-6">
                                Введіть свою електронну пошту, і ми надішлемо вам посилання для відновлення
                            </p>

                            <form onSubmit={handleSubmit} className="w-full space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-[rgb(var(--color-zinc-200))]">Електронна пошта</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Введіть ваш email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[rgb(var(--color-zinc-800))] text-[rgb(var(--color-zinc-50))] placeholder-[rgb(var(--color-zinc-400))] px-4 py-2.5 rounded-full text-sm outline-none border border-[rgb(var(--color-zinc-700))] focus:border-[#ff2a6d] focus:ring-2 focus:ring-[#ff2a6d] transition-all"
                                    />
                                </div>

                                {errorMessage && (
                                    <p className="text-red-500 text-xs font-medium text-center pt-1">{errorMessage}</p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-[#ff2a6d] hover:bg-[#e0245e] text-white font-semibold py-2.5 rounded-full text-sm transition-all shadow-md shadow-[#ff2a6d]/20 mt-2 cursor-pointer"
                                >
                                    Надіслати посилання
                                </button>
                            </form>

                            <p className="text-xs text-[rgb(var(--color-zinc-400))] mt-6">
                                Повернутися до{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-[#ff2a6d] hover:underline font-medium cursor-pointer"
                                >
                                    Увійти
                                </button>
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-message"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full flex flex-col items-center text-center py-2"
                        >
                            <div className="w-14 h-14 bg-[#ff2a6d]/20 rounded-full flex items-center justify-center mb-4 border border-[#ff2a6d]/30">
                                <CheckCircle2 className="text-[#ff2a6d]" size={32} />
                            </div>

                            <h2 className="text-xl font-bold mb-2 text-[rgb(var(--color-zinc-50))]">Перевірте вашу пошту</h2>
                            <p className="text-[rgb(var(--color-zinc-400))] text-xs leading-relaxed mb-6">
                                Ми надіслали інструкції з відновлення пароля на <br />
                                <span className="text-[rgb(var(--color-zinc-50))] font-medium">{email}</span>
                            </p>

                            <button
                                type="button"
                                onClick={() => setIsSubmitted(false)}
                                className="text-xs text-[rgb(var(--color-zinc-400))] hover:text-[rgb(var(--color-zinc-50))] transition-colors mb-4 cursor-pointer"
                            >
                                Не отримали лист? Спробувати знову
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="w-full bg-[#ff2a6d] hover:bg-[#e0245e] text-white font-semibold py-2.5 rounded-full text-sm transition-all shadow-md shadow-[#ff2a6d]/20 cursor-pointer"
                            >
                                Повернутися до входу
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default ForgotPasswordPage;
