
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NotificationToastProps {
  count: number;
  onComplete: () => void;
  onIgnore: () => void;
}

export function NotificationToast({ 
  count, 
  onComplete, 
  onIgnore 
}: NotificationToastProps) {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-3">
        <div className="bg-retirement/10 p-2 rounded-full">
          <Bell className="h-5 w-5 text-retirement" />
        </div>
        <div className="font-medium">Perhatian!</div>
      </div>
      
      <div className="text-sm text-slate-700">
        Terdapat {count} data pegawai yang belum lengkap. 
        Silakan lengkapi data tersebut.
      </div>
      
      <div className="flex space-x-2 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          onClick={onIgnore}
        >
          Abaikan
        </Button>
        <Button 
          size="sm" 
          className="bg-retirement hover:bg-retirement-dark"
          onClick={onComplete}
        >
          Lengkapi
        </Button>
      </div>
    </div>
  );
}

export function showIncompleteDataNotification(count: number) {
  // Instead of showing a toast, we'll show a dialog
  const dialogContainer = document.createElement("div");
  document.body.appendChild(dialogContainer);
  
  // Set up state for dialog
  const [isOpen, setIsOpen] = useState(true);
  
  const handleComplete = () => {
    setIsOpen(false);
    console.log("Navigate to complete data page");
    toast({
      description: "Mengarahkan ke halaman pelengkapan data...",
      duration: 2000,
    });
  };
  
  const handleIgnore = () => {
    setIsOpen(false);
    console.log("Notification ignored");
    toast({
      description: "Notifikasi diabaikan",
      duration: 2000,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            Silakan lengkapi data tersebut.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={handleIgnore}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            Abaikan
          </Button>
          <Button 
            onClick={handleComplete}
            className="bg-retirement hover:bg-retirement-dark"
          >
            Lengkapi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
