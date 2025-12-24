export interface EnvValidationConfig {
  requiredVars: Record<string, string | undefined>;
  appName: string;
  invalidPlaceholders?: string[];
}

export function validateEnvironment(config: EnvValidationConfig): void {
  const { requiredVars, appName, invalidPlaceholders = ['your_supabase_url', 'your_supabase_anon_key'] } = config;
  const missing: string[] = [];

  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value || invalidPlaceholders.includes(value)) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const errorMessage = `
❌ [${appName}] Missing or invalid environment variables:
${missing.map(key => `   - ${key}`).join('\n')}

Please check your .env file and ensure all required variables are set.
See .env.example for reference.
    `.trim();

    console.error(errorMessage);
    throw new Error(`[${appName}] Environment validation failed`);
  }

  console.log(`✅ [${appName}] Environment variables validated successfully`);
}
