const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
            <div className="relative flex items-center justify-center">

                <div className="absolute h-24 w-24 rounded-full border-4 border-red-600/40 border-t-red-600 animate-spin-slow" />

                <div className="absolute h-20 w-20 rounded-full bg-red-600/10 animate-pulse" />

                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-2xl animate-play-pulse">
                    <div className="ml-1 h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white" />
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
