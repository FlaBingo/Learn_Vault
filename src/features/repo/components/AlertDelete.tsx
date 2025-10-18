// src/features/repo/components/AlerDelete.tsx
"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteRepo } from "../actions/repo";
import { toast } from "sonner";

export default function DeleteAlertBox({
  children,
  title,
  id
}: {
  children: React.ReactNode;
  title: string;
  id: string;
}) {


  const handleAction = async () => {
    try {
      const result = await deleteRepo(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.log("Error in submit handler function", error);
      toast.error("An unexpected error occurred.");
    }
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete your <span className="font-bold">{title}</span> repository.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction className="hover:bg-red-600 cursor-pointer" onClick={handleAction}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
