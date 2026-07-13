import { pdf } from "@react-pdf/renderer";
import { BudgetPdfDocument } from "./BudgetPdfDocument";
import { BudgetData } from "../types/budget";
import { getBudgetPDFFilename } from "../pdfFilename";
import { supabase } from "../supabaseClient"; // ✅ Use existing shared client

// ============================================================================
// FILENAME GENERATION
// ============================================================================

export { getBudgetPDFFilename };

// ============================================================================
// PDF GENERATION (Client-side)
// ============================================================================
export async function generatePdfBlob(
	budgetData: BudgetData,
): Promise<{ blob: Blob; filename: string }> {
	console.log("🚀 Generating PDF on client-side...");
	const startTime = performance.now();

	// Generate the PDF document
	const document = <BudgetPdfDocument budgetData={budgetData} />;

	// Convert to blob
	const blob = await pdf(document).toBlob();

	const endTime = performance.now();
	console.log(`✅ PDF generated in ${(endTime - startTime).toFixed(0)}ms`);

	// Generate filename
	const filename = getBudgetPDFFilename(budgetData);

	return { blob, filename };
}

// ============================================================================
// SUPABASE UPLOAD
// ============================================================================
export async function uploadPdfToSupabase(
	blob: Blob,
	budgetId: string,
	filename: string,
): Promise<string> {
	console.log("📤 Uploading PDF to Supabase Storage...");
	const startTime = performance.now();

	// Upload to Supabase Storage
	const { data, error } = await supabase.storage
		.from("budgets")
		.upload(`${budgetId}/${filename}`, blob, {
			contentType: "application/pdf",
			upsert: true,
		});

	if (error) {
		console.error("❌ Error uploading PDF:", error);
		throw new Error(`Error al subir PDF: ${error.message}`);
	}

	// Get public URL
	const { data: urlData } = supabase.storage
		.from("budgets")
		.getPublicUrl(`${budgetId}/${filename}`);

	const endTime = performance.now();
	console.log(`✅ PDF uploaded in ${(endTime - startTime).toFixed(0)}ms`);
	console.log("📎 Public URL:", urlData.publicUrl);

	return urlData.publicUrl;
}

// ============================================================================
// COMBINED: Generate + Upload
// ============================================================================
export async function generateAndUploadPdf(
	budgetData: BudgetData,
	budgetId: string,
): Promise<{ blob: Blob; filename: string; pdfUrl: string }> {
	// 1. Generate PDF blob locally
	const { blob, filename } = await generatePdfBlob(budgetData);

	// 2. Upload to Supabase
	const pdfUrl = await uploadPdfToSupabase(blob, budgetId, filename);

	return { blob, filename, pdfUrl };
}
