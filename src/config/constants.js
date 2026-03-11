/**
 * Global Constants for the Student Management System
 */

export const ROLES = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    PARENT: 'parent',
    DEVELOPER: 'developer',
};

export const THEME_COLORS = {
    [ROLES.STUDENT]: 'var(--bg-primary)',
    [ROLES.TEACHER]: '#32213A',
    [ROLES.PARENT]: 'var(--bg-primary)',
    [ROLES.DEVELOPER]: '#32213A',
};

export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    INPUT: 'yyyy-MM-dd',
};

export const API_TIMEOUT = 10000;
