type TokenPair = {
  accessToken?: unknown;
  refreshToken?: unknown;
};

function summarizeToken(token: unknown) {
  const value = typeof token === 'string' ? token : '';

  return {
    present: value.length > 0,
    length: value.length,
    jwtParts: value ? value.split('.').length : 0,
  };
}

export function summarizeTokens(tokens?: TokenPair | null) {
  return {
    accessToken: summarizeToken(tokens?.accessToken),
    refreshToken: summarizeToken(tokens?.refreshToken),
  };
}

export function logAuthDebug(stage: string, details?: Record<string, unknown>) {
  console.info(`[Auth Debug] ${stage}`, details ?? {});
}

export function logAuthError(stage: string, error: unknown) {
  console.error(`[Auth Debug] ${stage}`, {
    name: error instanceof Error ? error.name : typeof error,
    message: error instanceof Error ? error.message : String(error),
  });
}
