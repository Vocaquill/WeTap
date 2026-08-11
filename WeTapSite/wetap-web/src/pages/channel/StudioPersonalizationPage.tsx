import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { InputField } from '../../components/form/InputField';
import { FileUploadField } from '../../components/form/FileUploadField';
import { Button } from '../../components/form/Button';
import { useGetByQuery, useUpdateChannelMutation } from '../../services/api/apiChannels';
import { useAppSelector } from '../../store';
import type { IChannelUpdateModel } from '../../types/Channel/IChannelUpdateModel';

export default function StudioPersonalizationPage() {
    const { user } = useAppSelector((state) => state.auth);
    const channelId = user?.channelId ?? user?.id;

    const { data: channel, isLoading: isChannelLoading } = useGetByQuery(
        { id: channelId! },
        { skip: !channelId }
    );
    const [updateChannel, { isLoading: isUpdating }] = useUpdateChannelMutation();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<IChannelUpdateModel>({
        defaultValues: {
            id: channelId,
            name: '',
            nickName: '',
            description: '',
        }
    });

    useEffect(() => {
        if (channel) {
            reset({
                id: channel.id,
                name: channel.name,
                nickName: channel.nickName,
                description: channel.description || '',
            });
        }
    }, [channel, reset]);

    const onSubmit = async (data: IChannelUpdateModel) => {
        try {
            setSubmitError(null);
            await updateChannel(data).unwrap();
        } catch (error: any) {
            console.error(error);
            setSubmitError('Не вдалося оновити канал. Перевірте дані та спробуйте ще раз.');
        }
    };

    if (isChannelLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="animate-spin text-zinc-500" size={40} />
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">

                <div className="mb-8 border-b border-zinc-800 pb-5">
                    <h1 className="text-3xl font-bold text-zinc-100">Персоналізація каналу</h1>
                    <p className="text-zinc-400 mt-2 text-sm">
                        Налаштуйте вигляд вашого каналу: змініть назву, опис, аватар та банер.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {submitError && (
                        <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
                            {submitError}
                        </div>
                    )}

                    <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 space-y-6">
                        <h2 className="text-xl font-semibold text-zinc-200">Основна інформація</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Назва каналу"
                                placeholder="Введіть назву..."
                                error={errors.name?.message}
                                {...register("name", { required: "Назва каналу є обов'язковою" })}
                            />

                            <InputField
                                label="Нікнейм (@)"
                                placeholder="Наприклад: my_channel_123"
                                error={errors.nickName?.message}
                                {...register("nickName", { required: "Нікнейм є обов'язковим" })}
                            />
                        </div>

                        <InputField
                            label="Опис каналу"
                            placeholder="Розкажіть глядачам про ваш канал..."
                            error={errors.description?.message}
                            {...register("description")}
                        />
                    </div>

                    <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 space-y-6">
                        <h2 className="text-xl font-semibold text-zinc-200">Брендування</h2>

                        <div className="space-y-8">
                            <Controller
                                name="avatarImage"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                        <FileUploadField
                                            label="Аватар профілю"
                                            name={field.name}
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                field.onChange(file);
                                            }}
                                            error={errors.avatarImage?.message ? [errors.avatarImage.message] : undefined}
                                        />
                                        <span className="text-xs text-zinc-500">Рекомендований розмір 400x400 px. Формати: JPG, PNG.</span>
                                    </div>
                                )}
                            />

                            <hr className="border-zinc-800" />

                            <Controller
                                name="bannerImage"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                        <FileUploadField
                                            label="Банер каналу"
                                            name={field.name}
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                field.onChange(file);
                                            }}
                                            error={errors.bannerImage?.message ? [errors.bannerImage.message] : undefined}
                                        />
                                        <span className="text-xs text-zinc-500">Рекомендований розмір 2048x1152 px. Відображається у верхній частині сторінки.</span>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 pb-12">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={isUpdating}
                            icon={<Save size={18} />}
                        >
                            {isUpdating ? 'Збереження...' : 'Зберегти зміни'}
                        </Button>
                    </div>
                </form>

            </div>
        </PageTransition>
    );
}