import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group';
import {SearchIcon} from 'lucide-react';
import {type Dispatch, type SetStateAction} from 'react';

export function SeachInput({term,setTerm}: {term:string,setTerm: Dispatch<SetStateAction<string>>}) {
    //need to use d for search term
    return (
        <InputGroup className='max-w-sm'>
            <InputGroupInput
                value={term}
                onChange={e =>{
                    setTerm(e.target.value)}}
                id='inline-start-input'
                placeholder='Search...'
            />
            <InputGroupAddon align='inline-start'>
                <SearchIcon className='text-muted-foreground' />
            </InputGroupAddon>
        </InputGroup>
    );
}
