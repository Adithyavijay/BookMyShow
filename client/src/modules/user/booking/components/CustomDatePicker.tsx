// components/CustomDatePicker.tsx

import React, { useState, useEffect } from 'react';

interface CustomDatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onChange }) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const today = new Date();
    const nextFiveDays = Array.from({ length: 15 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
    setDates(nextFiveDays);
  }, []);

  const formatDate = (date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return { day, date: date.getDate(), month };
  };

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (startIndex < dates.length - 5) setStartIndex(startIndex + 1);
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={handlePrev}
        className="text-gray-600 hover:text-gray-800 focus:outline-none"
        disabled={startIndex === 0}
      >
        &#8592;
      </button>
      <div className="flex space-x-2">
        {dates.slice(startIndex, startIndex + 5).map((date, index) => {
          const { day, date: dateNum, month } = formatDate(date);
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={index}
              onClick={() => onChange(date)}
              className={`flex flex-col items-center justify-center w-16 h-20 rounded-lg ${
                isSelected ? 'bg-red-500 text-white' : 'bg-red-100 text-gray-800'
              } hover:bg-red-400 hover:text-white transition-colors`}
            >
              <span className="text-xs font-semibold">{day}</span>
              <span className="text-md font-bold">{dateNum}</span>
              <span className="text-xs">{month}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={handleNext}
        className="text-gray-600 hover:text-gray-800 focus:outline-none"
        disabled={startIndex >= dates.length - 5}
      >
        &#8594;
      </button>
    </div>
  );
};

export default CustomDatePicker;