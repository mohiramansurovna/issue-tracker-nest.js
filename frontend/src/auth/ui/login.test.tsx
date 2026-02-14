import '@testing-library/jest-dom/vitest';

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, it, expect, vi} from 'vitest';
import {LoginForm} from './login';

// Mock the hook used by LoginForm so it doesn't do real network
vi.mock('../hooks/useAuthMutations', () => ({
    useLoginMutation: () => ({
        mutate: vi.fn(),
        isPending: false,
    }),
}));

describe('LoginForm (RTL)', () => {
    it('shows validation error for weak password', async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        await user.type(screen.getByLabelText(/email/i), 'test@test.com');
        await user.type(screen.getByLabelText(/password/i), 'password123'); // weak (no uppercase + no special)

        await user.click(screen.getByRole('button', {name: /submit/i}));

        expect(
            await screen.findByText(/must contain at least one uppercase letter/i),
        ).toBeInTheDocument();

    });
});
