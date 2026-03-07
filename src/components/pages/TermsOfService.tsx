import React from "react";
import { motion } from "motion/react";
import { FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react";

export function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white"
        >
          Terms of <span className="text-blue-600 dark:text-blue-500">Service</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Please read these terms carefully before using CalcHub Nepal.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12 space-y-8"
      >
        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-500 mb-4">
            <FileText className="h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acceptance of Terms</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            By accessing and using CalcHub Nepal, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-500 mb-4">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Disclaimer of Accuracy</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            The calculators provided on this website are for informational and educational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 mt-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              Important: Always consult with a qualified financial advisor or tax professional before making any financial decisions based on the results provided by these calculators.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-500 mb-4">
            <Scale className="h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Limitation of Liability</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-500 mb-4">
            <CheckCircle className="h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Responsibilities</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
            <li>You agree to use the service only for lawful purposes.</li>
            <li>You must not use the service in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.</li>
            <li>You must not use the website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.</li>
          </ul>
        </section>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: March 2026. We reserve the right to modify these terms at any time.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
