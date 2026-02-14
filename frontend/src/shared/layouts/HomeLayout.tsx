import {Outlet, useNavigate} from 'react-router';
import HeaderPublic from '../ui/header-public';
import {useAuthStore} from '@/auth/hooks/useAuthStore';
import HeaderMember from '../ui/header-member';
import {useEffect} from 'react';
import {useMeQuery} from '@/auth/hooks/useAuthQuery';

export default function HomeLayout() {
    const {isLoggedIn, login} = useAuthStore();
    const {data} = useMeQuery();
    const navigate=useNavigate();
    useEffect(() => {
        if(data){
            login(data);
            navigate('/')
        };
    },[data]);

    return (
        <main className=''>
            {isLoggedIn ? <HeaderMember /> : <HeaderPublic />}
            <Outlet />
        </main>
    );
}
