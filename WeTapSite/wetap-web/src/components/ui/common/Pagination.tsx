import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '../../form/Button';

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
            <Button
                variant="paginationNav"
                onClick={() => currentPage > 1 && onChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft size={20} />
            </Button>

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
                        <Button
                            key={index}
                            variant="paginationPage"
                            active={isSelected}
                            onClick={() => onChange(item)}
                        >
                            {item}
                        </Button>
                    );
                })}
            </div>

            <Button
                variant="paginationNav"
                onClick={() => currentPage < totalPages && onChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight size={20} />
            </Button>
        </nav>
    );
};
