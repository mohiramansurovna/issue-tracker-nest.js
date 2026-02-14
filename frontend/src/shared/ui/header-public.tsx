import {Link} from 'react-router';
import {Button} from '@/components/ui/button';
import ThemeSwitcher from '@/shared/ui/theme-switcher';

export default function HeaderPublic() {
    return (
        <header className='py-2 flex justify-between items-center px-6'>
            <Link to='/'><h1 className='font-sans text-3xl font-semibold text-purple-400'>Issue tracker :)</h1></Link>
            <nav className='flex justify-between items-center gap-4'>
                <ThemeSwitcher />
                <Link to='/register'>
                    <Button size='sm'>Sign Up</Button>
                </Link>
                <Link to='/login'>
                    <Button size='sm' variant='outline'>
                        Log In
                    </Button>
                </Link>
            </nav>
        </header>
    );
}
