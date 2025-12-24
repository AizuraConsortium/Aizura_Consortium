import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '../shared/styles/base.css';
// import { validateEnvironment } from '../shared/utils/envValidation.js';

// Temporarily disabled for development without Supabase
// validateEnvironment({
//   appName: 'Admin Portal',
//   requiredVars: {
//     VITE_API_URL: import.meta.env.VITE_API_URL,
//     VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
//     VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
//   },
// });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
