import {create} from 'zustand';
import {type User} from '@/types'

type AuthStore={
    user:User|null,
    isLoggedIn:boolean,
    login:(user:User)=>void;
    logout:()=>void;
}
export const useAuthStore = create<AuthStore>(set => ({
    user: null,
    isLoggedIn: false,
    login: (user: User) =>
        set({
            user,
            isLoggedIn: true,
        }),
    logout: () =>
        set({
            user: null,
            isLoggedIn: false,
        }),
}));
