import {User, Mail, ChevronLeft, Camera, ArrowRight} from 'lucide-react';
import {motion} from 'framer-motion';
import LoadingOverlay from "../components/ui/loading/LoadingOverlay.tsx";
import {useAppDispatch, useAppSelector} from "../store";
import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {APP_ENV} from "../env";
import type {IUserEdit} from "../types/user.ts";
import {useEditAccountMutation} from "../services/api/apiAccount.ts";
import {loginSuccess} from "../store/slices/authSlice.ts";

function EditProfilePage() {
    const {user} = useAppSelector(state => state.auth);
    const [edit, {isLoading }] = useEditAccountMutation()
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        firstName: user!.name.split(" ")[1],
        lastName: user!.name.split(" ")[0],
        email: user!.email,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        user?.image ? APP_ENV.IMAGES_400_URL + user.image : null
    );
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const value: IUserEdit = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email
        }
        if(imageFile){
            value.image = imageFile;
        }
        try{
            const res = await edit(value).unwrap();
            dispatch(loginSuccess(res.token));
            navigate('/account');
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden py-12">
            {isLoading && <LoadingOverlay/>}

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
                    Назад до акаунту
                </button>

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black uppercase italic">
                        Редагувати <span className="text-red-600">акаунт</span>
                    </h1>
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
                                <img src={imagePreview} className="w-full h-full object-cover"/>
                            ) : (
                                <Camera size={32} className="text-zinc-500 group-hover:text-red-600"/>
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
                    <div>
                        <label className="text-[10px] uppercase text-zinc-500 ml-1">
                            Ім'я
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"/>
                            <input
                                required
                                value={formData.firstName}
                                className="w-full bg-black/40 rounded-2xl py-3.5 pl-12"
                                onChange={(e) =>
                                    setFormData({...formData, firstName: e.target.value})
                                }
                            />
                        </div>
                    </div>

                    {/* LASTNAME */}
                    <div>
                        <label className="text-[10px] uppercase text-zinc-500 ml-1">
                            Прізвище
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"/>
                            <input
                                required
                                value={formData.lastName}
                                className="w-full bg-black/40 rounded-2xl py-3.5 pl-12"
                                onChange={(e) =>
                                    setFormData({...formData, lastName: e.target.value})
                                }
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="text-[10px] uppercase text-zinc-500 ml-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"/>
                            <input
                                type="email"
                                value={formData.email}
                                required
                                className="w-full bg-black/40 rounded-2xl py-3.5 pl-12"
                                onChange={(e) =>
                                    setFormData({...formData, email: e.target.value})
                                }
                            />
                        </div>
                    </div>

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

export default EditProfilePage;
