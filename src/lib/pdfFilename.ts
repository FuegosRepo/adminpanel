import { BudgetData } from "@/lib/types/budget";

const FALLBACK_CLIENT_NAME = "Client";

export function sanitizeFilenamePart(value: string | null | undefined): string {
	const sanitized = (value || "")
		.trim()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[’‘´`']/g, "")
		.replace(/[^a-zA-Z0-9._-]+/g, "_")
		.replace(/_+/g, "_")
		.replace(/^_+|_+$/g, "");

	return sanitized || FALLBACK_CLIENT_NAME;
}

function formatBudgetPdfDate(budgetData: BudgetData): string {
	const dateToUse = budgetData.clientInfo.eventDate || budgetData.generatedAt;

	try {
		const date = new Date(dateToUse);

		if (Number.isNaN(date.getTime())) {
			return new Date().toISOString().split("T")[0];
		}

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		return `${day}-${month}-${year}`;
	} catch {
		return "Fecha";
	}
}

export function getBudgetPDFFilename(budgetData: BudgetData): string {
	const safeClientName = sanitizeFilenamePart(budgetData.clientInfo.name);
	const dateStr = formatBudgetPdfDate(budgetData);

	return `Devis_${safeClientName}_${dateStr}.pdf`;
}
