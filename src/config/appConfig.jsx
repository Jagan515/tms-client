/*
    Central place to manage API base URL
    Automatically switches based on environment
*/

const isProduction = import.meta.env.PROD;

export const serverEndpoint = isProduction
    ? import.meta.env.VITE_SERVER_URL   // Production API
    : "http://localhost:5001";          // Local backend

