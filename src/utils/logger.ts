/**
 * Structured Logger for PanelAdmin
 * 
 * Provides consistent logging across the application with:
 * - Log levels (debug, info, warn, error)
 * - Structured output with timestamps
 * - Context tagging for filtering
 * - Production-safe (no sensitive data logging)
 * 
 * Usage:
 *   import { logger } from '@/utils/logger'
 *   logger.info('User action', { action: 'save', module: 'budget' })
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
    module?: string
    action?: string
    userId?: string
    [key: string]: unknown
}

interface LogEntry {
    timestamp: string
    level: LogLevel
    message: string
    context?: LogContext
}

// Determine if we're in development mode
const isDev = process.env.NODE_ENV !== 'production'

// Sensitive keys that should be redacted
const SENSITIVE_KEYS = ['password', 'token', 'secret', 'apiKey', 'email', 'phone', 'creditCard']

/**
 * Redacts sensitive values from an object for safe logging
 */
function redactSensitive(obj: LogContext): LogContext {
    if (!obj || typeof obj !== 'object') return obj

    const redacted: LogContext = {}
    for (const [key, value] of Object.entries(obj)) {
        const keyLower = key.toLowerCase()
        if (SENSITIVE_KEYS.some(sk => keyLower.includes(sk))) {
            redacted[key] = '[REDACTED]'
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            redacted[key] = redactSensitive(value as LogContext)
        } else {
            redacted[key] = value
        }
    }
    return redacted
}

/**
 * Formats a log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
    const contextStr = entry.context
        ? ` ${JSON.stringify(redactSensitive(entry.context))}`
        : ''
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${contextStr}`
}

/**
 * Creates the log entry object
 */
function createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
        timestamp: new Date().toISOString(),
        level,
        message,
        context
    }
}

/**
 * Main logger object
 */
export const logger = {
    /**
     * Debug level - only shown in development
     */
    debug(message: string, context?: LogContext): void {
        if (!isDev) return
        const entry = createLogEntry('debug', message, context)
        console.debug(formatLogEntry(entry))
    },

    /**
     * Info level - general information
     */
    info(message: string, context?: LogContext): void {
        const entry = createLogEntry('info', message, context)
        console.info(formatLogEntry(entry))
    },

    /**
     * Warn level - potential issues
     */
    warn(message: string, context?: LogContext): void {
        const entry = createLogEntry('warn', message, context)
        console.warn(formatLogEntry(entry))
    },

    /**
     * Error level - errors and exceptions
     */
    error(message: string, error?: Error | unknown, context?: LogContext): void {
        const entry = createLogEntry('error', message, context)

        // Add error details if provided
        if (error instanceof Error) {
            entry.context = {
                ...entry.context,
                errorName: error.name,
                errorMessage: error.message,
                // Only include stack in dev
                ...(isDev && { stack: error.stack })
            }
        }

        console.error(formatLogEntry(entry))
    },

    /**
     * Creates a scoped logger with preset context
     */
    scope(module: string) {
        return {
            debug: (message: string, context?: LogContext) =>
                logger.debug(message, { ...context, module }),
            info: (message: string, context?: LogContext) =>
                logger.info(message, { ...context, module }),
            warn: (message: string, context?: LogContext) =>
                logger.warn(message, { ...context, module }),
            error: (message: string, error?: Error | unknown, context?: LogContext) =>
                logger.error(message, error, { ...context, module })
        }
    }
}

// Pre-scoped loggers for common modules
export const apiLogger = logger.scope('api')
export const budgetLogger = logger.scope('budget')
export const orderLogger = logger.scope('order')
export const authLogger = logger.scope('auth')
