import { describe, expect, it } from "vitest";
import { getBudgetPDFFilename, sanitizeFilenamePart } from "./pdfFilename";
import type { BudgetData } from "./types/budget";

function createBudgetData(name: string): BudgetData {
	return {
		clientInfo: {
			name,
			email: "client@example.com",
			phone: "+33000000000",
			eventDate: "2027-06-19",
			eventType: "mariage",
			guestCount: 80,
			address: "Nice",
			menuType: "diner",
		},
		menu: {
			pricePerPerson: 0,
			totalPersons: 80,
			totalHT: 0,
			tva: 0,
			tvaPct: 10,
			totalTTC: 0,
		},
		totals: {
			totalHT: 0,
			totalTVA: 0,
			totalTTC: 0,
		},
		generatedAt: "2026-07-13T00:00:00.000Z",
		validUntil: "2026-08-13T00:00:00.000Z",
	};
}

describe("sanitizeFilenamePart", () => {
	it("removes French apostrophes and normalizes diacritics", () => {
		expect(sanitizeFilenamePart("D’Albaret marion")).toBe("DAlbaret_marion");
		expect(sanitizeFilenamePart("L'Écuyer Noël François")).toBe(
			"LEcuyer_Noel_Francois",
		);
		expect(sanitizeFilenamePart("Françoise d’Azur")).toBe("Francoise_dAzur");
	});

	it("replaces unsafe runs and falls back when empty", () => {
		expect(sanitizeFilenamePart("  /?:*  ")).toBe("Client");
		expect(sanitizeFilenamePart("Marie & Jean")).toBe("Marie_Jean");
	});
});

describe("getBudgetPDFFilename", () => {
	it("generates a Supabase-safe PDF filename for French names", () => {
		expect(getBudgetPDFFilename(createBudgetData("D’Albaret marion"))).toBe(
			"Devis_DAlbaret_marion_19-06-2027.pdf",
		);
	});
});
