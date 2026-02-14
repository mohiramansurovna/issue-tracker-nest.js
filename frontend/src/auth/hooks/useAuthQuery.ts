import type {User} from '@/types';
import {useQuery} from '@tanstack/react-query';

export const useMeQuery = () => {
    return useQuery({
        queryKey: ['auth'],
        queryFn: async () => {
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/me', {
                method: 'GET',
                credentials: 'include',
            }).then(async res => {
                //expects User | {message:string}
                const data = await res.json();
                if (res.ok) {
                    return data;
                } else {
                    throw new Error(data.message);
                }
            });
        },
        retry: 1, //if auth.me returns error which means they are logged out so no need to retry
    });
};

export const useUsersQuery = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/', {
                method: 'GET',
                credentials: 'include',
            }).then(async res => {
                // expects User[] | {message:string}
                const data = await res.json();
                if (res.ok) {
                    return data as User[];
                } else {
                    throw new Error(data.message);
                }
            });
        },
    });
};
