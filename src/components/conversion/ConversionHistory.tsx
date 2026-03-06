import React, { useState } from 'react';
import { Search, Filter, Clock, ArrowRight, Trash2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/cn';

// Mock data for history
const mockHistory = [
  { id: 1, input: '2078-01-01', output: '2021-04-14', type: 'BS2AD', date: '2023-10-25T10:30:00Z' },
  { id: 2, input: '2023-12-25', output: '2080-09-09', type: 'AD2BS', date: '2023-10-24T14:15:00Z' },
  { id: 3, input: '2050-05-15', output: '1993-08-30', type: 'BS2AD', date: '2023-10-23T09:45:00Z' },
  { id: 4, input: '2000-01-01', output: '2056-09-17', type: 'AD2BS', date: '2023-10-22T16:20:00Z' },
  { id: 5, input: '2081-12-30', output: '2025-04-12', type: 'BS2AD', date: '2023-10-21T11:10:00Z' },
];

export function ConversionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'BS2AD' | 'AD2BS'>('ALL');

  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.input.includes(searchTerm) || item.output.includes(searchTerm);
    const matchesType = filterType === 'ALL' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-red-900/5 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      {/* Header and Controls */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-red-500" />
            Conversion History
          </h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search dates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white sm:text-sm transition-colors"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
            >
              <option value="ALL">All Types</option>
              <option value="BS2AD">BS to AD</option>
              <option value="AD2BS">AD to BS</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Conversion
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <AnimatePresence>
            {filteredHistory.map((item, index) => (
              <motion.tr 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.date).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.input}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">{item.output}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                    item.type === 'BS2AD' 
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                  )}>
                    {item.type === 'BS2AD' ? 'BS → AD' : 'AD → BS'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Copy
                  </motion.button>
                </td>
              </motion.tr>
            ))}
            </AnimatePresence>
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  No conversion history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
