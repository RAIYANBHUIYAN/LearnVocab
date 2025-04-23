import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Word } from "@shared/schema";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteWordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wordToDelete: Word | null;
}

const DeleteWordDialog = ({
  open,
  onOpenChange,
  wordToDelete,
}: DeleteWordDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete word mutation
  const deleteWordMutation = useMutation({
    mutationFn: async () => {
      if (!wordToDelete) throw new Error("No word to delete");
      await apiRequest("DELETE", `/api/words/${wordToDelete.id}`);
    },
    onSuccess: () => {
      // Invalidate queries to refetch the words list
      queryClient.invalidateQueries({ queryKey: ['/api/words'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      
      // Show success toast
      toast({
        title: "Word deleted",
        description: "The word has been removed from your dictionary.",
      });
      
      // Close the dialog
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete word",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    },
  });

  const handleDelete = () => {
    deleteWordMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <AlertDialogTitle className="text-center">Delete Word</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to delete <span className="font-semibold">{wordToDelete?.word}</span>? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteWordMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={deleteWordMutation.isPending}
          >
            {deleteWordMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWordDialog;
