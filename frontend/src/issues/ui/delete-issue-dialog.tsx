import {useNavigate} from 'react-router';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import { useDeleteIssueMutation } from '../hook/useIssueMutations';
import { toast } from 'sonner';

export default function DeleteIssueDialog() {
    const navigate = useNavigate();
        const deleteIssueMutation=useDeleteIssueMutation()

    return (
        <Dialog open onOpenChange={()=>navigate(-1)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete this issue?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. The issue will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant='outline' onClick={()=>navigate(-1)}>
                        Cancel
                    </Button>
                    <Button variant='destructive' onClick={()=>deleteIssueMutation.mutate(undefined,{onSuccess:(success)=>toast.success(success.message), onError:(err)=>toast.error(err.message)})}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
