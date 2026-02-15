import React, { useState, useRef } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import AppCalendar from './AppCalendar';

const DatePicker = ({ selectedDate, onChange, placeholder = "Select date", className = "" }) => {
    const triggerRef = useRef(null);

    const handleDateSelect = (date) => {
        if (onChange) {
            // Return YYYY-MM-DD format as expected by most inputs
            onChange({ target: { value: format(date, 'yyyy-MM-dd') } });
        }
        if (triggerRef.current) {
            triggerRef.current.click(); // Close popover by simulating click on trigger (toggle)
        }
    };

    const displayDate = () => {
        if (!selectedDate) return "";
        const date = typeof selectedDate === 'string' ? parseISO(selectedDate) : selectedDate;
        return isValid(date) ? format(date, 'MMMM d, yyyy') : selectedDate;
    };

    const popover = (
        <Popover id="calendar-popover" className="border-0 shadow-premium rounded-4 p-0 mt-2" style={{ maxWidth: '320px' }}>
            <Popover.Body className="p-0">
                <AppCalendar
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                />
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom-start"
            overlay={popover}
            rootClose
        >
            <div className={`position-relative cursor-pointer ${className}`} ref={triggerRef}>
                <CalendarIcon className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                <input
                    readOnly
                    className="form-control ps-5 pe-4 rounded-3 shadow-sm bg-white cursor-pointer fw-medium text-dark"
                    style={{ height: '48px' }}
                    value={displayDate()}
                    placeholder={placeholder}
                />
                <ChevronDown className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted opacity-50" size={16} />
            </div>
        </OverlayTrigger>
    );
};

export default DatePicker;
