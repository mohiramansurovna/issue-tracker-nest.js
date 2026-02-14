import {useState, type Dispatch, type SetStateAction} from 'react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {useAddLabelMutation} from '../hook/useLabelMutations';

const COLORS = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // green
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F97316', // orange
];

export default function AddNewLabelDialog({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const addLabelMutation = useAddLabelMutation();
    const [input, setInput] = useState('');
    const [color, setColor] = useState(COLORS[0]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='sm:max-w-sm'>
                <DialogHeader>
                    <DialogTitle>New Label</DialogTitle>
                    <DialogDescription>Add your custom label</DialogDescription>
                </DialogHeader>

                <div className='mt-4 flex flex-col gap-2'>
                    <label className='text-sm font-medium'>Label Name</label>
                    <Input
                        placeholder='Enter label title'
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                </div>

                <div className='mt-4'>
                    <label className='text-sm font-medium mb-2 block'>Pick Color</label>
                    <RadioGroup value={color} onValueChange={setColor} className='flex gap-2'>
                        {COLORS.map(c => (
                            <RadioGroupItem
                                key={c}
                                value={c}
                                className='w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center'
                                style={{
                                    backgroundColor: c,
                                    borderColor: color === c ? '#000' : '#D1D5DB', // highlight selected
                                }}
                            />
                        ))}
                    </RadioGroup>
                </div>

                <DialogFooter className='mt-6 flex justify-end gap-2'>
                    <Button variant='outline' onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!input.trim()}
                        onClick={() =>
                            addLabelMutation.mutate(
                                {title: input.trim(), color},
                                {
                                    onSuccess: data => {
                                        toast.success(data.message);
                                        setOpen(false)
                                    },
                                    onError: err => toast.error(err.message),
                                },
                            )
                        }>
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
