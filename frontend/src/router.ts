import {createBrowserRouter} from 'react-router';
import HomeLayout from '@/shared/layouts/HomeLayout';
import Auth from './auth/ui/auth';
import {RegisterForm} from './auth/ui/register';
import {LoginForm} from './auth/ui/login';
import Issues from './issues/ui/issues';
import IssueLayout from './issues/ui/issue-layout';
import {AddIssueForm} from './issues/ui/add-issue-form';
import Issue from './issues/ui/issue';
import {EditIssueForm} from './issues/ui/edit-issue-form';
import DeleteIssueDialog from './issues/ui/delete-issue-dialog';
import NotFound from './shared/ui/not-found-page';

export const router = createBrowserRouter([
    {
        Component: HomeLayout,
        children: [
            {
                index: true,
                Component: Issues,
            },
            {
                path: 'issue',
                Component: IssueLayout,
                children: [
                    {
                        path: 'add',
                        Component: AddIssueForm,
                    },
                    {
                        path: ':id',
                        Component: Issue,
                    },
                    {
                        path: ':id/edit',
                        Component: EditIssueForm,
                    },
                    {
                        path: ':id/delete',
                        Component: DeleteIssueDialog,
                    },
                ],
            },
            {
                Component: Auth,
                children: [
                    {
                        path: 'register',
                        Component: RegisterForm,
                    },
                    {
                        path: 'login',
                        Component: LoginForm,
                    },
                    {
                        path: 'logout',
                    },
                ],
            },
            {
                path: '*',
                Component: NotFound,
            },
        ],
    },
]);
