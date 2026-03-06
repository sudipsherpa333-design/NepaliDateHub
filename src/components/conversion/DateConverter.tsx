import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Calendar as CalendarIcon, Copy, Share2, Check } from 'lucide-react';
import NepaliDate from 'nepali-date-converter';
import { format, isValid, parse } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/cn';
import { CalendarView } from './CalendarView';

type ConversionMode = 'BS2AD' | 'AD2BS';

export function DateConverter() {
  const [mode, setMode] = useState<ConversionMode>('BS2AD');
  const [inputDate, setInputDate] = useState('');
  const [outputDate, setOutputDate] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Initialize with today's date
  useEffect(() => {
    const todayAD = new Date();
    const todayBS = new NepaliDate();
    
    if (mode === 'BS2AD') {
      setInputDate(todayBS.format('YYYY-MM-DD'));
      setOutputDate(format(todayAD, 'yyyy-MM-dd'));
    } else {
      setInputDate(format(todayAD, 'yyyy-MM-dd'));
      setOutputDate(todayBS.format('YYYY-MM-DD'));
    }
  }, [mode]);

  const parseADDate = (value: string) => {
    const formatsToTry = [
      'yyyy-MM-dd',
      'dd/MM/yyyy',
      'MM/dd/yyyy',
      'yyyy/MM/dd',
      'dd-MM-yyyy',
      'MM-dd-yyyy',
      'dd.MM.yyyy'
    ];

    for (const fmt of formatsToTry) {
      const parsed = parse(value, fmt, new Date());
      if (isValid(parsed) && parsed.getFullYear() > 1900 && parsed.getFullYear() < 2100) {
        return parsed;
      }
    }

    const nativeParsed = new Date(value);
    if (isValid(nativeParsed) && nativeParsed.getFullYear() > 1900 && nativeParsed.getFullYear() < 2100) {
      return nativeParsed;
    }

    return null;
  };

  const handleConvert = (value: string) => {
    setInputDate(value);
    setError('');
    
    if (!value) {
      setOutputDate('');
      return;
    }

    try {
      if (mode === 'BS2AD') {
        const parts = value.split(/[-/.]/);
        if (parts.length === 3) {
          const [year, month, day] = parts.map(Number);
          if (year > 1900 && month >= 1 && month <= 12 && day >= 1 && day <= 32) {
            const bsDate = new NepaliDate(year, month - 1, day);
            const adDate = bsDate.toJsDate();
            setOutputDate(format(adDate, 'yyyy-MM-dd'));
          } else {
            setOutputDate('');
          }
        }
      } else {
        const parsedDate = parseADDate(value);
        if (parsedDate) {
          const bsDate = new NepaliDate(parsedDate);
          setOutputDate(bsDate.format('YYYY-MM-DD'));
        } else {
          setOutputDate('');
        }
      }
    } catch (err) {
      setOutputDate('');
      // Silent error for partial inputs
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'BS2AD' ? 'AD2BS' : 'BS2AD');
    setInputDate(outputDate);
    handleConvert(outputDate);
  };

  const handleDateSelect = (bsDateStr: string) => {
    if (mode === 'BS2AD') {
      handleConvert(bsDateStr);
    } else {
      try {
        const parts = bsDateStr.split(/[-/.]/);
        if (parts.length === 3) {
          const [year, month, day] = parts.map(Number);
          const bsDate = new NepaliDate(year, month - 1, day);
          const adDate = bsDate.toJsDate();
          const adDateStr = format(adDate, 'yyyy-MM-dd');
          setInputDate(adDateStr);
          setOutputDate(bsDateStr);
          setError('');
        }
      } catch (err) {
        // Ignore invalid dates
      }
    }
  };

  const copyToClipboard = () => {
    if (outputDate) {
      navigator.clipboard.writeText(outputDate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-red-900/5 border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
      >
        <motion.div layout className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Input Section */}
          <motion.div layout className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'BS2AD' ? 'Bikram Sambat (BS)' : 'Anno Domini (AD)'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={inputDate}
                onChange={(e) => handleConvert(e.target.value)}
                placeholder={mode === 'BS2AD' ? 'YYYY-MM-DD or YYYY/MM/DD' : 'YYYY-MM-DD, DD/MM/YYYY...'}
                className={cn(
                  "block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white sm:text-lg transition-all focus:ring-2 focus:border-transparent",
                  mode === 'BS2AD' ? "focus:ring-red-500" : "focus:ring-emerald-500"
                )}
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </motion.div>

          {/* Swap Button */}
          <motion.div layout className="flex-shrink-0 pt-6 md:pt-0 z-10">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              onClick={toggleMode}
              className="p-4 rounded-full bg-gradient-to-br from-red-500 to-emerald-500 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-emerald-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
              title="Swap conversion mode"
            >
              <ArrowRightLeft className="h-6 w-6" />
            </motion.button>
          </motion.div>

          {/* Output Section */}
          <motion.div layout className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'BS2AD' ? 'Anno Domini (AD)' : 'Bikram Sambat (BS)'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                readOnly
                value={outputDate}
                placeholder="Result"
                className="block w-full pl-10 pr-20 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white sm:text-lg font-medium"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyToClipboard}
                  disabled={!outputDate}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 transition-colors"
                  title="Copy to clipboard"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check className="h-5 w-5 text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!outputDate}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 transition-colors"
                  title="Share"
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Calendar View Integration */}
      <CalendarView 
        currentDate={mode === 'BS2AD' ? inputDate : outputDate} 
        mode="BS" 
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}
