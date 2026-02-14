import {useAuthStore} from '@/auth/hooks/useAuthStore';
import {useIssueQuery} from '../hook/useIssueQuery';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Pencil, Trash2} from 'lucide-react';
import {Link} from 'react-router';

export default function Issue() {
    const {data} = useIssueQuery();
    const {isLoggedIn} = useAuthStore();
    if (!data) return null;

    return (
        <div className='px-8 py-3 space-y-2 mt-4 border-y border-muted w-screen'>
            {/* Header */}
            <div className='flex items-start justify-between gap-3'>
                <div className='space-y-1'>
                    <div className='flex gap-10'>
                        <h1 className='text-lg font-semibold leading-snug'>{data.title}</h1>
                        {/* Labels (future-ready) */}
                        <div className='flex gap-1 pt-1'>
                            {data.labels.map(label => (
                                <Badge
                                    key={label.id}
                                    variant='secondary'
                                    className='h-5 px-2 text-xs bg-transparent'
                                    style={{borderColor: label.color, color: label.color}}>
                                    {label.title}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    {/* Status + Priority (read-only) */}
                    <div className='flex gap-2 text-xs text-muted-foreground'>
                        <span>
                            Status:{' '}
                            <span className='text-foreground font-medium'>{data.status}</span>
                        </span>

                        <span>
                            Priority:{' '}
                            <span className='text-foreground font-medium'>{data.priority}</span>
                        </span>
                    </div>
                </div>

                {/* Actions */}
                {isLoggedIn && (
                    <div className='flex gap-1'>
                        <Link to={'edit'}>
                            <Button variant='ghost' size='icon'>
                                <Pencil className='h-4 w-4' />
                            </Button>
                        </Link>
                        <Link to={'delete'}>
                            <Button variant='ghost' size='icon' className='text-destructive'>
                                <Trash2 className='h-4 w-4' />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Meta */}
            <div className='flex flex-wrap gap-4 text-xs text-muted-foreground'>
                <span>
                    Created by{' '}
                    <span className='text-foreground font-medium'>{data.creator.email}</span>
                </span>
                <span>
                    Assigned to{' '}
                    <span className='text-foreground font-medium'>
                        {data.assignee?data.assignee.email: 'no one'}
                    </span>
                </span>

                <span>
                    Created:{' '}
                    <span className='text-foreground'>
                        {new Date(data.created_at).toLocaleDateString()}
                    </span>
                </span>

                <span>
                    Updated:{' '}
                    <span className='text-foreground'>
                        {new Date(data.updated_at).toLocaleDateString()}
                    </span>
                </span>
            </div>

            {/* Description */}
            <p className='text-sm leading-6 whitespace-pre-wrap'>
                {data.description || 'No description provided.'}
            </p>
        </div>
    );
}
