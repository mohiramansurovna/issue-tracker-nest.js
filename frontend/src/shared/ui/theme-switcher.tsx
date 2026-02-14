import {Button} from '@/components/ui/button';
import {Moon, Sun} from 'lucide-react';
import {useEffect, useState} from 'react';

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    return (
        <Button
            variant='outline'
            size='icon'
            onClick={() => setTheme(prev => (prev == 'dark' ? 'light' : 'dark'))}
            className='rounded-full'>
            {theme == 'dark' ? <Sun /> : <Moon />}
        </Button>
    );
}
