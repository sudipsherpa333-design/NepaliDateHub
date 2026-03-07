import React from "react";
import { motion } from "motion/react";
import { Shield, Lock, Eye, Database } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white"
        >
          Privacy <span className="text-emerald-600 dark:text-emerald-500">Policy</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Your privacy is critically important to us. Learn how we collect, use, and protect your data.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12 space-y-8"
      >
        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-500 mb-4">
            <Shield className="h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Protection</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            At CalcHub Nepal, we prioritize the security and confidentiality of your financial data. All calculations performed on our platform are processed locally within your browser. We do not store, transmit, or share your personal financial inputs with any third-party servers.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-500 mb-4">
            <Database className="h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information Collection</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We collect minimal information necessary to provide and improve our services. This may include anonymous usage statistics, browser type, and device information. We do not collect personally identifiable information (PII) unless explicitly provided by you for support or account creation purposes.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-500 mb-4">
            <Lock className="h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Measures</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We implement industry-standard security measures to protect against unauthorized access, alteration, disclosure, or destruction of data. Our website uses HTTPS encryption to ensure secure communication between your browser and our servers.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-500 mb-4">
            <Eye className="h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Third-Party Services</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We may use third-party analytics tools (such as Google Analytics) to understand how users interact with our website. These tools may use cookies to collect anonymous data. You can opt-out of these analytics by adjusting your browser settings or using available opt-out mechanisms.
          </p>
        </section>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: March 2026. If you have any questions about this Privacy Policy, please contact us at privacy@calchubnepal.com.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
