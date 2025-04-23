import { useState } from "react";
import { Word } from "@shared/schema";
import SearchAndFilters from "@/components/SearchAndFilters";
import WordsList from "@/components/WordsList";
import AddWordDialog from "@/components/AddWordDialog";
import EditWordDialog from "@/components/EditWordDialog";
import DeleteWordDialog from "@/components/DeleteWordDialog";

const Home = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  
  // State for dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  // Handlers for the dialogs
  const handleAddWordClick = () => {
    setAddDialogOpen(true);
  };

  const handleEditWord = (word: Word) => {
    setSelectedWord(word);
    setEditDialogOpen(true);
  };

  const handleDeleteWord = (word: Word) => {
    setSelectedWord(word);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchAndFilters
        onSearch={setSearchTerm}
        onTagSelect={setSelectedTag}
        onAddWordClick={handleAddWordClick}
        selectedTag={selectedTag}
      />
      
      <WordsList
        searchTerm={searchTerm}
        selectedTag={selectedTag}
        onEditWord={handleEditWord}
        onDeleteWord={handleDeleteWord}
      />
      
      <AddWordDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
      />
      
      <EditWordDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        wordToEdit={selectedWord}
      />
      
      <DeleteWordDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        wordToDelete={selectedWord}
      />
    </div>
  );
};

export default Home;
