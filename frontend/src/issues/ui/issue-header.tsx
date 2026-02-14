import {Button} from '@/components/ui/button';
import {Link} from 'react-router';
import {SeachInput} from './search-input';
import type {Dispatch, SetStateAction} from 'react';
import {useAuthStore} from '@/auth/hooks/useAuthStore';

export default function IssueHeader({
    term,
    setTerm,
}: {
    term: string;
    setTerm: Dispatch<SetStateAction<string>>;
}) {
    const {isLoggedIn} = useAuthStore();
    return (
        <header className='flex mt-8 justify-between mx-auto px-8 items-baseline'>
            <SeachInput term={term} setTerm={setTerm} />
            {isLoggedIn && (
                <nav className='flex items-baseline'>
                    <Link to='/issue/add'>
                        <Button>Add Issue</Button>
                    </Link>
                </nav>
            )}
        </header>
    );
}
