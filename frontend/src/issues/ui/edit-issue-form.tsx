import {useForm} from '@tanstack/react-form';
import {toast} from 'sonner';
import * as z from 'zod';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldTitle,
} from '@/components/ui/field';
import {Input} from '@/components/ui/input';
import {useEditIssueMutation} from '../hook/useIssueMutations';
import type {IssuePriority, IssueStatus, Label} from '@/types';
import {RadioGroupItem, RadioGroup} from '@/components/ui/radio-group';
import {Textarea} from '@/components/ui/textarea';
import {useIssueQuery} from '../hook/useIssueQuery';
import {LabelsCommand} from './label-command';
import SelectedLabels from './selected-labels';
import { AssingeeCommand } from './assignees-command';
const labelSchema = z.object({id: z.string(), title: z.string(), color: z.string()});
const userSchema = z.object({id: z.string(), email: z.string()});

const formSchema = z.object({
    title: z
        .string()
        .min(5, 'Minimum size of title should be 5 characters')
        .max(50, 'Max size of title should be 50 characters'),
    description: z.string(),
    status: z.custom<IssueStatus>(),
    priority: z.custom<IssuePriority>(),
    assignee: userSchema.nullable(),
    labels: z.array(labelSchema),
});
const issueStatus: IssueStatus[] = ['todo', 'in-progress', 'done', 'cancelled'];
const issuePriority: IssuePriority[] = ['low', 'medium', 'high'];
export function EditIssueForm() {
    const {data} = useIssueQuery();
    const editIssueMutation = useEditIssueMutation();
    const form = useForm({
        defaultValues: {
            title: data?.title ?? '',
            description: data?.description ?? '',
            status: data?.status ?? '',
            priority: data?.priority ?? '',
            assignee: data?.assignee??null,
            labels: data?.labels ?? ([] as Label[]),
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({value}) => {
            editIssueMutation.mutate(value, {
                onSuccess: success => toast.success(success.message),
                onError: err => toast.error(err.message),
            });
        },
    });

    return (
        data && (
            <Card className='w-full sm:max-w-md rounded-none bg-transparent place-self-center border-transparent'>
                <CardHeader>
                    <CardTitle className='text-2xl text-center'>Edit issue</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        id='edit-issue-form'
                        onSubmit={e => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}>
                        <FieldGroup>
                            <form.Field
                                name='title'
                                children={field => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={e => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <form.Field
                                name='description'
                                children={field => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor='description'>
                                                Description
                                            </FieldLabel>
                                            <Textarea
                                                id='description'
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={e => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder='The bug is found on line 107...'
                                                className='min-h-30'
                                            />
                                            <FieldDescription>
                                                Provide details about the issue you're reporting
                                            </FieldDescription>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <form.Field
                                name='status'
                                children={field => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <FieldSet>
                                            <FieldLegend className='text-sm'>Status</FieldLegend>
                                            <RadioGroup
                                                className='flex gap-1'
                                                name={field.name}
                                                value={field.state.value}
                                                onValueChange={field.handleChange}
                                                orientation='horizontal'>
                                                {issueStatus.map(each => {
                                                    return (
                                                        <FieldLabel
                                                            key={each + Math.random()}
                                                            htmlFor={each}
                                                            className='text-xs'>
                                                            <Field
                                                                orientation='horizontal'
                                                                data-invalid={isInvalid}>
                                                                <FieldContent>
                                                                    <FieldTitle className='text-xs'>
                                                                        {each}
                                                                    </FieldTitle>
                                                                </FieldContent>
                                                                <RadioGroupItem
                                                                    className='hidden'
                                                                    value={each}
                                                                    id={each}
                                                                    aria-invalid={isInvalid}
                                                                />
                                                            </Field>
                                                        </FieldLabel>
                                                    );
                                                })}
                                            </RadioGroup>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </FieldSet>
                                    );
                                }}
                            />
                            <form.Field
                                name='priority'
                                children={field => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <FieldSet>
                                            <FieldLegend className='text-sm'>Priority</FieldLegend>
                                            <RadioGroup
                                                name={field.name}
                                                value={field.state.value}
                                                onValueChange={field.handleChange}
                                                className='flex gap-1'>
                                                {issuePriority.map(each => {
                                                    return (
                                                        <FieldLabel
                                                            key={each + Math.random()}
                                                            htmlFor={each}
                                                            className='text-xs'>
                                                            <Field
                                                                orientation='horizontal'
                                                                data-invalid={isInvalid}>
                                                                <FieldContent>
                                                                    <FieldTitle className='text-xs'>
                                                                        {each}
                                                                    </FieldTitle>
                                                                </FieldContent>
                                                                <RadioGroupItem
                                                                    className='hidden'
                                                                    value={each}
                                                                    id={each}
                                                                    aria-invalid={isInvalid}
                                                                />
                                                            </Field>
                                                        </FieldLabel>
                                                    );
                                                })}
                                            </RadioGroup>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </FieldSet>
                                    );
                                }}
                            />
                            <form.Field
                                name='assignee'
                                children={field => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <AssingeeCommand
                                                assignee={field.state.value}
                                                setAssignee={field.handleChange}
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <form.Field
                                name='labels'
                                children={field => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <SelectedLabels
                                                labels={field.state.value}
                                                setLabels={field.handleChange}>
                                                <LabelsCommand
                                                    labels={field.state.value}
                                                    setLabels={field.handleChange}
                                                />
                                            </SelectedLabels>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation='horizontal' className='justify-end'>
                        <Button type='button' variant='outline' onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button
                            type='submit'
                            form='edit-issue-form'
                            disabled={editIssueMutation.isPending}>
                            Submit
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        )
    );
}
