import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Mail, Send, CheckCircle2} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import {useForgotPasswordMutation} from "../../services/api/apiAccount";
import { InputField } from "../../components/form/InputField";
import { Button } from "../../components/form/Button";
import { BackButton } from "../../components/ui/common/BackButton";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";

function ForgotPasswordPage() {
    const [forgot, { isLoading }] = useForgotPasswordMutation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgot({email: email}).unwrap();
            setIsSubmitted(true);
            setErrorMessage("");
        } catch (err: any) {
            console.log("error", err);
            const msg = err?.data?.message || err?.data?.error || "Сталася помилка при відновленні паролю";
            setErrorMessage(msg);
        }
    };

    return (
        <div
            className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden px-6">
            {isLoading && <LoadingOverlay />}
            {/* Background Glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"/>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="w-full max-w-md z-10"
            >
                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        /* --- ФОРМА ЗАПИТУ --- */
                        <motion.div
                            key="request-form"
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 20}}
                            className="space-y-8"
                        >
                            <BackButton
                                label="Назад до входу"
                                onClick={() => navigate('/login')}
                                className="mb-4"
                            />

                            <div className="space-y-2">
                                <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                                    Забули <span className="text-red-600">пароль?</span>
                                </h1>
                                <p className="text-zinc-500 text-sm leading-relaxed">
                                    Введіть свою електронну пошту, і ми надішлемо вам посилання для створення нового
                                    пароля.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <InputField
                                    label="Email"
                                    type="email"
                                    required
                                    placeholder="example@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<Mail className="text-zinc-600 group-focus-within:text-red-600 transition-colors" size={20} />}
                                    inputClassName="bg-zinc-900/40 border border-white/5 focus:border-red-600 focus:ring-4 focus:ring-red-600/10 rounded-2xl py-4 pr-4 outline-none transition-all placeholder:text-zinc-700"
                                    labelClassName="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1"
                                    wrapperClassName="space-y-2 group"
                                />

                                {errorMessage && (
                                    <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
                                )}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="xl"
                                    fullWidth
                                    iconRight={<Send size={18} />}
                                >
                                    Надіслати посилання
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        /* --- ПОВІДОМЛЕННЯ ПРО УСПІХ --- */
                        <motion.div
                            key="success-message"
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            className="text-center space-y-6 bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl"
                        >
                            <div
                                className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-600/30">
                                <CheckCircle2 className="text-red-600" size={40}/>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Перевірте
                                    пошту</h2>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Ми надіслали інструкції для відновлення пароля на <span
                                    className="text-white font-bold">{email}</span>.
                                </p>
                            </div>
                            <Button
                                variant="linkSubtle"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Не отримали листа? Спробувати знову
                            </Button>
                            <div className="pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="xl"
                                    fullWidth
                                    onClick={() => navigate('/login')}
                                >
                                    Повернутися до входу
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default ForgotPasswordPage;
