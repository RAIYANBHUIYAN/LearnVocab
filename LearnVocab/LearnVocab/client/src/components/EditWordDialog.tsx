import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { wordFormSchema, type WordFormValues, type Word } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditWordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wordToEdit: Word | null;
}

const EditWordDialog = ({ open, onOpenChange, wordToEdit }: EditWordDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");

  // Initialize form
  const form = useForm<WordFormValues>({
    resolver: zodResolver(wordFormSchema),
    defaultValues: {
      word: "",
      definition: "",
      example: "",
      tags: [],
      dateLearned: new Date(),
    },
  });

  // Update form when wordToEdit changes
  useEffect(() => {
    if (wordToEdit && open) {
      // Parse the date properly
      const dateLearned = wordToEdit.dateLearned instanceof Date 
        ? wordToEdit.dateLearned 
        : new Date(wordToEdit.dateLearned);

      form.reset({
        word: wordToEdit.word,
        definition: wordToEdit.definition,
        example: wordToEdit.example || "",
        tags: wordToEdit.tags || [],
        dateLearned,
      });
    }
  }, [wordToEdit, open, form]);

  // Update word mutation
  const updateWordMutation = useMutation({
    mutationFn: async (updatedWord: WordFormValues) => {
      if (!wordToEdit) throw new Error("No word to edit");
      const response = await apiRequest("PUT", `/api/words/${wordToEdit.id}`, updatedWord);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch the words list
      queryClient.invalidateQueries({ queryKey: ['/api/words'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });

      // Show success toast
      toast({
        title: "Word updated",
        description: "Your word has been updated successfully.",
      });

      // Close the dialog
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update word",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: WordFormValues) => {
    updateWordMutation.mutate(data);
  };

  // Handle adding tags
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      
      const newTag = tagInput.trim().toLowerCase();
      const currentTags = form.getValues("tags") || [];
      
      // Only add the tag if it doesn't already exist
      if (!currentTags.includes(newTag)) {
        form.setValue("tags", [...currentTags, newTag]);
      }
      
      setTagInput("");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Word</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Word</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter a word..." 
                      {...field} 
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="definition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Definition</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the definition..." 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Example Sentence</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter an example sentence..." 
                      rows={2} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md min-h-[42px]">
                      {field.value?.map((tag, index) => (
                        <Badge 
                          key={`${tag}-${index}`} 
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 flex items-center"
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 text-blue-600 hover:text-blue-800 p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      <Input
                        type="text"
                        className="flex-grow border-0 p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Type and press Enter to add tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateLearned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Learned</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value instanceof Date ? field.value : new Date(field.value)}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateWordMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-blue-600"
                disabled={updateWordMutation.isPending}
              >
                {updateWordMutation.isPending ? (
                  "Saving..."
                ) : (
                  "Update Word"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWordDialog;
