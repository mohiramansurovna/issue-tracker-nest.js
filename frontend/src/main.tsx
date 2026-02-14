import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {RouterProvider} from 'react-router';
import {router} from './router';
import {Toaster} from '@/components/ui/sonner';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './query-client';
import ErrorBoundary from './shared/ui/error-page';
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <Toaster />
            </QueryClientProvider>
        </ErrorBoundary>
    </StrictMode>,
);
