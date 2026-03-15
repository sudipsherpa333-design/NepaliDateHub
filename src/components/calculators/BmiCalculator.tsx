import React, { useState } from "react";
import { motion } from "motion/react";
import { Activity, Ruler, Weight } from "lucide-react";

export function BmiCalculator() {
  const [height, setHeight] = useState<string>("170");
  const [weight, setWeight] = useState<string>("70");

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // convert cm to m
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return null;

    const bmi = w / (h * h);
    let category = "";
    let color = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = "Normal weight";
      color = "text-emerald-500";
    } else if (bmi >= 25 && bmi < 29.9) {
      category = "Overweight";
      color = "text-amber-500";
    } else {
      category = "Obese";
      color = "text-red-500";
    }

    return { bmi: bmi.toFixed(1), category, color };
  };

  const result = calculateBMI();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          BMI Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Check your Body Mass Index to evaluate your health.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height (cm)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Ruler className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="170"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Weight className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="70"
              />
            </div>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4">
              <Activity className={`h-8 w-8 ${result.color}`} />
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Your BMI is</h3>
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {result.bmi}
            </div>
            <div className={`text-xl font-semibold ${result.color}`}>
              {result.category}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
