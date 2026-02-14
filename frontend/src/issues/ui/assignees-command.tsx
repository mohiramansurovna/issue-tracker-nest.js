import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {useUsersQuery} from '@/auth/hooks/useAuthQuery';
import type { User } from '@/types';

export function AssingeeCommand({
    assignee,
    setAssignee,
}: {
    assignee: User|null;
    setAssignee: (assignee: User|null) => void;
}) {
    const [open, setOpen] = useState(false);
    const {data} = useUsersQuery();
    return (
        data && (
            <div className='flex flex-col gap-4'>
                <Button type='button' onClick={() => setOpen(true)} variant={'outline'} className='w-fit text-md'>
                   {assignee?`Assigned to ${assignee.email}`:'Assign'}
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <Command>
                        <CommandInput placeholder='Type a user email then select...' />
                        <CommandList>
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup heading='Suggestions'>
                                {data.map(user => (
                                    <CommandItem
                                        key={user.id}
                                        className={assignee?.id == user.id?`bg-accent-foreground text-accent`:''}
                                        onSelect={() => {
                                            setAssignee(user);
                                            setOpen(false);
                                        }}>
                                        {user.email}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </CommandDialog>
            </div>
        )
    );
}
