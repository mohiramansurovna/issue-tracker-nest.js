export type User = {
    id: string;
    email: string;
};

export type IssueStatus = 'todo' | 'in-progress' | 'done' | 'cancelled';

export type IssuePriority = 'low' | 'medium' | 'high';

export type Label={
    id:string,
    title:string,
    color:string
}
export type Issue = {
    id: string;
    title: string;
    description: null | string;
    status: IssueStatus;
    priority: IssuePriority;
    created_at: Date;
    updated_at: Date;
    creator:User,
    assignee:User,
    labels:Label[]
};
