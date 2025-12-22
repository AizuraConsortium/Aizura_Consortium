const requiredEnvVars = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;

export function validateEnvironment(): void {
  const missing: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value === 'your_supabase_url' || value === 'your_supabase_anon_key') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const errorMessage = `
❌ Missing or invalid environment variables:
${missing.map(key => `   - ${key}`).join('\n')}

Please check your .env file and ensure all required variables are set.
See .env.example for reference.
    `.trim();

    console.error(errorMessage);
    throw new Error('Environment validation failed');
  }

  console.log('✅ Environment variables validated successfully');
}
