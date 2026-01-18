import { describe, it, expect, vi, afterEach } from 'vitest'
import { logger } from './logger'

describe('Logger', () => {
    const consoleSpy = {
        debug: vi.spyOn(console, 'debug').mockImplementation(() => { }),
        info: vi.spyOn(console, 'info').mockImplementation(() => { }),
        warn: vi.spyOn(console, 'warn').mockImplementation(() => { }),
        error: vi.spyOn(console, 'error').mockImplementation(() => { })
    }

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should log info messages', () => {
        logger.info('Test info')
        expect(consoleSpy.info).toHaveBeenCalledWith(expect.stringContaining('[INFO] Test info'))
    })

    it('should log warn messages', () => {
        logger.warn('Test warn')
        expect(consoleSpy.warn).toHaveBeenCalledWith(expect.stringContaining('[WARN] Test warn'))
    })

    it('should log error messages', () => {
        logger.error('Test error')
        expect(consoleSpy.error).toHaveBeenCalledWith(expect.stringContaining('[ERROR] Test error'))
    })

    it('should redact sensitive information', () => {
        logger.info('User login', { password: 'secretpassword', email: 'test@example.com' })

        // Get the call arguments
        const logCall = consoleSpy.info.mock.calls[0][0]

        // Should contain redacted values
        expect(logCall).toContain('[REDACTED]')

        // Should NOT contain the actual secrets
        expect(logCall).not.toContain('secretpassword')
        expect(logCall).not.toContain('test@example.com')
    })

    it('should handle scoped loggers', () => {
        const authLogger = logger.scope('auth')
        authLogger.info('Login attempt')

        const logCall = consoleSpy.info.mock.calls[0][0]
        expect(logCall).toContain('auth')
        expect(logCall).toContain('Login attempt')
    })
})
