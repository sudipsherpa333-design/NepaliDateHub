import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRightLeft, Scale, Ruler } from "lucide-react";

type Category = "weight" | "length";

const conversionRates = {
  weight: {
    kg: { pound: 2.20462, kg: 1 },
    pound: { kg: 0.453592, pound: 1 },
  },
  length: {
    km: { mile: 0.621371, km: 1 },
    mile: { km: 1.60934, mile: 1 },
  },
};

export function UnitConverter() {
  const [category, setCategory] = useState<Category>("weight");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("kg");
  const [toUnit, setToUnit] = useState<string>("pound");

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    if (cat === "weight") {
      setFromUnit("kg");
      setToUnit("pound");
    } else {
      setFromUnit("km");
      setToUnit("mile");
    }
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const calculateConversion = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return 0;
    // @ts-ignore
    const rate = conversionRates[category][fromUnit][toUnit];
    return (val * rate).toFixed(4);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Unit Converter
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Convert between metric and imperial units.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => handleCategoryChange("weight")}
            className={`flex items-center px-4 py-2 rounded-xl font-medium transition-colors ${
              category === "weight"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <Scale className="w-5 h-5 mr-2" />
            Weight
          </button>
          <button
            onClick={() => handleCategoryChange("length")}
            className={`flex items-center px-4 py-2 rounded-xl font-medium transition-colors ${
              category === "length"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <Ruler className="w-5 h-5 mr-2" />
            Length
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <div className="flex">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-3 rounded-l-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="px-4 py-3 rounded-r-xl border-y border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {category === "weight" ? (
                  <>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="pound">Pounds (lb)</option>
                  </>
                ) : (
                  <>
                    <option value="km">Kilometers (km)</option>
                    <option value="mile">Miles (mi)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mt-6 md:mt-0"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={calculateConversion()}
                className="w-full px-4 py-3 rounded-l-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-medium outline-none"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="px-4 py-3 rounded-r-xl border-y border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {category === "weight" ? (
                  <>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="pound">Pounds (lb)</option>
                  </>
                ) : (
                  <>
                    <option value="km">Kilometers (km)</option>
                    <option value="mile">Miles (mi)</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
