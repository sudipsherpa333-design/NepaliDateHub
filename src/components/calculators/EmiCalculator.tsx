import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Download, Calculator } from "lucide-react";

export function EmiCalculator() {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(10);
  const [tenure, setTenure] = useState<number>(5);
  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  const calculation = useMemo(() => {
    const p = Number(principal) || 0;
    const r = Number(rate) || 0;
    const t = Number(tenure) || 0;

    if (p <= 0 || r <= 0 || t <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0, schedule: [] };
    }

    const months = tenureType === "years" ? t * 12 : t;
    const monthlyRate = r / 12 / 100;

    const emi =
      (p * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - p;

    const schedule = [];
    let balance = p;
    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance -= principalPaid;
      schedule.push({
        month: i,
        emi: Math.round(emi),
        principal: Math.round(principalPaid),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance)),
      });
    }

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      schedule,
    };
  }, [principal, rate, tenure, tenureType]);

  const chartData = [
    { name: "Principal", value: Number(principal) || 0, color: "#3b82f6" }, // blue-500
    { name: "Interest", value: calculation.totalInterest, color: "#ef4444" }, // red-500
  ];

  const formatCurrency = (value: number) => {
    return (
      "रु " +
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
      }).format(value)
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          EMI Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Amount (NPR)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium px-1">रु</span>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={principal || ""}
                onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                placeholder="e.g. 1000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interest Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={rate || ""}
                onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                className="block w-full pr-8 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                placeholder="e.g. 10.5"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Tenure
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="1"
                step="1"
                value={tenure || ""}
                onChange={(e) => setTenure(Math.max(1, Number(e.target.value)))}
                className="block w-2/3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                placeholder="e.g. 5"
              />
              <select
                value={tenureType}
                onChange={(e) =>
                  setTenureType(e.target.value as "years" | "months")
                }
                className="block w-1/3 py-3 px-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
              >
                <option value="years">Yr</option>
                <option value="months">Mo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800/50"
            >
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                Monthly EMI
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(calculation.emi)}
              </h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.5,
                delay: 0.1,
              }}
              className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 dark:border-red-800/50"
            >
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                Total Interest
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(calculation.totalInterest)}
              </h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.5,
                delay: 0.2,
              }}
              className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/50"
            >
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                Total Payment
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(calculation.totalPayment)}
              </h3>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.5,
              delay: 0.2,
            }}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-center"
          >
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4 mt-6 md:mt-0 pl-0 md:pl-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Principal Amount
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {calculation.totalPayment > 0
                    ? Math.round(
                        (Number(principal) / calculation.totalPayment) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Interest
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {calculation.totalPayment > 0
                    ? Math.round(
                        (calculation.totalInterest / calculation.totalPayment) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Amortization Schedule */}
      {calculation.schedule.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Amortization Schedule
            </h3>
            <button className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-4">
                    EMI
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Principal
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Interest
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {calculation.schedule.map((row) => (
                  <tr
                    key={row.month}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {row.month}
                    </td>
                    <td className="px-6 py-4">{formatCurrency(row.emi)}</td>
                    <td className="px-6 py-4 text-blue-600 dark:text-blue-400">
                      {formatCurrency(row.principal)}
                    </td>
                    <td className="px-6 py-4 text-red-600 dark:text-red-400">
                      {formatCurrency(row.interest)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {formatCurrency(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
