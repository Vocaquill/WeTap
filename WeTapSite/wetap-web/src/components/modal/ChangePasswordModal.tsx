import {motion, AnimatePresence} from "framer-motion";
import {X, Lock} from "lucide-react";
import React, {useState} from "react";
import {useChangePasswordMutation} from "../../services/api/apiAccount.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({isOpen, onClose}: Props) {
    const [changePassword] = useChangePasswordMutation();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("Паролі не збігаються!");
            return;
        }

        try {
            await changePassword({newPassword: formData.newPassword, oldPassword: formData.oldPassword}).unwrap();
            setErrorMessage("");
            onClose();
        } catch (err) {
            console.log("Помилка при зміні паролю", err);
            setErrorMessage("Сталася помилка при зміні паролю");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* modal */}
                    <motion.div
                        initial={{scale: 0.9, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.9, opacity: 0}}
                        transition={{duration: 0.2}}
                        className="relative z-10 w-full max-w-md rounded-[2.5rem] bg-zinc-900 border border-white/10 p-8"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-600/20 rounded-lg text-red-500">
                                    <Lock size={20}/>
                                </div>
                                <h2 className="text-lg font-black uppercase italic tracking-tight">
                                    Зміна паролю
                                </h2>
                            </div>

                            <button
                                onClick={onClose}
                                className="text-zinc-500 hover:text-red-500 transition"
                            >
                                <X size={20}/>
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4">
                            <input
                                type="password"
                                placeholder="Поточний пароль"
                                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                                onChange={(e) =>
                                    setFormData({...formData, oldPassword: e.target.value})}
                            />
                            <input
                                type="password"
                                placeholder="Новий пароль"
                                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                                onChange={(e) =>
                                    setFormData({...formData, newPassword: e.target.value})}
                            />
                            <input
                                type="password"
                                placeholder="Підтвердіть пароль"
                                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                                onChange={(e) =>
                                    setFormData({...formData, confirmPassword: e.target.value})}
                            />

                            {errorMessage && (
                                <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full mt-4 bg-red-600 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition"
                            >
                                Змінити пароль
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
