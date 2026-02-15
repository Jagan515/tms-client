import { useState, useEffect } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday,
    parseISO,
    isValid
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const AppCalendar = ({ selectedDate, onDateSelect, events = [] }) => {
    const parseDate = (d) => {
        if (!d) return new Date();
        const parsed = typeof d === 'string' ? parseISO(d) : d;
        return isValid(parsed) ? parsed : new Date();
    };

    const [currentMonth, setCurrentMonth] = useState(parseDate(selectedDate));

    useEffect(() => {
        if (selectedDate) {
            setCurrentMonth(parseDate(selectedDate));
        }
    }, [selectedDate]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="app-calendar bg-white rounded-4 shadow-sm border overflow-hidden animate-fade-in user-select-none">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center p-3 bg-tertiary border-bottom" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <h6 className="mb-0 fw-bold text-primary text-uppercase letter-spacing-1 ps-2">
                    {format(currentMonth, 'MMMM yyyy')}
                </h6>
                <div className="d-flex gap-1">
                    <button
                        className="btn btn-sm btn-icon btn-light rounded-circle hover-bg-secondary transition-all d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevMonth(); }}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        className="btn btn-sm btn-icon btn-light rounded-circle hover-bg-secondary transition-all d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextMonth(); }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Week Days */}
            <div className="d-grid p-2 mb-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {weekDays.map(day => (
                    <div key={day} className="text-center small fw-bold text-muted opacity-50 py-2" style={{ fontSize: '0.65rem' }}>
                        {day.toUpperCase()}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="d-grid px-2 pb-3" style={{ gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '8px' }}>
                {calendarDays.map((day, idx) => {
                    const parsedSelected = parseDate(selectedDate);
                    const isSelected = selectedDate && isSameDay(day, parsedSelected);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isTodayDate = isToday(day);

                    // Check for events/status
                    const dayEvents = events.filter(e => isSameDay(parseDate(e.date), day));
                    const hasStatus = dayEvents.length > 0;

                    return (
                        <div key={idx} className="d-flex flex-column align-items-center justify-content-center">
                            <button
                                className={`
                                    btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center transition-all position-relative
                                    ${isSelected ? 'bg-primary text-white shadow-lg scale-110' : 'hover-bg-tertiary text-dark'}
                                    ${!isCurrentMonth ? 'text-muted opacity-25' : ''}
                                    ${isTodayDate && !isSelected ? 'border border-primary text-primary fw-bold' : ''}
                                `}
                                style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
                                onClick={() => {
                                    if (onDateSelect) onDateSelect(day);
                                }}
                            >
                                {format(day, 'd')}

                                {hasStatus && (
                                    <span
                                        className={`position-absolute top-0 end-0 p-1 rounded-circle border border-white ${isSelected ? 'bg-white' : 'bg-success'}`}
                                        style={{ width: '8px', height: '8px', transform: 'translate(25%, -25%)' }}
                                    />
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AppCalendar;
