import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-background-secondary dark:bg-dark-background-secondary text-text-primary dark:text-dark-text-primary hover:bg-background-primary dark:hover:bg-dark-background-primary transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2 dark:focus:ring-offset-dark-background-secondary"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle; 