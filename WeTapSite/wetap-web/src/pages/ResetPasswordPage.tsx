import {ChevronLeft, ArrowRight, Lock} from 'lucide-react';
import {motion} from 'framer-motion';
import {useNavigate, useSearchParams} from "react-router-dom";
import React, {useState} from "react";
import {useResetPasswordMutation} from "../services/api/apiAccount.ts";

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = decodeURIComponent(searchParams.get("token") ?? "");
    const email = decodeURIComponent(searchParams.get("email") ?? "");

    const [errorMessage, setErrorMessage] = useState("");

    const [resetPassword] = useResetPasswordMutation();

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    })

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword.length < 8) {
            setErrorMessage("Закороткий пароль!");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("Паролі не збігаються!");
            return;
        }

        try {
            await resetPassword({newPassword: formData.newPassword, token, email}).unwrap();
            setErrorMessage("");
            navigate("/login");
        } catch (err) {
            console.log(err);
            setErrorMessage("Сталася помилка при зміні паролю");
        }
    };

    return (
        <div
            className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden py-12">

            {/* Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full"/>

            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                className="w-full max-w-xl z-10 px-6"
            >
                <button
                    onClick={() => navigate('/account')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
                    Назад до головного меню
                </button>

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black uppercase italic">
                        Відновлення <span className="text-red-600">паролю</span>
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-zinc-900/30 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md"
                >
                    <div>
                        <label className="text-[10px] uppercase text-zinc-500 ml-1">
                            Новий пароль
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"/>
                            <input
                                type="password"
                                required
                                className="w-full bg-black/40 rounded-2xl py-3.5 pl-12"
                                onChange={(e) =>
                                    setFormData({...formData, newPassword: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase text-zinc-500 ml-1">
                            Повторіть пароль
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"/>
                            <input
                                type="password"
                                required
                                className="w-full bg-black/40 rounded-2xl py-3.5 pl-12"
                                onChange={(e) =>
                                    setFormData({...formData, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2"
                    >
                        Підтвердити <ArrowRight/>
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

export default ResetPasswordPage;
