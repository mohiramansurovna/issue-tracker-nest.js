import {Link} from 'react-router';
import {Button} from '@/components/ui/button';
import ThemeSwitcher from '@/shared/ui/theme-switcher';
import {useLogoutMutation} from '@/auth/hooks/useAuthMutations';
import {toast} from 'sonner';

export default function HeaderMember() {
    const logout = useLogoutMutation();
    return (
        <header className='py-2 flex justify-between items-center px-6'>
            <Link to='/' ><h1 className='font-sans text-3xl font-semibold'>Welcome :)</h1></Link>
            <nav className='flex justify-between items-center gap-4'>
                <ThemeSwitcher />
                    <Button
                        size='sm'
                        onClick={() => {
                            logout.mutate(undefined,{
                                onSuccess: () => toast.success('You logged out'),
                                onError: err => toast.error(err.message),
                            });
                        }}
                        disabled={logout.isPending}
                        variant='outline'>
                        Log Out
                    </Button>
            </nav>
        </header>
    );
}
