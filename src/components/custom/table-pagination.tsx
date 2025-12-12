import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import type { Pagination as PaginationType } from "@/types";

interface PaginationProps {
    pagination: PaginationType
    onPageChange: (page: number) => void;
}

export function TablePagination({
    pagination,
    onPageChange,
}: PaginationProps) {
    const { totalPages, currentPage } = pagination
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <Pagination className="justify-end mt-4">
            <PaginationContent>

                <PaginationItem>
                    <PaginationPrevious
                        onClick={handlePrev}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                        <PaginationItem key={pageNum}>
                            <PaginationLink
                                isActive={pageNum === currentPage}
                                onClick={() => onPageChange(pageNum)}
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext
                        onClick={handleNext}
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    );
}
