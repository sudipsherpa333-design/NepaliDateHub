import React, { useState } from "react";
import { motion } from "motion/react";
import { Calculator, Percent, Clock } from "lucide-react";

export function LoanCalculator() {
  const [principal, setPrincipal] = useState<string>("100000");
  const [rate, setRate] = useState<string>("10");
  const [time, setTime] = useState<string>("1");
  const [timeUnit, setTimeUnit] = useState<"years" | "months">("years");

  const calculateInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    let t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) return { interest: 0, total: 0 };

    if (timeUnit === "months") {
      t = t / 12;
    }

    const interest = (p * r * t) / 100;
    const total = p + interest;

    return { interest, total };
  };

  const { interest, total } = calculateInterest();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Loan Interest Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate simple interest on your loans or investments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Principal Amount (रु)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 font-medium">रु</span>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="100000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interest Rate (% per annum)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Percent className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Period
            </label>
            <div className="flex">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-l-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="1"
                />
              </div>
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as "years" | "months")}
                className="px-4 py-3 rounded-r-xl border-y border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg"
          >
            <h3 className="text-blue-100 font-medium mb-2">Total Interest</h3>
            <div className="text-3xl font-bold mb-6">
              रु {interest.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </div>

            <h3 className="text-blue-100 font-medium mb-2">Total Amount</h3>
            <div className="text-3xl font-bold">
              रु {total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
