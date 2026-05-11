import React, { useState, useRef, useEffect } from 'react';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Settings,
    RotateCcw,
    RotateCw,
} from 'lucide-react';
import { APP_ENV } from "../../env";

interface MoviePlayerProps {
    videoName?: string;
    src?: string;
}

type Quality = '1080' | '720' | '480' | '360';

export function MoviePlayer({ videoName, src }: MoviePlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [quality, setQuality] = useState<Quality>('1080');
    const [showSettings, setShowSettings] = useState(false);

    const controlsTimeoutRef = useRef<number | null>(null);

    const qualities: Quality[] = ['1080', '720', '480', '360'];

    const getUrlForQuality = (q: Quality) => {
        if (src) return src;
        if (!videoName) return '';
        switch (q) {
            case '1080': return APP_ENV.VIDEO_1080_URL + videoName;
            case '720': return APP_ENV.VIDEO_720_URL + videoName;
            case '480': return APP_ENV.VIDEO_480_URL + videoName;
            case '360': return APP_ENV.VIDEO_360_URL + videoName;
            default: return APP_ENV.VIDEO_1080_URL + videoName;
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (videoRef.current) {
            videoRef.current.volume = val;
            setIsMuted(val === 0);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            setIsMuted(newMuted);
            videoRef.current.muted = newMuted;
            if (!newMuted && volume === 0) {
                setVolume(0.5);
                videoRef.current.volume = 0.5;
            }
        }
    };

    const toggleFullscreen = () => {
        if (containerRef.current) {
            if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    const changeQuality = (newQuality: Quality) => {
        if (videoRef.current) {
            const prevTime = videoRef.current.currentTime;
            const prevIsPlaying = isPlaying;
            setQuality(newQuality);
            setShowSettings(false);

            const handleCanPlay = () => {
                if (videoRef.current) {
                    videoRef.current.currentTime = prevTime;
                    if (prevIsPlaying) videoRef.current.play();
                    videoRef.current.removeEventListener('canplay', handleCanPlay);
                }
            };
            videoRef.current.addEventListener('canplay', handleCanPlay);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            window.clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = window.setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                window.clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    const skip = (amount: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
        }
    };

    return (
        <div 
            ref={containerRef}
            className="relative group rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={getUrlForQuality(quality)}
                className="w-full h-full cursor-pointer"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                playsInline
            />

            {!isPlaying && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                    onClick={togglePlay}
                >
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                        <Play fill="white" size={40} className="ml-1" />
                    </div>
                </div>
            )}

            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-8 pb-1 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>

                <div className="flex items-center justify-between px-4 mb-2">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
                            {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                        </button>
                        
                        <div className="flex items-center gap-2">
                             <button onClick={() => skip(-10)} className="text-white/70 hover:text-white">
                                <RotateCcw size={20} />
                             </button>
                             <button onClick={() => skip(10)} className="text-white/70 hover:text-white">
                                <RotateCw size={20} />
                             </button>
                        </div>

                        <div className="flex items-center gap-2 group/volume ml-2">
                            <button onClick={toggleMute} className="text-white hover:text-red-500 transition-colors">
                                {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
                            </button>
                            <div className="w-0 overflow-hidden group-hover/volume:w-24 group-hover/volume:ml-2 transition-all duration-300 flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-24 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-red-600"
                                />
                            </div>
                        </div>

                        <div className="text-white text-sm font-medium ml-2">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        {!src && (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowSettings(!showSettings)}
                                    className={`text-white hover:text-red-500 transition-all duration-300 ${showSettings ? 'rotate-90 text-red-500' : ''}`}
                                >
                                    <Settings size={24} />
                                </button>

                                {showSettings && (
                                    <div className="absolute bottom-full right-0 mb-4 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl min-w-[120px]">
                                        <div className="p-2 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                            Якість
                                        </div>
                                        {qualities.map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => changeQuality(q)}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors ${quality === q ? 'text-red-500 font-bold' : 'text-white'}`}
                                            >
                                                {q}p
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <button onClick={toggleFullscreen} className="text-white hover:text-red-500 transition-colors">
                            <Maximize />
                        </button>
                    </div>
                </div>

                <div className="px-4 pb-2 relative">
                    <div className="relative w-full h-1.5 flex items-center group/progress">
                        <div className="absolute w-full h-1 bg-zinc-600 rounded-full" />

                        <div
                            className="absolute h-1 bg-red-600 rounded-full pointer-events-none z-10"
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        />

                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            step="any"
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute w-full h-6 opacity-0 cursor-pointer z-20"
                        />

                        <div
                            className="absolute h-3 w-3 bg-red-600 rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity pointer-events-none z-10"
                            style={{
                                left: `calc(${(currentTime / (duration || 1)) * 100}% - 6px)`
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
