import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { type Word } from "@shared/schema";

interface WordCardProps {
  word: Word;
  onEdit: (word: Word) => void;
  onDelete: (word: Word) => void;
}

const WordCard = ({ word, onEdit, onDelete }: WordCardProps) => {
  // Format the date learned
  const formattedDate = word.dateLearned ? 
    format(new Date(word.dateLearned), "MMMM d, yyyy") : 
    "Unknown date";

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">{word.word}</h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-gray-600"
              onClick={() => onEdit(word)}
              aria-label={`Edit ${word.word}`}
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-red-500"
              onClick={() => onDelete(word)}
              aria-label={`Delete ${word.word}`}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-600">{word.definition}</p>
        
        {word.example && (
          <p className="mt-3 text-sm text-gray-500 italic">"{word.example}"</p>
        )}
        
        {word.tags && word.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {word.tags.map((tag, index) => (
              <Badge 
                key={`${tag}-${index}`} 
                variant="secondary"
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-400">
          Added on {formattedDate}
        </div>
      </CardContent>
    </Card>
  );
};

export default WordCard;
