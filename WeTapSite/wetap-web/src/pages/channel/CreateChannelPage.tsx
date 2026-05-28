import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateChannelMutation } from "../../services/api/apiChannels";
import { useRefreshTokenMutation } from "../../services/api/apiAccount";
import { InputField } from "../../components/form/InputField";
import { TextAreaField } from "../../components/form/TextAreaField";
import { FileUploadField } from "../../components/form/FileUploadField";
import { Button } from "../../components/form/Button";
import { useFormServerErrors } from "../../hooks/useFormServerErrors";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";
import { slugify } from "../../utils/slugify";
import { ArrowRight, Tv } from "lucide-react";
import type { IChannelCreateRequest } from "../../types/Channel/IChannelCreateRequest";

function CreateChannelPage() {
    const navigate = useNavigate();
    const [createChannel, { isLoading }] = useCreateChannelMutation();
    const [refreshToken] = useRefreshTokenMutation();

    const {
        errors,
        setServerErrors,
        clearError,
        clearAllErrors,
    } = useFormServerErrors();

    const [form, setForm] = useState<IChannelCreateRequest>({
        name: "",
        nickName: "",
        description: "",
        avatarImage: null,
        bannerImage: null,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setForm(prev => {
            const nextState = { ...prev, [name]: value };

            if (name === "name") {
                nextState.nickName = slugify(value);
            }

            return nextState;
        });

        clearError(name);
        if (name === "name") clearError("nickName");
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        setForm(prev => ({ ...prev, [name]: files?.[0] || null }));
        clearError(name);
    };

    const validateClient = () => {
        const validationErrors: Record<string, string[]> = {};

        if (!form.name.trim()) validationErrors.name = ["Назва каналу обов'язкова"];
        if (!form.nickName.trim()) validationErrors.nickName = ["Нікнейм каналу обов'язковий"];

        if (Object.keys(validationErrors).length) {
            setServerErrors(validationErrors);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearAllErrors();

        if (!validateClient()) return;

        try {
            await createChannel(form).unwrap();
            await refreshToken().unwrap();
            navigate("/account");
        } catch (err: any) {
            if (err?.data?.errors) {
                setServerErrors(err.data.errors);
            } else if (err?.data?.message) {
                // If it's a general message, e.g. "Канал з таким Id вже існує" or "У користувача вже є канал"
                setServerErrors({ name: [err.data.message] });
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#121213] text-white flex items-center justify-center relative overflow-hidden py-12">
            {isLoading && <LoadingOverlay />}

            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/30 blur-[120px] rounded-full" />

            <div className="w-full max-w-2xl z-10 px-6">
                <div className="mb-10 text-center">
                    <div className="inline-flex p-4 bg-zinc-900 rounded-3xl border border-white/5 mb-4 shadow-xl">
                        <Tv size={36} className="text-red-600 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tight">
                        Створити <span className="text-red-600">канал</span>
                    </h1>
                    <p className="text-zinc-400 mt-2 text-sm">
                        Заповніть інформацію нижче, щоб розпочати свій творчий шлях на WeTap
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-5">
                            <InputField
                                label="Назва каналу"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                error={errors.name}
                                placeholder="Мій крутий канал"
                                inputClassName="w-full bg-black/40 rounded-2xl py-3.5 border-zinc-800 focus:border-red-600"
                                labelClassName="text-[10px] uppercase text-zinc-500 ml-1 font-bold tracking-wider"
                            />

                            <InputField
                                label="Унікальний нікнейм (Slug)"
                                name="nickName"
                                value={form.nickName}
                                onChange={handleChange}
                                required
                                error={errors.nickName}
                                placeholder="my-cool-channel"
                                inputClassName="w-full bg-black/40 rounded-2xl py-3.5 border-zinc-800 focus:border-red-600"
                                labelClassName="text-[10px] uppercase text-zinc-500 ml-1 font-bold tracking-wider"
                            />

                            <TextAreaField
                                label="Опис каналу"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                error={errors.description}
                                placeholder="Розкажіть глядачам про свій канал..."
                                rows={4}
                            />
                        </div>

                        <div className="space-y-5 flex flex-col justify-between">
                            <div className="space-y-5">
                                <FileUploadField
                                    label="Аватар каналу"
                                    name="avatarImage"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    error={errors.avatarImage}
                                />

                                <FileUploadField
                                    label="Банер каналу"
                                    name="bannerImage"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    error={errors.bannerImage}
                                />
                            </div>

                            <div className="pt-4 md:pt-0">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="xl"
                                    fullWidth
                                    iconRight={<ArrowRight />}
                                >
                                    Створити канал
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateChannelPage;
