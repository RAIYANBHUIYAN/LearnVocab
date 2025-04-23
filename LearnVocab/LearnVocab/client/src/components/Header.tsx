import { PlusIcon, UserIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  onAddWordClick?: () => void;
}

const Header = ({ onAddWordClick }: HeaderProps = {}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Daily Dictionary
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Add Word"
              onClick={onAddWordClick}
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="User Profile"
            >
              <UserIcon className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="sm:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile menu (hidden by default) */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-2 space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              aria-label="Add Word"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onAddWordClick) onAddWordClick();
              }}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Word
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              aria-label="User Profile"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              Profile
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
