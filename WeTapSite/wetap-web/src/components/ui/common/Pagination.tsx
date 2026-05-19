import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
    range?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          currentPage,
                                                          totalPages,
                                                          onChange,
                                                          range = 1,
                                                      }) => {

    const generatePagination = () => {
        const pages: (number | string)[] = [];

        pages.push(1);

        const startPage = Math.max(2, currentPage - range);
        const endPage = Math.min(totalPages - 1, currentPage + range);

        if (startPage > 2) {
            pages.push('DOTS_LEFT');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) {
            pages.push('DOTS_RIGHT');
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    const paginationRange = generatePagination();

    return (
        <nav className="flex items-center justify-center gap-3">
            <button
                onClick={() => currentPage > 1 && onChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
                {paginationRange.map((item, index) => {
                    if (typeof item === 'string') {
                        return (
                            <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-zinc-600">
                <MoreHorizontal size={16} />
              </span>
                        );
                    }

                    const isSelected = item === currentPage;

                    return (
                        <button
                            key={index}
                            onClick={() => onChange(item)}
                            className={`
                                w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all
                                ${isSelected
                                ? 'bg-red-600 text-white ring-2 ring-white ring-inset'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                                }
                            `}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => currentPage < totalPages && onChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={20} />
            </button>
        </nav>
    );
};