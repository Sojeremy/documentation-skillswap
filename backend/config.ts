const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  port: Number.parseInt(process.env.PORT || process.env.API_PORT || '3000', 10),
  allowedOrigin: getEnv(process.env.ALLOWED_ORIGIN, 'ALLOWED_ORIGIN', '*'),
  jwtSecret: getEnv(
    process.env.JWT_SECRET,
    'JWT_SECRET',
    'dev-only-insecure-secret',
  ),
  token_expire: getEnv(process.env.TOKEN_EXPIRE, 'TOKEN_EXPIRE', '3600'),
  meilisearchHost: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  meilisearchMasterkey: process.env.MEILI_MASTER_KEY || '',
  meilisearchApikey: process.env.MEILI_API_KEY || '',
};

// Bonus : Avoid forgetting env variables
// Goal : When serv starts, it checks if all required env variables are set.
// If not, it throws an error and stops the server from starting.
// In dev mode, it can use default values for convenience.
// In production, it strictly requires all env variables to be set.
function getEnv(
  variable: string | undefined,
  variableName: string,
  defaultValue?: string,
): string {
  if (variable && variable.trim().length > 0) {
    return variable;
  }

  if (!isProduction && defaultValue !== undefined) {
    console.warn(
      `Missing environnement variable ${variableName}, using dev default.`,
    );
    return defaultValue;
  }

  throw new Error(`Missing environnement variable ${variableName}`);
}
