import { pdf } from '@react-pdf/renderer'
import { BudgetPdfDocument } from './BudgetPdfDocument'
import { BudgetData } from '../types/budget'
import { supabase } from '../supabaseClient'  // ✅ Use existing shared client

// ============================================================================
// FILENAME GENERATION
// ============================================================================

// Remove accents/diacritics from text for safe filenames
function normalizeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function getBudgetPDFFilename(budgetData: BudgetData): string {
    const clientName = (budgetData.clientInfo.name || 'Client').trim()

    // Intentar usar la fecha del evento, si no la de generación
    let dateToUse = budgetData.clientInfo.eventDate || budgetData.generatedAt
    let dateStr: string

    try {
        const d = new Date(dateToUse)
        if (isNaN(d.getTime())) {
            dateStr = new Date().toISOString().split('T')[0]
        } else {
            // Formatear como DD-MM-YYYY
            const day = String(d.getDate()).padStart(2, '0')
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const year = d.getFullYear()
            dateStr = `${day}-${month}-${year}`
        }
    } catch (e) {
        dateStr = 'Fecha'
    }

    // Limpiar caracteres prohibidos en nombres de archivos
    // 1. Normalizar acentos (ë → e, é → e, ñ → n, etc.)
    // 2. Eliminar caracteres prohibidos
    // 3. Reemplazar espacios con guiones bajos
    const safeClientName = normalizeAccents(clientName)
        .replace(/[/\\?%*:|"<>]/g, '')  // Eliminar caracteres prohibidos
        .replace(/\s+/g, '_')           // Reemplazar espacios con guiones bajos

    return `Devis_${safeClientName}_${dateStr}.pdf`
}


// ============================================================================
// PDF GENERATION (Client-side)
// ============================================================================
export async function generatePdfBlob(budgetData: BudgetData): Promise<{ blob: Blob; filename: string }> {
    console.log('🚀 Generating PDF on client-side...')
    const startTime = performance.now()

    // Generate the PDF document
    const document = <BudgetPdfDocument budgetData={budgetData} />

    // Convert to blob
    const blob = await pdf(document).toBlob()

    const endTime = performance.now()
    console.log(`✅ PDF generated in ${(endTime - startTime).toFixed(0)}ms`)

    // Generate filename
    const filename = getBudgetPDFFilename(budgetData)

    return { blob, filename }
}

// ============================================================================
// SUPABASE UPLOAD
// ============================================================================
export async function uploadPdfToSupabase(
    blob: Blob,
    budgetId: string,
    filename: string
): Promise<string> {
    console.log('📤 Uploading PDF to Supabase Storage...')
    const startTime = performance.now()

    // Upload to Supabase Storage
    const { data, error } = await supabase
        .storage
        .from('budgets')
        .upload(`${budgetId}/${filename}`, blob, {
            contentType: 'application/pdf',
            upsert: true
        })

    if (error) {
        console.error('❌ Error uploading PDF:', error)
        throw new Error(`Error al subir PDF: ${error.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase
        .storage
        .from('budgets')
        .getPublicUrl(`${budgetId}/${filename}`)

    const endTime = performance.now()
    console.log(`✅ PDF uploaded in ${(endTime - startTime).toFixed(0)}ms`)
    console.log('📎 Public URL:', urlData.publicUrl)

    return urlData.publicUrl
}

// ============================================================================
// COMBINED: Generate + Upload
// ============================================================================
export async function generateAndUploadPdf(
    budgetData: BudgetData,
    budgetId: string
): Promise<{ blob: Blob; filename: string; pdfUrl: string }> {
    // 1. Generate PDF blob locally
    const { blob, filename } = await generatePdfBlob(budgetData)

    // 2. Upload to Supabase
    const pdfUrl = await uploadPdfToSupabase(blob, budgetId, filename)

    return { blob, filename, pdfUrl }
}
