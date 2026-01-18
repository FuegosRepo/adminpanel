/**
 * Query Helpers - Shared utilities for service queries
 * 
 * These helpers reduce code duplication across services and ensure
 * consistent behavior for pagination, filtering, and sanitization.
 */

/**
 * Calculates the range (from, to) for Supabase pagination
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Object with from and to values for .range()
 */
export function getPaginationRange(page: number, pageSize: number): { from: number; to: number } {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    return { from, to }
}

/**
 * Sanitizes search term to prevent query injection
 * Removes special characters that could affect Supabase filter patterns
 * @param term - Raw search term from user input
 * @returns Sanitized string safe for use in queries
 */
export function sanitizeSearchTerm(term: string): string {
    if (!term || typeof term !== 'string') return ''

    // Remove characters that could affect the query pattern
    // Keep letters, numbers, spaces, and common name characters
    return term
        .replace(/[%_'"\\]/g, '')  // SQL pattern chars and quotes
        .replace(/[<>{}[\]]/g, '') // HTML/JSON chars
        .trim()
        .slice(0, 100) // Limit length to prevent abuse
}

/**
 * Default pagination settings
 */
export const DEFAULT_PAGE_SIZE = 50
export const DEFAULT_PAGE = 1

/**
 * Interface for pagination parameters
 */
export interface PaginationParams {
    page?: number
    pageSize?: number
}

/**
 * Interface for common filter options
 */
export interface BaseFilters {
    status?: string
    searchTerm?: string
    dateFrom?: string
    dateTo?: string
}
