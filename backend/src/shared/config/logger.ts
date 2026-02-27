export const logger = {
  info: (obj: unknown, msg?: string) => console.log('[INFO]', msg ?? '', obj),
  error: (obj: unknown, msg?: string) => console.error('[ERROR]', msg ?? '', obj),
  warn: (obj: unknown, msg?: string) => console.warn('[WARN]', msg ?? '', obj),
  debug: (obj: unknown, msg?: string) => console.debug('[DEBUG]', msg ?? '', obj),
};
