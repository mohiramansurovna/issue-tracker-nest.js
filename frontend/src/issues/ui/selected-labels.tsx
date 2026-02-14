import type {Label} from '@/types';
import {Badge} from '@/components/ui/badge';
import {cn} from '@/lib/utils';
import type React from 'react';
import {CircleX} from 'lucide-react';

export default function SelectedLabels({
    text,
    labels,
    className,
    children,
    setLabels,
}: {
    text?: string;
    labels: Label[];
    className?: string;
    children?: React.ReactNode;
    setLabels?: (labels: Label[]) => void;
}) {
    const handleDelete = (id: string) => {
        if (setLabels) {
            setLabels([...labels.filter(each => each.id !== id)]);
        }
    };
    return (
        <div className={cn('flex justify-start gap-1 items-baseline flex-wrap', className)}>
            {text && <p className='text-xs font-semibold mr-2'>{text}</p>}
            {labels.map(label => (
                <Badge
                    onClick={() => handleDelete(label.id)}
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
                    {setLabels && <CircleX size={18} />}
                </Badge>
            ))}
            {children}
        </div>
    );
}
