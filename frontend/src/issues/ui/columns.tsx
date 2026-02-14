import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import type {Issue, User} from '@/types';
import {type ColumnDef} from '@tanstack/react-table';
import {ArrowUpDown} from 'lucide-react';
import {cn} from '@/lib/utils';

function ellipsize(value: string, max: number) {
    if (!value) return '';
    return value.length > max ? value.slice(0, max) + '…' : value;
}

const statusStyles: Record<string, string> = {
    todo: 'bg-muted text-muted-foreground',
    'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    done: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
};

const priorityStyles: Record<string, string> = {
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
};

export const columns: ColumnDef<Issue>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({row}) => {
            const title = row.getValue<string>('title');
            return <div className='font-medium text-sm'>{ellipsize(title, 30)}</div>;
        },
    },

    {
        accessorKey: 'status',
        header: ({column}) => (
            <Button
                variant='ghost'
                size='sm'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Status
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
        ),
        cell: ({row}) => {
            const status = row.getValue<string>('status');
            return (
                <Badge variant='secondary' className={cn('capitalize', statusStyles[status])}>
                    {status.replace('-', ' ')}
                </Badge>
            );
        },
    },

    {
        accessorKey: 'priority',
        header: ({column}) => (
            <Button
                variant='ghost'
                size='sm'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Priority
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
        ),
        cell: ({row}) => {
            const priority = row.getValue<string>('priority');
            return (
                <Badge variant='secondary' className={cn('capitalize', priorityStyles[priority])}>
                    {priority}
                </Badge>
            );
        },
    },

    {
        accessorKey: 'labels',
        header: 'Labels',
        cell: ({row}) => {
            const labels = row.getValue<{id: string; title: string; color?: string}[]>('labels');

            if (!labels || labels.length === 0) {
                return <span className='text-muted-foreground text-xs'>—</span>;
            }

            return (
                <div className='flex flex-wrap gap-1'>
                    {labels.map(label => (
                        <Badge
                            key={label.id}
                            variant='outline'
                            className='text-xs'
                            style={
                                label.color ? {borderColor: label.color, color: label.color} : {}
                            }>
                            {label.title}
                        </Badge>
                    ))}
                </div>
            );
        },
    },

    {
        accessorKey: 'created_at',
        header: ({column}) => (
            <Button
                size='sm'
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Created
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
        ),
        cell: ({row}) => {
            return (
                <span className='text-xs text-muted-foreground'>
                    {new Date(row.getValue('created_at')).toLocaleDateString()}
                </span>
            );
        },
    },

    {
        accessorKey: 'updated_at',
        header: ({column}) => (
            <Button
                size='sm'
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Updated
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
        ),
        cell: ({row}) => {
            return (
                <span className='text-xs text-muted-foreground'>
                    {new Date(row.getValue('updated_at')).toLocaleDateString()}
                </span>
            );
        },
    },

    {
        accessorKey: 'creator',
        header: ({column}) => (
            <Button
                variant='ghost'
                size='sm'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Created by
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
        ),

        cell: ({row}) => {
            const email = row.getValue<User>('creator').email;
            return <span className='text-xs text-muted-foreground'>{ellipsize(email, 18)}</span>;
        },
    },

    {
        accessorKey: 'assignee',
        header: ({column}) => (
            <Button
                variant='ghost'
                size='sm'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Assigned to
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
        ),

        cell: ({row}) => {
            const assignee = row.getValue<User>('assignee');
            return (
                <span className='text-xs text-muted-foreground'>
                    {assignee ? ellipsize(assignee.email, 18) : '—'}
                </span>
            );
        },
    },
];
