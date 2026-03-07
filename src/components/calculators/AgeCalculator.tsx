import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, Star, Info } from "lucide-react";
import NepaliDate from "nepali-date-converter";
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInWeeks,
  differenceInHours,
  addYears,
  format,
} from "date-fns";

export function AgeCalculator() {
  const [calendarType, setCalendarType] = useState<"AD" | "BS">("AD");

  // Store the underlying AD dates for calculation
  const [dobAD, setDobAD] = useState<string>("");
  const [asOfDateAD, setAsOfDateAD] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  // Display values for inputs
  const [dobInput, setDobInput] = useState<string>("");
  const [asOfDateInput, setAsOfDateInput] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const [age, setAge] = useState<{
    years: number;
    months: number;
    days: number;
  } | null>(null);
  const [totalStats, setTotalStats] = useState<{
    months: number;
    weeks: number;
    days: number;
    hours: number;
  } | null>(null);
  const [nextBirthday, setNextBirthday] = useState<{
    days: number;
    date: string;
  } | null>(null);

  // Initialize BS date for today
  useEffect(() => {
    if (calendarType === "BS") {
      try {
        const todayBS = new NepaliDate();
        setAsOfDateInput(todayBS.format("YYYY-MM-DD"));
        if (dobAD) {
          const bsDob = new NepaliDate(new Date(dobAD));
          setDobInput(bsDob.format("YYYY-MM-DD"));
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setAsOfDateInput(asOfDateAD);
      setDobInput(dobAD);
    }
  }, [calendarType]);

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDobInput(val);

    if (!val) {
      setDobAD("");
      return;
    }

    if (calendarType === "BS") {
      try {
        const parts = val.split(/[-/]/);
        if (parts.length === 3) {
          const [y, m, d] = parts.map(Number);
          if (y > 1900 && m >= 1 && m <= 12 && d >= 1 && d <= 32) {
            const bsDate = new NepaliDate(y, m - 1, d);
            setDobAD(format(bsDate.toJsDate(), "yyyy-MM-dd"));
          }
        }
      } catch (err) {
        // Invalid BS date
      }
    } else {
      setDobAD(val);
    }
  };

  const handleAsOfDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAsOfDateInput(val);

    if (!val) {
      setAsOfDateAD("");
      return;
    }

    if (calendarType === "BS") {
      try {
        const parts = val.split(/[-/]/);
        if (parts.length === 3) {
          const [y, m, d] = parts.map(Number);
          if (y > 1900 && m >= 1 && m <= 12 && d >= 1 && d <= 32) {
            const bsDate = new NepaliDate(y, m - 1, d);
            setAsOfDateAD(format(bsDate.toJsDate(), "yyyy-MM-dd"));
          }
        }
      } catch (err) {
        // Invalid BS date
      }
    } else {
      setAsOfDateAD(val);
    }
  };

  useEffect(() => {
    if (dobAD && asOfDateAD) {
      calculateAge();
    } else {
      setAge(null);
      setTotalStats(null);
      setNextBirthday(null);
    }
  }, [dobAD, asOfDateAD]);

  const calculateAge = () => {
    try {
      const start = new Date(dobAD);
      const end = new Date(asOfDateAD);

      if (start > end) {
        setAge(null);
        return;
      }

      // Exact Age
      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth();
      let days = end.getDate() - start.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      setAge({ years, months, days });

      // Total Stats
      const totalMonths = differenceInMonths(end, start);
      const totalWeeks = differenceInWeeks(end, start);
      const totalDays = differenceInDays(end, start);
      const totalHours = differenceInHours(end, start);

      setTotalStats({
        months: totalMonths,
        weeks: totalWeeks,
        days: totalDays,
        hours: totalHours,
      });

      // Next Birthday
      let nextBday = new Date(start);
      nextBday.setFullYear(end.getFullYear());
      if (nextBday < end) {
        nextBday.setFullYear(end.getFullYear() + 1);
      }
      const daysToNextBday = differenceInDays(nextBday, end);

      let nextBdayDisplay = nextBday.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (calendarType === "BS") {
        try {
          const bsNextBday = new NepaliDate(nextBday);
          nextBdayDisplay = bsNextBday.format("YYYY MMMM DD");
        } catch (e) {}
      }

      setNextBirthday({
        days: daysToNextBday,
        date: nextBdayDisplay,
      });
    } catch (e) {
      console.error("Error calculating age", e);
    }
  };

  const getZodiacSign = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return "Aries ♈";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return "Taurus ♉";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
      return "Gemini ♊";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
      return "Cancer ♋";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
      return "Leo ♌";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
      return "Virgo ♍";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
      return "Libra ♎";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
      return "Scorpio ♏";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
      return "Sagittarius ♐";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return "Capricorn ♑";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return "Aquarius ♒";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
      return "Pisces ♓";
    return "";
  };

  const getGeneration = (dateString: string) => {
    if (!dateString) return "";
    const year = new Date(dateString).getFullYear();
    if (year >= 1928 && year <= 1945) return "Silent Generation";
    if (year >= 1946 && year <= 1964) return "Baby Boomers";
    if (year >= 1965 && year <= 1980) return "Generation X";
    if (year >= 1981 && year <= 1996) return "Millennials (Gen Y)";
    if (year >= 1997 && year <= 2012) return "Generation Z";
    if (year >= 2013) return "Generation Alpha";
    return "Unknown";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
          <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Age Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
            <button
              onClick={() => setCalendarType("AD")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                calendarType === "AD"
                  ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              AD (Gregorian)
            </button>
            <button
              onClick={() => setCalendarType("BS")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                calendarType === "BS"
                  ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              BS (Nepali)
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date of Birth ({calendarType})
            </label>
            <input
              type={calendarType === "AD" ? "date" : "text"}
              placeholder={calendarType === "BS" ? "YYYY-MM-DD" : ""}
              value={dobInput}
              onChange={handleDobChange}
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Age at the Date of ({calendarType})
            </label>
            <input
              type={calendarType === "AD" ? "date" : "text"}
              placeholder={calendarType === "BS" ? "YYYY-MM-DD" : ""}
              value={asOfDateInput}
              onChange={handleAsOfDateChange}
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {age ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl shadow-lg text-white text-center"
              >
                <h3 className="text-emerald-100 font-medium mb-2">Exact Age</h3>
                <div className="flex justify-center items-baseline space-x-4">
                  <div className="flex flex-col items-center">
                    <span className="text-5xl md:text-6xl font-extrabold">
                      {age.years}
                    </span>
                    <span className="text-sm md:text-base font-medium opacity-80 mt-1">
                      Years
                    </span>
                  </div>
                  <span className="text-3xl opacity-50">,</span>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl md:text-6xl font-extrabold">
                      {age.months}
                    </span>
                    <span className="text-sm md:text-base font-medium opacity-80 mt-1">
                      Months
                    </span>
                  </div>
                  <span className="text-3xl opacity-50">,</span>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl md:text-6xl font-extrabold">
                      {age.days}
                    </span>
                    <span className="text-sm md:text-base font-medium opacity-80 mt-1">
                      Days
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Total Time Lived
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Months
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {totalStats?.months.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Weeks
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {totalStats?.weeks.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Days
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {totalStats?.days.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Hours
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {totalStats?.hours.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      type: "spring",
                      bounce: 0,
                      duration: 0.5,
                      delay: 0.2,
                    }}
                    className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-800/50"
                  >
                    <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">
                      Next Birthday
                    </h3>
                    <div className="flex items-end space-x-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {nextBirthday?.days}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 mb-1">
                        days remaining
                      </span>
                    </div>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-2">
                      {nextBirthday?.date}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      type: "spring",
                      bounce: 0,
                      duration: 0.5,
                      delay: 0.3,
                    }}
                    className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-3xl border border-purple-100 dark:border-purple-800/50"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-5 w-5 text-purple-500" />
                      <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        Fun Facts
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Zodiac Sign:
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {getZodiacSign(dobAD)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Generation:
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {getGeneration(dobAD)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Select your date of birth to calculate your exact age and see
                interesting facts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
