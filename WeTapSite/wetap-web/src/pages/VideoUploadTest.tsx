import React, { useState } from 'react';
import { Card, Button, Upload, Progress, Typography, Space, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateVideoMutation } from '../services/api/apiVideos';
import { useVideoProgress } from '../hooks/useVideoProgress';
import type {IVideoCreateRequest} from "../types/Video/IVideoCreateRequest.ts";

const { Text } = Typography;

const VideoUploadTest: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [createVideo, { isLoading }] = useCreateVideoMutation();
    const { progress, isConnected } = useVideoProgress(trackingId);

    const handleUpload = async () => {
        if (!file) {
            message.error('Будь ласка, виберіть відео файл');
            return;
        }

        const model: IVideoCreateRequest = {
            title: "Test Video " + new Date().getTime(),
            slug: "test-video-" + new Date().getTime(),
            description: "Default description for testing SignalR progress",
            genreIds: [1],
            tagIds: [1],
            video: file,
            languageId: 2,
            privacyId: 1,
        };

        try {
            const result = await createVideo(model).unwrap();
            setTrackingId(result.trackingId);
            message.success('Завантаження розпочато! Tracking ID: ' + result.trackingId);
        } catch (err: any) {
            message.error('Помилка при створенні відео: ' + (err.data?.message || err.message));
        }
    };

    return (
        <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
            <Card title="Тест завантаження відео з SignalR" style={{ width: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Text strong>Статус підключення до Hub: </Text>
                        <Text type={isConnected ? "success" : "danger"}>
                            {isConnected ? "Підключено" : "Відключено"}
                        </Text>
                    </div>

                    <Upload
                        beforeUpload={(file) => {
                            setFile(file);
                            return false;
                        }}
                        maxCount={1}
                        accept="video/*"
                    >
                        <Button icon={<UploadOutlined />}>Вибрати відео</Button>
                    </Upload>

                    <Button 
                        type="primary" 
                        onClick={handleUpload} 
                        loading={isLoading}
                        disabled={!file}
                        block
                    >
                        Надіслати на сервер
                    </Button>

                    {trackingId && (
                        <Card type="inner" title="Прогрес з сервера">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <Text strong>Tracking ID: </Text>
                                    <Text code>{trackingId}</Text>
                                </div>
                                
                                {progress ? (
                                    <>
                                        <Progress 
                                            percent={Math.round(progress.percentage)} 
                                            status={progress.status === 'Completed' ? 'success' : 'active'} 
                                        />
                                        <div>
                                            <Text strong>Статус: </Text>
                                            <Text>{progress.status}</Text>
                                        </div>
                                        <div>
                                            <Text strong>Залишилось часу: </Text>
                                            <Text>{progress.estimatedTimeRemaining}</Text>
                                        </div>
                                    </>
                                ) : (
                                    <Text italic>Очікування оновлень прогресу...</Text>
                                )}
                            </Space>
                        </Card>
                    )}
                </Space>
            </Card>
        </div>
    );
};

export default VideoUploadTest;
