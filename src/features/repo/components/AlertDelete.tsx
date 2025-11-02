// src/features/repo/components/AlerDelete.tsx
"use client";
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
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function DeleteAlertBox({
  children,
  title,
  repoId,
  contentId,
}: {
  children: React.ReactNode;
  title: string;
  repoId?: string;
  contentId?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    startTransition(async () => {
      try {
        const result = await deleteRepo(repoId as string);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        console.log("Error in submit handler function", error);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-bold">{title}</span> repository.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              className="hover:bg-red-600 cursor-pointer"
              onClick={handleAction}
            >
              {isPending && (
                <Loader2 className="animate-spin"/>
              )}
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
