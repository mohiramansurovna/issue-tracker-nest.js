import {useState} from 'react';
import {useIssuesQuery} from '../hook/useIssuesQueries';
import {columns} from './columns';
import {DataTable} from './data-table';
import IssueHeader from './issue-header';
import {IssuesPagination} from './issues-pagination';
import { type SortingState } from '@tanstack/react-table';

export default function Issues() {
    const [page, setPage] = useState(1);
    const [term, setTerm]=useState("")
    const [sorting,setSorting]=useState<SortingState>([]);
    
    const {data} = useIssuesQuery(page,term, sorting);
    

    return (
        <section>
            <IssueHeader term={term} setTerm={setTerm}/>
            <div className='container mx-auto py-6 px-5'>
                {data && (
                    <>
                        <DataTable data={data.data} columns={columns} sorting={sorting} setSorting={setSorting} />
                        <IssuesPagination
                            page={page}
                            totalPages={data.totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </section>
    );
}
