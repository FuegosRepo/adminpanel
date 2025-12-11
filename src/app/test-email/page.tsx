
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic' // Ensure file is read on every request

export default async function EmailPreviewPage() {
    // Define content paths
    const templatesDir = path.join(process.cwd(), 'src', 'lib', 'emails', 'templates', 'html')
    const layoutPath = path.join(templatesDir, 'base-layout.html')
    const contentPath = path.join(templatesDir, 'budget-approved.html')

    // Read files
    let layoutHtml = ''
    let contentHtml = ''

    try {
        layoutHtml = fs.readFileSync(layoutPath, 'utf-8')
        contentHtml = fs.readFileSync(contentPath, 'utf-8')
    } catch (error) {
        return (
            <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
                <h1>Error Reading Templates</h1>
                <p>Could not find HTML templates in <code>src/lib/emails/templates/html/</code></p>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
        )
    }

    // Mock Data
    const mockData = {
        clientName: 'Franco Corujo',
        eventDate: '24/12/2025',
        logoUrl: 'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/minilogo.png',
        headerUrl: 'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/headeremail.png',
        year: new Date().getFullYear().toString()
    }

    // Simple Template Engine Replacement
    // 1. Process Content Template
    let processedContent = contentHtml
        .replace(/{{clientName}}/g, mockData.clientName)
        .replace(/{{eventDate}}/g, mockData.eventDate)
        .replace(/{{#if eventDate}}([\s\S]*?){{\/if}}/g, mockData.eventDate ? '$1' : '')
        .replace(/{{#if logoUrl}}([\s\S]*?){{\/if}}/g, mockData.logoUrl ? '$1' : '')
        .replace(/{{logoUrl}}/g, mockData.logoUrl)

    // 2. Inject Content into Layout
    let fullHtml = layoutHtml
        .replace(/{{content}}/g, processedContent)
        .replace(/{{year}}/g, mockData.year)
        .replace(/{{#if headerUrl}}([\s\S]*?){{else}}[\s\S]*?{{\/if}}/g, mockData.headerUrl ? '$1' : '') // Handle if-else for header
        .replace(/{{headerUrl}}/g, mockData.headerUrl)

        // Cleanup any remaining handlebars tags slightly (basic cleanup)
        .replace(/{{#if [\s\S]*?}}.*?{{\/if}}/g, '')

    return (
        <div dangerouslySetInnerHTML={{ __html: fullHtml }} />
    )
}
