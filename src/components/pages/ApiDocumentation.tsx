import React, { useState } from "react";
import { motion } from "motion/react";
import { Code, Terminal, Server, Key, Copy, CheckCircle2 } from "lucide-react";

export function ApiDocumentation() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpointId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpointId);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white"
        >
          API <span className="text-purple-600 dark:text-purple-500">Documentation</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Integrate CalcHub Nepal's powerful calculation engines directly into your applications.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Server className="h-5 w-5 mr-2 text-purple-500" />
              Getting Started
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#authentication" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors">Authentication</a>
              </li>
              <li>
                <a href="#base-url" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors">Base URL</a>
              </li>
              <li>
                <a href="#rate-limits" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors">Rate Limits</a>
              </li>
            </ul>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center">
              <Code className="h-5 w-5 mr-2 text-purple-500" />
              Endpoints
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#calculate-emi" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors flex items-center justify-between">
                  <span>Calculate EMI</span>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-2 py-0.5 rounded font-mono uppercase">POST</span>
                </a>
              </li>
              <li>
                <a href="#calculate-tax" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors flex items-center justify-between">
                  <span>Calculate Tax</span>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-2 py-0.5 rounded font-mono uppercase">POST</span>
                </a>
              </li>
              <li>
                <a href="#convert-date" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors flex items-center justify-between">
                  <span>Convert Date</span>
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded font-mono uppercase">GET</span>
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Authentication Section */}
          <div id="authentication" className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Key className="h-6 w-6 mr-3 text-purple-500" />
              Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              All API requests require a valid API key to be included in the header. You can generate an API key from your developer dashboard.
            </p>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <code className="text-purple-400 font-mono text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </div>

          {/* Base URL Section */}
          <div id="base-url" className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Globe className="h-6 w-6 mr-3 text-purple-500" />
              Base URL
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The base URL for all API endpoints is:
            </p>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto flex justify-between items-center group">
              <code className="text-green-400 font-mono text-sm">
                https://api.calchubnepal.com/v1
              </code>
              <button 
                onClick={() => copyToClipboard("https://api.calchubnepal.com/v1", "base")}
                className="text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              >
                {copiedEndpoint === "base" ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Endpoint: Calculate EMI */}
          <div id="calculate-emi" className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 px-3 py-1 rounded-md font-mono text-sm font-bold">POST</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono">/calculate/emi</h3>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-600 dark:text-gray-300">
                Calculates Equated Monthly Installment (EMI) along with total interest and payment schedule.
              </p>
              
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Request Body</h4>
                <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto relative group">
                  <button 
                    onClick={() => copyToClipboard(`{\n  "principal": 1000000,\n  "rate": 10.5,\n  "tenure": 5,\n  "tenureType": "years"\n}`, "req-emi")}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {copiedEndpoint === "req-emi" ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <pre className="text-gray-300 font-mono text-sm">
{`{
  "principal": 1000000,
  "rate": 10.5,
  "tenure": 5,
  "tenureType": "years" // or "months"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Response</h4>
                <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-gray-300 font-mono text-sm">
{`{
  "success": true,
  "data": {
    "emi": 21494.00,
    "totalInterest": 289640.00,
    "totalPayment": 1289640.00,
    "schedule": [
      {
        "month": 1,
        "principal": 12744.00,
        "interest": 8750.00,
        "balance": 987256.00
      }
      // ... remaining months
    ]
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Endpoint: Calculate Tax */}
          <div id="calculate-tax" className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 px-3 py-1 rounded-md font-mono text-sm font-bold">POST</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono">/calculate/tax</h3>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-600 dark:text-gray-300">
                Calculates income tax based on current Nepal Government tax slabs.
              </p>
              
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Request Body</h4>
                <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto relative group">
                  <button 
                    onClick={() => copyToClipboard(`{\n  "income": 1200000,\n  "type": "individual",\n  "deductions": {\n    "ssf": 0,\n    "pf": 0,\n    "cit": 0,\n    "insurance": 40000\n  }\n}`, "req-tax")}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {copiedEndpoint === "req-tax" ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <pre className="text-gray-300 font-mono text-sm">
{`{
  "income": 1200000,
  "type": "individual", // or "couple"
  "deductions": {
    "ssf": 0,
    "pf": 0,
    "cit": 0,
    "insurance": 40000
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
