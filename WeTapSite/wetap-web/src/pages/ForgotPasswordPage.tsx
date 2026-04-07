import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Mail, ArrowLeft, Send, CheckCircle2} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import {useForgotPasswordMutation} from "../services/api/apiAccount.ts"; // Імпортуємо фон
function ForgotPasswordPage() {
    const [forgot] = useForgotPasswordMutation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgot({email: email}).unwrap();
            setIsSubmitted(true);
        } catch (err) {
            console.log("error", err);
            alert("Login failed");
        }
    };

    return (
        <div
            className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden px-6">
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
                            <button
                                onClick={() => navigate('/login')}
                                className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/>
                                <span className="text-[10px] font-black uppercase tracking-widest">Назад до входу</span>
                            </button>

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
                                <div className="space-y-2">
                                    <label
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors"
                                            size={20}/>
                                        <input
                                            type="email"
                                            required
                                            placeholder="example@mail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-zinc-900/40 border border-white/5 focus:border-red-600 focus:ring-4 focus:ring-red-600/10 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-zinc-700"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase py-4 rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Надіслати посилання <Send size={18}/>
                                </button>
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
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-600 transition-colors"
                            >
                                Не отримали листа? Спробувати знову
                            </button>
                            <div className="pt-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase rounded-2xl border border-white/10 transition-all"
                                >
                                    Повернутися до входу
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default ForgotPasswordPage;
