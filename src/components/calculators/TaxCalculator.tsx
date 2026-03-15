import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Landmark, Info } from "lucide-react";

export function TaxCalculator() {
  const [income, setIncome] = useState<number>(600000);
  const [taxpayerType, setTaxpayerType] = useState<"individual" | "couple">(
    "individual",
  );
  const [ssf, setSsf] = useState<number>(0);
  const [insurance, setInsurance] = useState<number>(0);
  const [pf, setPf] = useState<number>(0);
  const [cit, setCit] = useState<number>(0);

  const calculation = useMemo(() => {
    const grossIncome = Number(income) || 0;

    // Deductions
    const maxInsurance = 40000;
    const actualInsurance = Math.min(Number(insurance) || 0, maxInsurance);
    const actualSsf = Number(ssf) || 0;
    const actualPf = Number(pf) || 0;
    const actualCit = Number(cit) || 0;

    // Max deduction for PF + CIT is 300,000 or 1/3 of gross income, whichever is lower
    const maxPfCit = Math.min(300000, grossIncome / 3);
    const allowedPfCit = Math.min(actualPf + actualCit, maxPfCit);

    const totalDeductions = actualInsurance + actualSsf + allowedPfCit;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    let tax = 0;
    let remainingIncome = taxableIncome;
    const slabs = [];

    if (taxpayerType === "individual") {
      // Slab 1: Up to 5,000,000 (1%)
      if (remainingIncome > 0) {
        const amountInSlab = Math.min(remainingIncome, 500000);
        const taxInSlab = amountInSlab * 0.01;
        tax += taxInSlab;
        slabs.push({
          name: "Up to 5 Lakhs",
          rate: "1%",
          amount: amountInSlab,
          tax: taxInSlab,
        });
        remainingIncome -= amountInSlab;
      }

      // Slab 2: 5,000,000 to 7,000,000 (10%)
      if (remainingIncome > 0) {
        const amountInSlab = Math.min(remainingIncome, 200000);
        const taxInSlab = amountInSlab * 0.1;
        tax += taxInSlab;
        slabs.push({
          name: "5 to 7 Lakhs",
          rate: "10%",
          amount: amountInSlab,
          tax: taxInSlab,
        });
        remainingIncome -= amountInSlab;
      }

      // Slab 3: 7,000,000 to 10,000,000 (20%)
      if (remainingIncome > 0) {
        const amountInSlab = Math.min(remainingIncome, 300000);
        const taxInSlab = amountInSlab * 0.2;
        tax += taxInSlab;
        slabs.push({
          name: "7 to 10 Lakhs",
          rate: "20%",
          amount: amountInSlab,
          tax: taxInSlab,
        });
        remainingIncome -= amountInSlab;
      }

      // Slab 4: 10,000,000 to 20,000,000 (30%)
      if (remainingIncome > 0) {
        const amountInSlab = Math.min(remainingIncome, 1000000);
        const taxInSlab = amountInSlab * 0.3;
        tax += taxInSlab;
        slabs.push({
          name: "10 to 20 Lakhs",
          rate: "30%",
          amount: amountInSlab,
          tax: taxInSlab,
        });
        remainingIncome -= amountInSlab;
      }

      // Slab 5: Above 20,000,000 (36%)
      if (remainingIncome > 0) {
        const taxInSlab = remainingIncome * 0.36;
        tax += taxInSlab;
        slabs.push({
          name: "Above 20 Lakhs",
          rate: "36%",
          amount: remainingIncome,
          tax: taxInSlab,
        });
      }
    } else {
      // Couple
      // Slab 1: Up to 6,000,000 (1%)
      if (remainingIncome > 0) {
        const amountInSlab = Math.min(remainingIncome, 600000);
        const taxInSlab = amountInSlab * 0.01;
        tax += taxInSlab;
        slabs.push({
          name: "Up to 6 Lakhs",
          rate: "1%",
          amount: amountInSlab,
          tax: taxInSlab,
        });
        remainingIncome -= amountInSlab;
      }

      // Slab 2: 6,000,000 to 8,000,000 (10%)
      if (remainingIncome > 0) {
        const amountInSlab = Math.min(remainingIncome, 200000);
        const taxInSlab = amountInSlab * 0.1;
        tax += taxInSlab;
        slabs.push({
          name: "6 to 8 Lakhs",
          rate: "10%",
          amount: amountInSlab,
          tax: taxInSlab,
        });
        remainingIncome -= amountInSlab;
      }

      // Slab 3: 8,000,000 to 11,000,000 (20%)
      if (remainingIncome > 0) {
        const amountInSlab = Math.min(remainingIncome, 300000);
        const taxInSlab = amountInSlab * 0.2;
        tax += taxInSlab;
        slabs.push({
          name: "8 to 11 Lakhs",
          rate: "20%",
          amount: amountInSlab,
          tax: taxInSlab,
        });
        remainingIncome -= amountInSlab;
      }

      // Slab 4: 11,000,000 to 20,000,000 (30%)
      if (remainingIncome > 0) {
        const amountInSlab = Math.min(remainingIncome, 900000);
        const taxInSlab = amountInSlab * 0.3;
        tax += taxInSlab;
        slabs.push({
          name: "11 to 20 Lakhs",
          rate: "30%",
          amount: amountInSlab,
          tax: taxInSlab,
        });
        remainingIncome -= amountInSlab;
      }

      // Slab 5: Above 20,000,000 (36%)
      if (remainingIncome > 0) {
        const taxInSlab = remainingIncome * 0.36;
        tax += taxInSlab;
        slabs.push({
          name: "Above 20 Lakhs",
          rate: "36%",
          amount: remainingIncome,
          tax: taxInSlab,
        });
      }
    }

    return {
      grossIncome,
      totalDeductions,
      taxableIncome,
      totalTax: tax,
      monthlyTax: tax / 12,
      effectiveRate: grossIncome > 0 ? (tax / grossIncome) * 100 : 0,
      slabs,
    };
  }, [income, taxpayerType, ssf, insurance, pf, cit]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Landmark className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Income Tax Calculator
          </h2>
        </div>
        <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium border border-purple-100 dark:border-purple-800/50">
          FY 2080/81
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
              Income Details
            </h3>

            <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
              <button
                onClick={() => setTaxpayerType("individual")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                  taxpayerType === "individual"
                    ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setTaxpayerType("couple")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                  taxpayerType === "couple"
                    ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Couple
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Annual Gross Income (NPR)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium px-1">रु</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={income || ""}
                  onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="e.g. 1200000"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
              Deductions (Annual)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Life Insurance
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={insurance || ""}
                  onChange={(e) => setInsurance(Math.max(0, Number(e.target.value)))}
                  className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="Max 40,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provident Fund (PF)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={pf || ""}
                  onChange={(e) => setPf(Math.max(0, Number(e.target.value)))}
                  className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="e.g. 120000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Citizen Investment Trust (CIT)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={cit || ""}
                  onChange={(e) => setCit(Math.max(0, Number(e.target.value)))}
                  className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="e.g. 50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Social Security Fund (SSF)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={ssf || ""}
                  onChange={(e) => setSsf(Math.max(0, Number(e.target.value)))}
                  className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="e.g. 0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-3xl shadow-lg text-white"
          >
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-purple-200 font-medium mb-1">
                  Total Tax Liability
                </p>
                <h3 className="text-4xl font-extrabold">
                  {formatCurrency(calculation.totalTax)}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-purple-400/30">
              <div>
                <p className="text-purple-200 text-sm mb-1">Monthly Tax</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(calculation.monthlyTax)}
                </p>
              </div>
              <div>
                <p className="text-purple-200 text-sm mb-1">Effective Rate</p>
                <p className="font-semibold text-lg">
                  {calculation.effectiveRate.toFixed(2)}%
                </p>
              </div>
            </div>
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
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
              Calculation Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Gross Income
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(calculation.grossIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Deductions
                </span>
                <span className="font-semibold text-red-500 dark:text-red-400">
                  - {formatCurrency(calculation.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-900 dark:text-white">
                  Taxable Income
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatCurrency(calculation.taxableIncome)}
                </span>
              </div>
            </div>
          </motion.div>

          {calculation.slabs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.5,
                delay: 0.2,
              }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Tax Breakdown
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Slab
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Rate
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Tax
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculation.slabs.map((slab, index) => (
                      <tr
                        key={index}
                        className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {slab.name}
                        </td>
                        <td className="px-6 py-4">{slab.rate}</td>
                        <td className="px-6 py-4">
                          {formatCurrency(slab.amount)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-purple-600 dark:text-purple-400">
                          {formatCurrency(slab.tax)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
