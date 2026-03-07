import React, { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock } from "lucide-react";

export function TimeDifferenceCalculator() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const calculateDifference = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    return { diffDays, diffHours, diffMinutes };
  };

  const result = calculateDifference();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Time Difference
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate the exact time between two dates.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date & Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date & Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50 text-center"
          >
            <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-4">
              Time Difference
            </h3>
            <div className="flex justify-center items-center space-x-4 md:space-x-8">
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-purple-700 dark:text-purple-400">
                  {result.diffDays}
                </span>
                <span className="text-sm text-purple-600 dark:text-purple-300 uppercase tracking-wider mt-1">
                  Days
                </span>
              </div>
              <div className="text-2xl text-purple-300 dark:text-purple-700">:</div>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-purple-700 dark:text-purple-400">
                  {result.diffHours}
                </span>
                <span className="text-sm text-purple-600 dark:text-purple-300 uppercase tracking-wider mt-1">
                  Hours
                </span>
              </div>
              <div className="text-2xl text-purple-300 dark:text-purple-700">:</div>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-purple-700 dark:text-purple-400">
                  {result.diffMinutes}
                </span>
                <span className="text-sm text-purple-600 dark:text-purple-300 uppercase tracking-wider mt-1">
                  Minutes
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
