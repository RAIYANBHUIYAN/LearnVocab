import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchAndFiltersProps {
  onSearch: (term: string) => void;
  onTagSelect: (tag: string) => void;
  onAddWordClick: () => void;
  selectedTag: string;
}

const SearchAndFilters = ({
  onSearch,
  onTagSelect,
  onAddWordClick,
  selectedTag,
}: SearchAndFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch all tags
  const { data: tags = [] } = useQuery<string[]>({
    queryKey: ['/api/tags'],
  });

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  // Handle tag selection
  const handleTagChange = (value: string) => {
    onTagSelect(value);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <form 
          className="relative flex-grow"
          onSubmit={handleSearchSubmit}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search words..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </form>

        <div className="relative w-full sm:w-64">
          <Select value={selectedTag} onValueChange={handleTagChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-primary hover:bg-blue-600" onClick={onAddWordClick}>
          <span className="hidden sm:inline">Add Word</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:hidden"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default SearchAndFilters;
