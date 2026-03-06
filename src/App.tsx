import React, { useState } from 'react';
import { Calendar, Upload, History, Settings, Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DateConverter } from './components/conversion/DateConverter';
import { BatchUploader } from './components/conversion/BatchUploader';
import { ConversionHistory } from './components/conversion/ConversionHistory';
import { AnimatedBackground } from './components/AnimatedBackground';

export default function App() {
  const [activeTab, setActiveTab] = useState<'converter' | 'batch' | 'history'>('converter');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'dark text-white' : 'text-gray-900'}`}>
      <AnimatedBackground />
      {/* Navigation */}
      <nav className="border-b border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-950/60 backdrop-blur-2xl sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-red-600 dark:text-red-500" />
              <span className="ml-2 text-xl font-bold font-sans tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-emerald-600 dark:from-red-500 dark:to-emerald-400">NepaliDateHub</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setActiveTab('converter')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'converter' ? 'text-red-700 bg-red-50/80 dark:bg-red-900/40 dark:text-red-300 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50'}`}
              >
                <Calendar className="h-4 w-4" />
                <span>Converter</span>
              </button>
              <button 
                onClick={() => setActiveTab('batch')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'batch' ? 'text-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/40 dark:text-emerald-300 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50'}`}
              >
                <Upload className="h-4 w-4" />
                <span>Batch Process</span>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'history' ? 'text-amber-700 bg-amber-50/80 dark:bg-amber-900/40 dark:text-amber-300 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50'}`}
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Globe className="h-5 w-5" />
              </button>
              <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
              >
                <motion.div animate={{ rotate: isMobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-lg"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => { setActiveTab('converter'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all ${activeTab === 'converter' ? 'text-red-700 bg-red-50/80 dark:bg-red-900/40 dark:text-red-300 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50'}`}
              >
                <Calendar className="h-5 w-5" />
                <span>Converter</span>
              </button>
              <button 
                onClick={() => { setActiveTab('batch'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all ${activeTab === 'batch' ? 'text-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/40 dark:text-emerald-300 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50'}`}
              >
                <Upload className="h-5 w-5" />
                <span>Batch Process</span>
              </button>
              <button 
                onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all ${activeTab === 'history' ? 'text-amber-700 bg-amber-50/80 dark:bg-amber-900/40 dark:text-amber-300 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50'}`}
              >
                <History className="h-5 w-5" />
                <span>History</span>
              </button>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'converter' && (
            <motion.div
              key="converter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DateConverter />
            </motion.div>
          )}
          {activeTab === 'batch' && (
            <motion.div
              key="batch"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <BatchUploader />
            </motion.div>
          )}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ConversionHistory />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-gray-950/60 backdrop-blur-2xl border-t border-gray-200/50 dark:border-gray-800/50 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} NepaliDateHub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              API Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
