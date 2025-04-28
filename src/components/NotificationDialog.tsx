
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface NotificationDialogProps {
  count: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onIgnore: () => void;
}

export function NotificationDialog({
  count,
  open,
  onOpenChange,
  onComplete,
  onIgnore,
}: NotificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-retirement/10 p-2 rounded-full">
              <Bell className="h-5 w-5 text-retirement" />
            </div>
            <DialogTitle>Perhatian!</DialogTitle>
          </div>
          <DialogDescription>
            Terdapat {count} data pegawai yang belum lengkap.
          </DialogDescription>
          <p className="text-sm text-muted-foreground mt-1">
            Silakan lengkapi data tersebut.
          </p>
        </DialogHeader>
        <DialogFooter className="sm:justify-end mt-4">
          <Button
            variant="outline"
            onClick={onIgnore}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            Abaikan
          </Button>
          <Button
            onClick={onComplete}
            className="bg-retirement hover:bg-retirement-dark"
          >
            Lengkapi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function showIncompleteDataNotification(count: number): Promise<boolean> {
  return new Promise((resolve) => {
    // Create a div to render the dialog
    const dialogContainer = document.createElement("div");
    document.body.appendChild(dialogContainer);

    // Create a function to remove the dialog container
    const cleanupDialog = () => {
      document.body.removeChild(dialogContainer);
    };

    // Render the dialog
    const dialogRoot = document.createElement("div");
    dialogContainer.appendChild(dialogRoot);

    // Set initial state
    let dialogOpen = true;

    // Update the DOM
    const updateDialog = () => {
      // This is a simplified version - in a real app you would use ReactDOM.render
      // to render the actual React component
      const handleComplete = () => {
        console.log("Navigate to complete data page");
        dialogOpen = false;
        updateDialog();
        setTimeout(() => {
          cleanupDialog();
          resolve(true);
        }, 300);
      };

      const handleIgnore = () => {
        console.log("Notification ignored");
        dialogOpen = false;
        updateDialog();
        setTimeout(() => {
          cleanupDialog();
          resolve(false);
        }, 300);
      };

      const handleOpenChange = (open: boolean) => {
        dialogOpen = open;
        if (!open) {
          setTimeout(() => {
            cleanupDialog();
            resolve(false);
          }, 300);
        }
        updateDialog();
      };

      // In a real application, you would use React's rendering, not this DOM manipulation
      // This is just to illustrate the component would work
    };

    updateDialog();
  });
}
