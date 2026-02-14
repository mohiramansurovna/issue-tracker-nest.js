import {useMutation} from '@tanstack/react-query';
import {queryClient} from '@/query-client';
export const useAddLabelMutation = () => {
    return useMutation({
        mutationKey: ['label'],
        mutationFn: async (values: {title: string; color: string}) => {
            return await fetch(`${import.meta.env.VITE_BACKEND_URL}/labels`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(values),
            }).then(async res => {
                const data = await res.json();
                if (res.ok) {
                    queryClient.invalidateQueries({queryKey: ['labels']});
                    return data;
                } else {
                    throw new Error(data.message);
                }
            });
        },
    });
};

export const useDeleteIssueMutation = () => {
    return useMutation({
        mutationKey: ['issue'],
        mutationFn: async (id: string) => {
            if (!id) throw new Error('No label is selected for edit');
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/labels/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }).then(async res => {
                const data = await res.json();
                if (res.ok) {
                    queryClient.invalidateQueries({queryKey: ['labels']});
                    return data;
                } else {
                    throw new Error(data.message);
                }
            });
        },
    });
};
