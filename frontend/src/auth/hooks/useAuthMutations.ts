import {useMutation} from '@tanstack/react-query';
import { useAuthStore } from './useAuthStore';
import { useNavigate } from 'react-router';

export const useRegisterMutation = () => {
    const navigate=useNavigate();
    const {login}=useAuthStore();
    return useMutation({
        mutationKey: ['auth'],
        mutationFn: async (values: {email: string; password: string}) => {
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(values),
            }).then(async res => {
                //expects User | {message:string} + sets cookie
                const data = await res.json();
                console.log(res)
                if (res.ok) {
                    login(data);
                    navigate('/')
                } else {
                    throw new Error(data.message);
                }
            });
        },
    });
};

export const useLoginMutation = () => {
    const navigate=useNavigate()
    const {login}=useAuthStore()
    return useMutation({
        mutationKey:['auth'],
        mutationFn: async (values:{email:string,password:string}) => {
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials:'include',
                body: JSON.stringify(values),
            }).then(async res=>{
                //expects User | {message:string} + sets cookie
                const data=await res.json()
                if(res.ok){
                    login(data)
                    navigate('/')
                }else{
                    throw new Error(data.message)
                }
            })
        },
    });
};

export const useLogoutMutation = () => {
    const {logout} = useAuthStore();
    return useMutation({
        mutationKey: ['auth'],
        mutationFn: async () => {
            return await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/logout', {
                method: 'POST',
                credentials: 'include',
            }).then(async res => {
                //expects clear cookie | {message:string}
                if (res.ok) {
                    logout();
                } else {
                    throw new Error("Error with loggin out");
                }
            });
        },
    });
};

