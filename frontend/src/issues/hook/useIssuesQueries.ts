import type {Issue} from '@/types';
import {useQuery, keepPreviousData} from '@tanstack/react-query';
import type { SortingState } from '@tanstack/react-table';

type IssuesResponse = {
    data: Issue[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export const useIssuesQuery = (page: number, term:string, sorting:SortingState) => {
    const params: Record<string, string> = {
        page: String(page),
        limit: '8',
        term,
    };

    if (sorting[0]) {
        params.sortBy = sorting[0].id;
        params.sortDir = sorting[0].desc ? 'desc' : 'asc';
    }
    return useQuery({
        queryKey: ['issues', page,term, sorting],
        queryFn: async () => {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/issues?${new URLSearchParams(params)}`,
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data as IssuesResponse;
        },
        placeholderData: keepPreviousData,
    });
};
