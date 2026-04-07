import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import type {FC} from "react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
}

const DeleteModal: FC<DeleteModalProps> = ({
                                               isOpen,
                                               onClose,
                                               onConfirm,
                                               title,
                                               description,
                                               isLoading = false,
                                           }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isLoading ? onClose : undefined}
                        className="absolute inset-0 bg-black/95 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative z-10 w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl"
                    >
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-600/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-600/5">
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={40} />
                                ) : (
                                    <AlertCircle size={40} strokeWidth={2.5} />
                                )}
                            </div>

                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                                {title}
                            </h3>

                            <p className="text-zinc-500 leading-relaxed px-2">
                                {description}
                            </p>
                        </div>

                        <div className="mt-8 flex flex-col gap-3">
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all active:scale-[0.97] disabled:opacity-50 shadow-lg shadow-red-600/20"
                            >
                                {isLoading ? 'ВИДАЛЕННЯ...' : 'ТАК, ВИДАЛИТИ'}
                            </button>

                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold rounded-2xl transition-all active:scale-[0.97]"
                            >
                                СКАСУВАТИ
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;