import {queryClient} from '@/query-client';
import type {Label, User} from '@/types';
import {useMutation} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router';

export const useAddIssueMutation = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ['issue'],
        //I had to use string type for status and priority or was getting ts error
        mutationFn: async (values: {
            title: string;
            description: string;
            status: string;
            priority: string;
            assignee: User | null;
            labels: Label[];
        }) => {
            const {assignee,...rest}=values;
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/issues/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...rest,
                    ...(assignee ? {assignee_id: assignee.id} : {}),
                }),
            }).then(async res => {
                const data = await res.json();
                //expects {message:string}
                if (res.ok) {
                    queryClient.invalidateQueries({queryKey: ['issues']});
                    navigate('/');
                    return data;
                } else {
                    throw new Error(data.message);
                }
            });
        },
    });
};
export const useEditIssueMutation = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    return useMutation({
        mutationKey: ['issue', id],
        //I had to use string type for status and priority or was getting ts error
        mutationFn: async (values: {
            title: string;
            description: string;
            status: string;
            priority: string;
            assignee: User | null;
            labels: Label[];
        }) => {
            if (!id) throw new Error('No issue is selected for edit');
            const {assignee, ...rest} = values;
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/issues/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...rest,
                    ...(assignee ? {assignee_id: assignee.id} : {}),
                }),
            }).then(async res => {
                const data = await res.json();
                if (res.ok) {
                    queryClient.invalidateQueries({queryKey: ['issues']});
                    navigate('/issue/' + id);
                    return data;
                } else {
                    throw new Error(data.message);
                }
            });
        },
    });
};
export const useDeleteIssueMutation = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    return useMutation({
        mutationKey: ['issue'],
        //I had to use string type for status and priority or was getting ts error
        mutationFn: async () => {
            if (!id) throw new Error('No issue is selected for edit');
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/issues/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }).then(async res => {
                const data = await res.json();
                if (res.ok) {
                    queryClient.invalidateQueries({queryKey: ['issues']});
                    navigate('/');
                    return data;
                } else {
                    throw new Error(data.message);
                }
            });
        },
    });
};
