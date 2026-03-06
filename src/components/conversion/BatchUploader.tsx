import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/cn';

export function BatchUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setStatus('idle');
      } else {
        setStatus('error');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setStatus('uploading');
    setProgress(0);
    
    // Simulate upload and processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('completed');
          return 100;
        }
        if (prev === 30) setStatus('processing');
        return prev + 10;
      });
    }, 500);
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-red-900/5 border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Batch Conversion</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Upload a CSV file containing dates to convert them in bulk.</p>
      </div>

      <AnimatePresence mode="wait">
      {!file ? (
        <motion.div
          key="upload"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-colors duration-200",
            isDragging 
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
              : "border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv"
            className="hidden"
          />
          <UploadCloud className={cn("mx-auto h-12 w-12 mb-4", isDragging ? "text-emerald-500" : "text-gray-400")} />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            Drag & drop your CSV file here
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or click to browse from your computer
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-400">
            <FileText className="h-4 w-4" />
            <span>Max file size: 10MB (up to 100,000 rows)</span>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="processing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-emerald-500 rounded-lg shadow-sm">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                  {file.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            
            {status === 'idle' && (
              <button
                onClick={reset}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
              >
                Remove
              </button>
            )}
          </div>

          {status === 'idle' && (
            <button
              onClick={handleUpload}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-emerald-600 hover:from-red-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Start Processing
            </button>
          )}

          {(status === 'uploading' || status === 'processing') && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700 dark:text-gray-300">
                  {status === 'uploading' ? 'Uploading...' : 'Processing dates...'}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Please wait, this might take a moment...</span>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-2">
                <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Processing Complete!</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Successfully converted 1,245 dates.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                  <Download className="h-4 w-4 mr-2" />
                  Download Results
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Process Another File
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Upload Failed</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please ensure you are uploading a valid CSV file.</p>
              </div>
              <button
                onClick={reset}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}
