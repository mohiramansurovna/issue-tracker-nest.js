import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import type { Label } from '@/types';
import { useState } from 'react';
import { useLabelsQuery } from '../hook/useLabelsQuery';
import SelectedLabels from './selected-labels';
import { Plus } from 'lucide-react';
import AddNewLabelDialog from './add-new-label';

export function LabelsCommand({
    labels,
    setLabels,
}: {
    labels: Label[];
    setLabels: (labels: Label[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const {data} = useLabelsQuery();
    const [visible, setVisible]=useState(false);
    return (
        data && (
            <div className='flex flex-col gap-4'>
                <Button
                    type='button'
                    size='icon-sm'
                    onClick={() => setOpen(true)}
                    variant={'outline'}
                    className='rounded-full'>
                    <Plus />
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <Command>
                        <CommandInput placeholder='Type a user email then select...' />
                        <CommandList>
                            <CommandEmpty>
                                <Button onClick={()=>setVisible(true)} variant='ghost'>Create your custom label</Button>
                                <AddNewLabelDialog open={visible} setOpen={setVisible}/>
                            </CommandEmpty>

                            <CommandGroup heading='Suggestions'>
                                {data.map(
                                    label =>
                                        !labels.some(l => l.id === label.id) && (
                                            <CommandItem
                                                key={label.id}
                                                onSelect={() => {
                                                    setLabels([...labels, label]);
                                                    setOpen(false);
                                                }}>
                                                <Badge
                                                    variant='outline'
                                                    className='text-xs'
                                                    style={
                                                        label.color
                                                            ? {
                                                                  borderColor: label.color,
                                                                  color: label.color,
                                                              }
                                                            : {}
                                                    }>
                                                    {label.title}
                                                </Badge>
                                            </CommandItem>
                                        ),
                                )}
                            </CommandGroup>
                        </CommandList>
                        <SelectedLabels
                            text='Selected:'
                            className='w-full bg-muted px-4 py-2'
                            labels={labels}
                        />
                    </Command>
                </CommandDialog>
            </div>
        )
    );
}
