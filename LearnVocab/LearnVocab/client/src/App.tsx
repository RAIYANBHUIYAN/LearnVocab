import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddWordDialog from "@/components/AddWordDialog";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const handleAddWordClick = () => {
    setAddDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TooltipProvider>
        <Toaster />
        <Header onAddWordClick={handleAddWordClick} />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
        
        {/* Global Add Word Dialog */}
        <AddWordDialog 
          open={addDialogOpen} 
          onOpenChange={setAddDialogOpen} 
        />
      </TooltipProvider>
    </div>
  );
}

export default App;
