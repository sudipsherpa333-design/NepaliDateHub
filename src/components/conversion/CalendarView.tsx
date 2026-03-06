import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NepaliDate from 'nepali-date-converter';
import { cn } from '../../utils/cn';

interface CalendarViewProps {
  currentDate: string; // YYYY-MM-DD format
  mode: 'BS' | 'AD';
  onDateSelect?: (date: string) => void;
}

const NEPALI_MONTHS = [
  { en: 'Baisakh', ne: 'वैशाख' }, { en: 'Jestha', ne: 'जेठ' }, { en: 'Ashadh', ne: 'असार' }, 
  { en: 'Shrawan', ne: 'साउन' }, { en: 'Bhadra', ne: 'भदौ' }, { en: 'Ashwin', ne: 'असोज' },
  { en: 'Kartik', ne: 'कात्तिक' }, { en: 'Mangsir', ne: 'मंसिर' }, { en: 'Poush', ne: 'पुष' }, 
  { en: 'Magh', ne: 'माघ' }, { en: 'Falgun', ne: 'फागुन' }, { en: 'Chaitra', ne: 'चैत' }
];

const NEPALI_DAYS = [
  { en: 'Sun', ne: 'आइत' }, { en: 'Mon', ne: 'सोम' }, { en: 'Tue', ne: 'मंगल' }, 
  { en: 'Wed', ne: 'बुध' }, { en: 'Thu', ne: 'बिही' }, { en: 'Fri', ne: 'शुक्र' }, { en: 'Sat', ne: 'शनि' }
];

const TITHIS = [
  { ne: 'प्रतिपदा', en: 'Pratipada' }, { ne: 'द्वितीया', en: 'Dwitiya' }, { ne: 'तृतीया', en: 'Tritiya' },
  { ne: 'चतुर्थी', en: 'Chaturthi' }, { ne: 'पञ्चमी', en: 'Panchami' }, { ne: 'षष्ठी', en: 'Shashthi' },
  { ne: 'सप्तमी', en: 'Saptami' }, { ne: 'अष्टमी', en: 'Ashtami' }, { ne: 'नवमी', en: 'Navami' },
  { ne: 'दशमी', en: 'Dashami' }, { ne: 'एकादशी', en: 'Ekadashi' }, { ne: 'द्वादशी', en: 'Dwadashi' },
  { ne: 'त्रयोदशी', en: 'Trayodashi' }, { ne: 'चतुर्दशी', en: 'Chaturdashi' }, { ne: 'पूर्णिमा/औंसी', en: 'Purnima/Aunsi' }
];

// Mock festivals based on BS month (0-indexed) and day. 
// Note: Lunar holidays (Dashain, Tihar, Holi, etc.) change dates every year and require a full astronomical engine.
// The following includes fixed-date holidays and approximate mock dates for lunar festivals for visual representation.
const FESTIVALS: Record<number, Record<number, { en: string, ne: string }>> = {
  0: { 
    1: { en: "New Year", ne: "नयाँ वर्ष" }, 
    11: { en: "Loktantra Diwas", ne: "लोकतन्त्र दिवस" },
    22: { en: "Buddha Jayanti", ne: "बुद्ध जयन्ती" } // Mock lunar date
  },
  1: { 
    15: { en: "Republic Day", ne: "गणतन्त्र दिवस" } 
  },
  2: {
    15: { en: "National Rice Day", ne: "राष्ट्रिय धान दिवस" },
    29: { en: "Bhanu Jayanti", ne: "भानु जयन्ती" }
  },
  3: {
    1: { en: "Shrawan Sankranti", ne: "साउने संक्रान्ति" },
    15: { en: "Janai Purnima", ne: "जनै पूर्णिमा" } // Mock lunar date
  },
  4: {
    8: { en: "Krishna Janmashtami", ne: "कृष्ण जन्माष्टमी" }, // Mock lunar date
    21: { en: "Haritalika Teej", ne: "हरितालिका तीज" }, // Mock lunar date
    22: { en: "Civil Service Day", ne: "निजामती सेवा दिवस" },
    29: { en: "Children's Day", ne: "बाल दिवस" }
  },
  5: { 
    3: { en: "Constitution Day", ne: "संविधान दिवस" },
    10: { en: "Ghatasthapana", ne: "घटस्थापना" }, // Mock lunar date
    16: { en: "Fulpati", ne: "फूलपाती" }, // Mock lunar date
    17: { en: "Maha Ashtami", ne: "महा अष्टमी" }, // Mock lunar date
    18: { en: "Maha Navami", ne: "महा नवमी" }, // Mock lunar date
    19: { en: "Vijaya Dashami", ne: "विजया दशमी" } // Mock lunar date
  },
  6: {
    14: { en: "Kukur Tihar", ne: "कुकुर तिहार" }, // Mock lunar date
    15: { en: "Laxmi Puja", ne: "लक्ष्मी पूजा" }, // Mock lunar date
    16: { en: "Gobardhan Puja", ne: "गोवर्धन पूजा" }, // Mock lunar date
    17: { en: "Bhai Tika", ne: "भाइटीका" }, // Mock lunar date
    22: { en: "Chhath Parba", ne: "छठ पर्व" } // Mock lunar date
  },
  8: {
    15: { en: "Tamu Lhosar", ne: "तमु ल्होसार" },
    27: { en: "Prithvi Jayanti", ne: "पृथ्वी जयन्ती" }
  },
  9: {
    1: { en: "Maghe Sankranti", ne: "माघे संक्रान्ति" },
    16: { en: "Martyrs' Day", ne: "शहीद दिवस" },
    25: { en: "Sonam Lhosar", ne: "सोनाम ल्होसार" }, // Mock lunar date
    28: { en: "Saraswati Puja", ne: "सरस्वती पूजा" } // Mock lunar date
  },
  10: { 
    7: { en: "Democracy Day", ne: "प्रजातन्त्र दिवस" },
    25: { en: "Maha Shivaratri", ne: "महा शिवरात्रि" }, // Mock lunar date
    29: { en: "Holi (Fagu Purnima)", ne: "होली (फागु पूर्णिमा)" } // Mock lunar date
  },
  11: { 
    24: { en: "Chaite Dashain", ne: "चैते दशैं" } // Mock lunar date
  }
};

export function CalendarView({ currentDate, mode, onDateSelect }: CalendarViewProps) {
  const [year, setYear] = useState<number>(new NepaliDate().getYear());
  const [month, setMonth] = useState<number>(new NepaliDate().getMonth());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [startDay, setStartDay] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  useEffect(() => {
    if (currentDate && mode === 'BS') {
      const parts = currentDate.split(/[-/]/);
      if (parts.length >= 2) {
        const [y, m] = parts.map(Number);
        if (y > 1900 && m >= 1 && m <= 12) {
          // Calculate direction for smooth animation
          const newYear = y;
          const newMonth = m - 1;
          
          setYear((prevYear) => {
            setMonth((prevMonth) => {
              if (newYear !== prevYear || newMonth !== prevMonth) {
                setDirection(newYear > prevYear || (newYear === prevYear && newMonth > prevMonth) ? 1 : -1);
                return newMonth;
              }
              return prevMonth;
            });
            return newYear;
          });
        }
      }
    }
  }, [currentDate, mode]);

  useEffect(() => {
    try {
      const firstDayOfMonth = new NepaliDate(year, month, 1);
      const lastDayOfMonth = new NepaliDate(year, month + 1, 0); // 0 gets last day of previous month
      
      setStartDay(firstDayOfMonth.getDay());
      
      const days = [];
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push(i);
      }
      setDaysInMonth(days);
    } catch (error) {
      console.error('Error generating calendar:', error);
    }
  }, [year, month]);

  const handlePrevMonth = () => {
    setDirection(-1);
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    setDirection(1);
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  };

  const handlePrevYear = () => {
    setDirection(-1);
    setYear(y => y - 1);
  };

  const handleNextYear = () => {
    setDirection(1);
    setYear(y => y + 1);
  };

  const handleGoToToday = () => {
    const today = new NepaliDate();
    const currentYear = today.getYear();
    const currentMonth = today.getMonth();
    
    if (year === currentYear && month === currentMonth) return;
    
    setDirection(year < currentYear || (year === currentYear && month < currentMonth) ? 1 : -1);
    setYear(currentYear);
    setMonth(currentMonth);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0
    })
  };

  const getAdDateString = (day: number) => {
    try {
      const bsDate = new NepaliDate(year, month, day);
      const adDate = bsDate.toJsDate();
      return `${adDate.getDate()} ${adDate.toLocaleString('default', { month: 'short' })}`;
    } catch (e) {
      return '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-red-900/5 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-gradient-to-br from-red-500 to-emerald-500 rounded-xl shadow-sm">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${year}-${month}`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="flex flex-col"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <div className="relative">
                  <select
                    value={month}
                    onChange={(e) => {
                      setDirection(Number(e.target.value) > month ? 1 : -1);
                      setMonth(Number(e.target.value));
                    }}
                    className="appearance-none bg-transparent text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-md"
                  >
                    {NEPALI_MONTHS.map((m, idx) => (
                      <option key={idx} value={idx} className="text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">
                        {m.ne} ({m.en})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => {
                      setDirection(Number(e.target.value) > year ? 1 : -1);
                      setYear(Number(e.target.value));
                    }}
                    className="appearance-none bg-transparent text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-md"
                  >
                    {Array.from({ length: 2100 - 1970 + 1 }, (_, i) => 1970 + i).map((y) => (
                      <option key={y} value={y} className="text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                {(() => {
                  try {
                    const firstDay = new NepaliDate(year, month, 1).toJsDate();
                    const lastDay = new NepaliDate(year, month + 1, 0).toJsDate();
                    const firstMonth = firstDay.toLocaleString('default', { month: 'short' });
                    const lastMonth = lastDay.toLocaleString('default', { month: 'short' });
                    const firstYear = firstDay.getFullYear();
                    const lastYear = lastDay.getFullYear();
                    
                    if (firstMonth === lastMonth && firstYear === lastYear) {
                      return `${firstMonth} ${firstYear}`;
                    } else if (firstYear === lastYear) {
                      return `${firstMonth} - ${lastMonth} ${firstYear}`;
                    } else {
                      return `${firstMonth} ${firstYear} - ${lastMonth} ${lastYear}`;
                    }
                  } catch (e) {
                    return '';
                  }
                })()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm border border-gray-100 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevYear}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            title="Previous Year"
          >
            <ChevronsLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevMonth}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            title="Previous Month"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>
          
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoToToday}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full transition-colors"
          >
            Today
          </motion.button>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextMonth}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            title="Next Month"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextYear}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            title="Next Year"
          >
            <ChevronsRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>
        </div>
      </div>

      <div className="p-4 sm:p-6 overflow-hidden">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
          {NEPALI_DAYS.map((day, index) => (
            <div
              key={day.en}
              className={cn(
                "text-center py-2 flex flex-col",
                index === 6 ? "text-red-500" : "text-gray-600 dark:text-gray-300"
              )}
            >
              <span className="text-sm sm:text-base font-bold">{day.ne}</span>
              <span className="text-[10px] sm:text-xs font-medium opacity-70">{day.en}</span>
            </div>
          ))}
        </div>

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div 
            key={`${year}-${month}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="grid grid-cols-7 gap-1 sm:gap-2"
          >
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-24 rounded-lg sm:rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-transparent" />
            ))}
            
            {daysInMonth.map((day) => {
            const todayBS = new NepaliDate();
            const isToday = todayBS.getYear() === year && todayBS.getMonth() === month && todayBS.getDate() === day;
            const isSelected = currentDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSaturday = (startDay + day - 1) % 7 === 6;
            const tithi = TITHIS[(year + month + day) % 15];
            const festival = FESTIVALS[month]?.[day];

            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (onDateSelect) {
                    onDateSelect(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
                  }
                }}
                className={cn(
                  "relative h-20 sm:h-28 rounded-lg sm:rounded-2xl border p-1 sm:p-2 transition-colors cursor-pointer group flex flex-col",
                  isSelected
                    ? "bg-gradient-to-br from-red-500 to-red-600 border-red-600 text-white shadow-lg shadow-red-500/30 dark:from-red-600 dark:to-red-700 dark:border-red-600"
                    : "bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md",
                  isSaturday && !isSelected && "bg-red-50/50 dark:bg-red-900/20",
                  isToday && !isSelected && "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-900"
                )}
              >
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start w-full">
                  <span className={cn(
                    "text-base sm:text-xl font-bold leading-none",
                    isSelected ? "text-white" : isSaturday ? "text-red-600 dark:text-red-400" : isToday ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"
                  )}>
                    {day}
                  </span>
                  <div className="flex flex-col items-center sm:items-end mt-1 sm:mt-0">
                    <span className={cn(
                      "text-[10px] sm:text-xs transition-colors leading-none",
                      isSelected ? "text-red-100" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    )}>
                      {getAdDateString(day)}
                    </span>
                    <span className={cn(
                      "text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 font-medium",
                      isSelected ? "text-red-200" : "text-gray-400 dark:text-gray-500"
                    )}>
                      {tithi.ne}
                    </span>
                  </div>
                </div>
                
                {/* Festival Marker */}
                {festival && (
                  <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 flex flex-col items-center">
                    <div className={cn(
                      "text-[8px] sm:text-[10px] leading-tight font-medium truncate px-1 py-0.5 rounded text-center w-full",
                      isSelected ? "bg-red-500 text-white" : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50"
                    )} title={`${festival.ne} - ${festival.en}`}>
                      <span className="block">{festival.ne}</span>
                      <span className="hidden sm:block text-[7px] sm:text-[8px] opacity-80">{festival.en}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
