export const serverEndpoint =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.VITE_SERVER_ENDPOINT ||
  "http://localhost:5001";

// console.log("API URL Loaded:", serverEndpoint);
