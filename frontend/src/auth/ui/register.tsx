import {useForm} from '@tanstack/react-form';
import {toast} from 'sonner';
import * as z from 'zod';

import {Button} from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel} from '@/components/ui/field';
import {Input} from '@/components/ui/input';
import { useRegisterMutation } from '../hooks/useAuthMutations';

const formSchema = z
    .object({
        email: z.email('Wrong email'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .max(20, 'Password must be no more than 20 characters')
            .refine(password => /[A-Z]/.test(password), {
                message: 'Password must contain at least one uppercase letter',
            })
            .refine(password => /[a-z]/.test(password), {
                message: 'Password must contain at least one lowercase letter',
            })
            .refine(password => /[0-9]/.test(password), {
                message: 'Password must contain at least one number',
            })
            .refine(password => /[!@#$%^&*]/.test(password), {
                message: 'Password must contain at least one special character',
            }),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });


export function RegisterForm() {
    const register = useRegisterMutation();
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({value}) => {
            register.mutate({email:value.email,password:value.password},{
                onSuccess:()=>toast.success("You are registered"),
                onError:(err)=>toast.error(err.message)
            })
        },
    });

    return (
        <Card className='w-full sm:max-w-md rounded-none bg-transparent border-transparent'>
            <CardHeader>
                <CardTitle className='text-2xl text-center'>Sign up</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    id='register-form'
                    onSubmit={e => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}>
                    <FieldGroup>
                        <form.Field
                            name='email'
                            children={field => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={e => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder='example@mail.com'
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        <form.Field
                            name='password'
                            children={field => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={e => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder='********'
                                        />
                                        <FieldDescription>
                                            Password requirements: 8+ characters, uppercase,
                                            lowercase, number, special character
                                        </FieldDescription>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        <form.Field
                            name='confirmPassword'
                            children={field => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={e => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder='********'
                                        />
                                        <FieldDescription>Repeat the password</FieldDescription>
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
                    <Button type='submit' form='register-form' disabled={register.isPending}>
                        Submit
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    );
}
