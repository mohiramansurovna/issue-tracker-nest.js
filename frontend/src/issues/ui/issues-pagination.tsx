import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {ChevronsLeft, ChevronsRight} from 'lucide-react';

type Props = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function IssuesPagination({page, totalPages, onPageChange}: Props) {
    const pages = Array.from({length: totalPages}, (_, i) => i + 1);

    return (
        <Pagination className='mt-6'>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink onClick={() => onPageChange(1)} isActive={false}>
                        <ChevronsLeft></ChevronsLeft>
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationPrevious onClick={() => onPageChange(Math.max(1, page - 1))} />
                </PaginationItem>

                {pages.map(p => (
                    <PaginationItem key={p}>
                        <PaginationLink isActive={p === page} onClick={() => onPageChange(p)}>
                            {p}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext onClick={() => onPageChange(Math.min(totalPages, page + 1))} />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink onClick={() => onPageChange(totalPages)}>
                        <ChevronsRight></ChevronsRight>
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
