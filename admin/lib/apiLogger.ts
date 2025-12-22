/**
 * API Logger
 *
 * This file re-exports the shared API Logger for backwards compatibility.
 * All API logging functionality is now centralized in @shared/lib/apiLogger.
 */

export { apiLogger, APILogger } from '@shared/lib/apiLogger';
export type { APICallLog, APILoggerConfig } from '@shared/lib/apiLogger';
