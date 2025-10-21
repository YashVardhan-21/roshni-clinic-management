import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarWidget = ({ appointments = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const hasAppointment = (day) => {
    if (!day) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.some(apt => apt.date === dateStr);
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-medium text-lg text-foreground">Calendar</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(-1)}
            className="w-8 h-8"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(1)}
            className="w-8 h-8"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      <div className="text-center mb-4">
        <h4 className="font-heading font-medium text-base text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center py-2">
            <span className="font-caption text-xs text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center text-sm rounded-gentle transition-colors duration-150
              ${day ? 'hover:bg-muted cursor-pointer' : ''}
              ${isToday(day) ? 'bg-primary text-primary-foreground font-medium' : ''}
              ${hasAppointment(day) && !isToday(day) ? 'bg-accent/20 text-accent font-medium' : ''}
              ${!day ? 'cursor-default' : ''}
            `}
          >
            {day && (
              <div className="relative">
                <span className="font-body">{day}</span>
                {hasAppointment(day) && !isToday(day) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="font-caption text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="font-caption text-muted-foreground">Appointment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;