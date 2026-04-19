import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { APP_ENV } from "../env";
import type { IVideoProgressUpdate } from "../types/video.ts";

export const useVideoProgress = (trackingId: string | null) => {
    const [progress, setProgress] = useState<IVideoProgressUpdate | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${APP_ENV.API_BASE_URL}/videoProgressHub`)
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveProgress", (update: IVideoProgressUpdate) => {
            console.log("Progress received:", update);
            setProgress(update);
        });

        const startConnection = async () => {
            try {
                await connection.start();
                console.log("SignalR Connected.");
                setIsConnected(true);
                connectionRef.current = connection;

                if (trackingId) {
                    await connection.invoke("JoinChannel", trackingId);
                    console.log(`Joined channel: ${trackingId}`);
                }
            } catch (err) {
                console.error("SignalR Connection Error: ", err);
                setTimeout(startConnection, 5000);
            }
        };

        startConnection();

        return () => {
            if (connectionRef.current) {
                if (trackingId) {
                    connectionRef.current.invoke("LeaveChannel", trackingId).catch(console.error);
                }
                connectionRef.current.stop();
            }
        };
    }, [trackingId]);

    // Якщо trackingId змінився, приєднуємося до нового каналу
    useEffect(() => {
        if (isConnected && trackingId && connectionRef.current) {
            connectionRef.current.invoke("JoinChannel", trackingId).catch(console.error);
        }
    }, [trackingId, isConnected]);

    return { progress, isConnected };
};
