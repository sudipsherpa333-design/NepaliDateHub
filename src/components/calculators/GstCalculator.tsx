import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Percent, ArrowRightLeft } from "lucide-react";

export function GstCalculator() {
  const [amount, setAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number | "custom">(18);
  const [customRate, setCustomRate] = useState<number>(0);
  const [mode, setMode] = useState<"add" | "remove">("add");

  const GST_RATES = [5, 12, 18, 28, "custom"];

  const calculation = useMemo(() => {
    const p = Number(amount) || 0;
    const r = gstRate === "custom" ? Number(customRate) || 0 : Number(gstRate);

    if (p <= 0 || r < 0) {
      return { basePrice: 0, gstAmount: 0, totalPrice: 0, cgst: 0, sgst: 0 };
    }

    let basePrice, gstAmount, totalPrice;

    if (mode === "add") {
      basePrice = p;
      gstAmount = p * (r / 100);
      totalPrice = p + gstAmount;
    } else {
      totalPrice = p;
      basePrice = p / (1 + r / 100);
      gstAmount = p - basePrice;
    }

    return {
      basePrice,
      gstAmount,
      totalPrice,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
    };
  }, [amount, gstRate, customRate, mode]);

  const formatCurrency = (value: number) => {
    return (
      "रु " +
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
      }).format(value)
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
          <Percent className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          GST Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          {/* Mode Toggle */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
            <button
              onClick={() => setMode("add")}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                mode === "add"
                  ? "bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <span>Add GST</span>
              <span className="text-xs opacity-70">(Exclusive)</span>
            </button>
            <button
              onClick={() => setMode("remove")}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                mode === "remove"
                  ? "bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <span>Remove GST</span>
              <span className="text-xs opacity-70">(Inclusive)</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === "add" ? "Base Amount (NPR)" : "Total Amount (NPR)"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium px-1">रु</span>
              </div>
              <input
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="block w-full pl-10 pr-3 py-4 text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-amber-500 focus:border-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                placeholder="e.g. 1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GST Rate (%)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {GST_RATES.map((rate) => (
                <button
                  key={rate}
                  onClick={() => setGstRate(rate as number)}
                  className={`py-3 px-2 text-sm font-medium rounded-xl transition-all border ${
                    gstRate === rate
                      ? "bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/30 dark:border-amber-500 dark:text-amber-300"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {rate === "custom" ? "Custom" : `${rate}%`}
                </button>
              ))}
            </div>

            {gstRate === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 relative"
              >
                <input
                  type="number"
                  step="0.1"
                  value={customRate || ""}
                  onChange={(e) => setCustomRate(Number(e.target.value))}
                  className="block w-full pr-8 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-amber-500 focus:border-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="Enter custom rate"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-3xl shadow-lg text-white"
          >
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-amber-100 font-medium mb-1">Total Amount</p>
                <h3 className="text-4xl font-extrabold">
                  {formatCurrency(calculation.totalPrice)}
                </h3>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-amber-400/30">
              <div className="flex justify-between items-center">
                <span className="text-amber-100">Base Price</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(calculation.basePrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-100">
                  Total GST ({gstRate === "custom" ? customRate : gstRate}%)
                </span>
                <span className="font-semibold text-lg">
                  {formatCurrency(calculation.gstAmount)}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.5,
                delay: 0.1,
              }}
              className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                CGST (
                {(gstRate === "custom" ? customRate : (gstRate as number)) / 2}
                %)
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(calculation.cgst)}
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
              className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                SGST (
                {(gstRate === "custom" ? customRate : (gstRate as number)) / 2}
                %)
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(calculation.sgst)}
              </h3>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
