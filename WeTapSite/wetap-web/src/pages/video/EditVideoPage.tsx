import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGetByQuery, useEditVideoMutation } from '../../services/api/apiVideos';
import type { IVideoEditRequest } from '../../types/Video/IVideoEditRequest';
import { VideoProcessingModal } from '../../components/modal/video/VideoProcessingModal';
import { VideoForm } from '../../components/video/VideoForm';
import LoadingOverlay from '../../components/ui/loading/LoadingOverlay';

export default function EditVideoPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const videoId = Number(id);

    const { data: video, isLoading: isLoadingVideo, isError } = useGetByQuery({ id: videoId }, {
        skip: !videoId
    });

    const [editVideo, { isLoading: isUpdating }] = useEditVideoMutation();
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [updatedSlug, setUpdatedSlug] = useState<string>('');
    const [uploadedNewVideo, setUploadedNewVideo] = useState<boolean>(false);

    if (isLoadingVideo) {
        return <LoadingOverlay />;
    }

    if (isError || !video) {
        return (
            <div className="p-6 text-center text-red-500 font-bold">
                Відео не знайдено або виникла помилка при завантаженні.
            </div>
        );
    }

    const handleSubmit = async (formValues: any) => {
        const hasNewVideo = !!formValues.video;
        setUploadedNewVideo(hasNewVideo);
        setUpdatedSlug(formValues.slug);

        const editRequest: IVideoEditRequest = {
            id: videoId,
            title: formValues.title,
            slug: formValues.slug,
            description: formValues.description,
            genreIds: formValues.genreIds,
            tagIds: formValues.tagIds,
            image: formValues.image instanceof File ? formValues.image : undefined,
            video: formValues.video instanceof File ? formValues.video : undefined,
            languageId: formValues.languageId,
            privacyId: formValues.privacyId,
        };

        const result = await editVideo(editRequest).unwrap();

        if (hasNewVideo) {
            setTrackingId(result.trackingId);
        } else {
            const fromAdmin = location.state?.fromAdmin;
            navigate(fromAdmin ? '/admin/videos' : '/studio');
        }
    };

    return (
        <>
            {uploadedNewVideo && trackingId && (
                <VideoProcessingModal trackingId={trackingId} videoSlug={updatedSlug} />
            )}

            <VideoForm
                key={video.id}
                title="Редагувати відео"
                submitButtonText="Зберегти"
                onSubmit={handleSubmit}
                isLoading={isUpdating}
                requireVideoFile={false}
                initialData={{
                    title: video.title,
                    slug: video.slug,
                    description: video.description,
                    genreIds: video.genres?.map(g => g.id) ?? [],
                    tagIds: video.tags?.map(t => t.id) ?? [],
                    languageId: video.language?.id ?? 1,
                    privacyId: video.privacy?.id ?? 1,
                }}
                initialTags={video.tags ?? []}
                initialImageUrl={video.image}
                initialVideoUrl={video.video}
            />
        </>
    );
}
