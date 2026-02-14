import type {Issue} from '@/types';
import {useQuery} from '@tanstack/react-query';
import { useParams } from 'react-router';

export const useIssueQuery = () => {
    const {id}=useParams();
    return useQuery({
        queryKey: ['issue'],
        queryFn: async () => {
            if(!id) throw new Error("Issue is not chosen");
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/issues/'+id).then(async res => {
                const data = await res.json();
                if (res.ok) {
                    return data as Issue;
                } else {
                    throw new Error(data.message);
                }
            });
        },
    });
};
