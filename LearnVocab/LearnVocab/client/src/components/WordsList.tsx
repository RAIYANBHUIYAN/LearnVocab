import { useQuery } from "@tanstack/react-query";
import WordCard from "./WordCard";
import { Word } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WordsListProps {
  searchTerm: string;
  selectedTag: string;
  onEditWord: (word: Word) => void;
  onDeleteWord: (word: Word) => void;
}

const WordsList = ({ searchTerm, selectedTag, onEditWord, onDeleteWord }: WordsListProps) => {
  // Build the query key based on filters
  const queryKey = ['/api/words'];
  const queryParams = new URLSearchParams();
  
  if (searchTerm) {
    queryParams.append('search', searchTerm);
  }
  
  if (selectedTag && selectedTag !== 'all') {
    queryParams.append('tag', selectedTag);
  }
  
  const queryUrl = queryParams.toString() 
    ? `/api/words?${queryParams.toString()}` 
    : '/api/words';

  // Fetch words based on search term and selected tag
  const { data: words, isLoading, error } = useQuery<Word[]>({
    queryKey: [queryUrl],
  });

  // Skeleton loader when loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <Skeleton className="h-7 w-32" />
                <div className="flex space-x-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-full mt-1" />
              <Skeleton className="h-4 w-3/4 mt-1" />
              <Skeleton className="h-3 w-24 mt-4" />
              <Skeleton className="h-3 w-32 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load words. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!words || words.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 inline-block p-3 rounded-full mb-4">
          <AlertCircle className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No words found</h3>
        <p className="mt-2 text-sm text-gray-500">
          {searchTerm || (selectedTag && selectedTag !== 'all')
            ? "Try adjusting your search or filter to find words."
            : "Start by adding your first word to your dictionary."}
        </p>
      </div>
    );
  }

  // Render the list of words
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {words.map((word) => (
        <WordCard
          key={word.id}
          word={word}
          onEdit={onEditWord}
          onDelete={onDeleteWord}
        />
      ))}
    </div>
  );
};

export default WordsList;
