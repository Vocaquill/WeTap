import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../../form/Button';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    maxWidth?: string;
    headerIcon?: ReactNode;
}

export function BaseModal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-lg',
    headerIcon,
}: BaseModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    />

                    {/* Modal container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`relative z-10 w-full ${maxWidth} bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl`}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {headerIcon && (
                                    <div className="p-2 bg-red-600/20 rounded-lg text-red-500">
                                        {headerIcon}
                                    </div>
                                )}
                                <h3 className="text-2xl font-black text-theme-text uppercase italic tracking-tight">
                                    {title}
                                </h3>
                            </div>
                            <Button variant="ghostIcon" onClick={onClose}>
                                <X size={24} />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default BaseModal;
