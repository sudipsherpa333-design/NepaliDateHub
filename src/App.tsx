import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Calculator,
  Calendar,
  Percent,
  Landmark,
  Settings,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, useLocation, useNavigate, Link } from "react-router-dom";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Dashboard } from "./components/calculators/Dashboard";
import { EmiCalculator } from "./components/calculators/EmiCalculator";
import { AgeCalculator } from "./components/calculators/AgeCalculator";
import { GstCalculator } from "./components/calculators/GstCalculator";
import { TaxCalculator } from "./components/calculators/TaxCalculator";
import { PrivacyPolicy } from "./components/pages/PrivacyPolicy";
import { TermsOfService } from "./components/pages/TermsOfService";
import { ApiDocumentation } from "./components/pages/ApiDocumentation";

import { UnitConverter } from "./components/calculators/UnitConverter";
import { LoanCalculator } from "./components/calculators/LoanCalculator";
import { TimeDifferenceCalculator } from "./components/calculators/TimeDifferenceCalculator";
import { BmiCalculator } from "./components/calculators/BmiCalculator";
import { DateConverter } from "./components/conversion/DateConverter";
import { BlogView } from "./components/blog/BlogView";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  React.useEffect(() => {
    const auth = localStorage.getItem("calchub_admin_auth");
    if (auth === "true") {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem("calchub_admin_auth");
    setIsAdminLoggedIn(false);
    navigate("/");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    {
      id: "emi",
      label: "EMI",
      icon: <Calculator className="h-4 w-4" />,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/40",
      path: "/emi"
    },
    {
      id: "age",
      label: "Age",
      icon: <Calendar className="h-4 w-4" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/40",
      path: "/age"
    },
    {
      id: "gst",
      label: "GST",
      icon: <Percent className="h-4 w-4" />,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/40",
      path: "/gst"
    },
    {
      id: "tax",
      label: "Tax",
      icon: <Landmark className="h-4 w-4" />,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/40",
      path: "/tax"
    },
    {
      id: "blog",
      label: "Blog",
      icon: <Globe className="h-4 w-4" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/40",
      path: "/blog"
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 relative overflow-hidden ${isDarkMode ? "dark text-white" : "text-gray-900"}`}
    >
      <Helmet>
        <title>CalcHub Nepal | Finance & Utility Calculators</title>
        <meta name="description" content="CalcHub - Your ultimate utility and finance calculators. Calculate EMI, Age, GST, Tax, and more." />
        <meta name="keywords" content="calculator, finance, nepal, emi, tax, unit converter, age calculator, gst calculator" />
        <meta property="og:title" content="CalcHub Nepal" />
        <meta property="og:description" content="CalcHub - Your ultimate utility and finance calculators." />
        <meta property="og:type" content="website" />
      </Helmet>
      <AnimatedBackground />
      {/* Navigation */}
      <nav className="border-b border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-950/60 backdrop-blur-2xl sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Calculator className="h-8 w-8 text-red-600 dark:text-red-500" />
              <span className="ml-2 text-xl font-bold font-sans tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-emerald-600 dark:from-red-500 dark:to-emerald-400">
                CalcHub Nepal
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {location.pathname !== "/" && (
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50 mr-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
              )}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === item.path ? `${item.color} ${item.bg} shadow-sm` : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50"}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAdminLoggedIn && (
                <button
                  onClick={() => navigate("/admin")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === "/admin" ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50"}`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button 
                onClick={() => navigate("/admin")}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-lg"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => {
                    navigate("/");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all ${location.pathname === "/" ? "text-gray-900 bg-gray-100 dark:bg-gray-800 dark:text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50"}`}
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all ${location.pathname === item.path ? `${item.color} ${item.bg} shadow-sm` : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50"}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <Dashboard />
              </motion.div>
            } />
            <Route path="/emi" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <EmiCalculator />
              </motion.div>
            } />
            <Route path="/age" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <AgeCalculator />
              </motion.div>
            } />
            <Route path="/gst" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <GstCalculator />
              </motion.div>
            } />
            <Route path="/tax" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <TaxCalculator />
              </motion.div>
            } />
            <Route path="/unit" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <UnitConverter />
              </motion.div>
            } />
            <Route path="/loan" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <LoanCalculator />
              </motion.div>
            } />
            <Route path="/time" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <TimeDifferenceCalculator />
              </motion.div>
            } />
            <Route path="/bmi" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <BmiCalculator />
              </motion.div>
            } />
            <Route path="/date" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <DateConverter />
              </motion.div>
            } />
            <Route path="/blog" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <BlogView />
              </motion.div>
            } />
            <Route path="/admin" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                {isAdminLoggedIn ? (
                  <AdminDashboard onLogout={handleAdminLogout} />
                ) : (
                  <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
                )}
              </motion.div>
            } />
            <Route path="/privacy" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <PrivacyPolicy />
              </motion.div>
            } />
            <Route path="/terms" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <TermsOfService />
              </motion.div>
            } />
            <Route path="/api-docs" element={
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <ApiDocumentation />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-gray-950/60 backdrop-blur-2xl border-t border-gray-200/50 dark:border-gray-800/50 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} CalcHub Nepal. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/privacy")}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate("/api-docs")}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              API Documentation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
