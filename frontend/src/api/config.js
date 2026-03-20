// Centralized API configuration
// Using Vite's environment variables if available, otherwise defaulting to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default API_BASE_URL;
