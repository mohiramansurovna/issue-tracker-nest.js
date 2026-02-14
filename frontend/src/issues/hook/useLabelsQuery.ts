import type { Label } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useLabelsQuery = () => {
    return useQuery({
        queryKey: ['labels'],
        queryFn: async () => {
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/labels/', {
                method: 'GET',
                credentials: 'include',
            }).then(async res => {
                const data = await res.json();
                if (res.ok) {
                    return data as Label[];
                } else {
                    throw new Error(data.message);
                }
            });
        },
    });
};
