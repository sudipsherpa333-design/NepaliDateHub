import React from "react";
import {
  Calculator,
  Calendar,
  Percent,
  Landmark,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  onSelectCalculator: (calc: "emi" | "age" | "gst" | "tax") => void;
}

export function Dashboard({ onSelectCalculator }: DashboardProps) {
  const calculators = [
    {
      id: "emi",
      name: "EMI Calculator",
      description: "Calculate Equated Monthly Installments for loans",
      icon: <Calculator className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      id: "age",
      name: "Age Calculator",
      description: "Calculate age in BS and AD with detailed breakdown",
      icon: <Calendar className="h-8 w-8 text-emerald-500" />,
      color: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    {
      id: "gst",
      name: "GST Calculator",
      description: "Add or remove Goods and Services Tax instantly",
      icon: <Percent className="h-8 w-8 text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      id: "tax",
      name: "Tax Calculator (Nepal)",
      description: "Calculate income tax based on current FY slabs",
      icon: <Landmark className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white"
        >
          CalcHub <span className="text-red-600 dark:text-red-500">Nepal</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Your comprehensive suite of calculators designed specifically for
          Nepal. Fast, accurate, and easy to use.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculators.map((calc, index) => (
          <motion.div
            key={calc.id}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              bounce: 0.3,
              duration: 0.6,
              delay: index * 0.1,
            }}
            whileHover={{
              y: -5,
              scale: 1.02,
              transition: { type: "spring", bounce: 0.4, duration: 0.4 },
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCalculator(calc.id as any)}
            className={`cursor-pointer rounded-3xl p-6 border ${calc.borderColor} ${calc.color} shadow-sm hover:shadow-md transition-all duration-300 group`}
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                {calc.icon}
              </div>
              <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {calc.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {calc.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
