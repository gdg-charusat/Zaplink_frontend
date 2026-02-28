import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

interface UnsavedChangesDialogProps {
    /** Whether the dialog is currently visible. */
    open: boolean;
    /** Called when the user chooses to stay on the page. */
    onCancel: () => void;
    /** Called when the user confirms they want to leave. */
    onConfirm: () => void;
}

/**
 * A confirmation dialog shown when a user tries to navigate away from
 * a page that contains unsaved changes.
 */
export default function UnsavedChangesDialog({
    open,
    onCancel,
    onConfirm,
}: UnsavedChangesDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent className="sm:max-w-md" id="unsaved-changes-dialog">
                <DialogHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <DialogTitle className="text-center text-xl">
                        Unsaved Changes
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        You have unsaved changes that will be lost if you leave this page.
                        Are you sure you want to continue?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
                    <Button
                        id="unsaved-changes-stay-btn"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1 sm:flex-none"
                    >
                        Stay on Page
                    </Button>
                    <Button
                        id="unsaved-changes-leave-btn"
                        variant="destructive"
                        onClick={onConfirm}
                        className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white"
                    >
                        Leave Page
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
