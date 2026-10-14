import { supabase } from "@/lib/supabaseClient";
import { sanitizeSearchTerm, getPaginationRange } from "@/utils/queryHelpers";
import type { BudgetMenuSection } from "@/lib/types/budget";

export type BudgetsFilters = {
	status?: string;
	searchTerm?: string;
	year?: string;
	eventType?: string;
};

export type FetchBudgetsParams = {
	page?: number;
	pageSize?: number;
	filters?: BudgetsFilters;
};

export interface ReportBudget {
	id: string;
	order_id: string;
	status: string;
	relance_count: number;
	created_at: string;
	updated_at: string;
}

/**
 * Fetch all budgets (no pagination) for reporting.
 * Only selects fields needed for relance/conversion analysis.
 */
export const fetchBudgetsForReports = async (): Promise<ReportBudget[]> => {
	const { data, error } = await supabase
		.from("budgets")
		.select("id, order_id, status, relance_count, created_at, updated_at")
		.order("created_at", { ascending: true });

	if (error) throw error;
	return (data || []) as ReportBudget[];
};

/**
 * Menú real del presupuesto más reciente de uno o más pedidos (entrées,
 * viandes, postre con nombre y cantidad), indexado por order_id.
 * `catering_orders.entrees/viandes/dessert` refleja lo que el cliente
 * pidió en el formulario de la web, que puede quedar vacío o desactualizado
 * una vez que el admin arma y aprueba el devis — por eso los Asistentes IA
 * necesitan leer de acá, no del pedido.
 */
export const fetchLatestBudgetMenus = async (
	orderIds: string[],
): Promise<Record<string, BudgetMenuSection>> => {
	if (orderIds.length === 0) return {};

	const { data, error } = await supabase
		.from("budgets")
		.select("order_id, version, budget_data")
		.in("order_id", orderIds)
		.order("version", { ascending: false });

	if (error) throw error;

	const result: Record<string, BudgetMenuSection> = {};
	for (const row of data || []) {
		// Ya viene ordenado por version desc, así que la primera fila por
		// order_id que encontramos es la más reciente; no pisarla.
		if (!result[row.order_id] && row.budget_data?.menu) {
			result[row.order_id] = row.budget_data.menu;
		}
	}
	return result;
};

export const fetchBudgets = async ({
	page = 1,
	pageSize = 10,
	filters,
}: FetchBudgetsParams) => {
	// Select only essential fields for the list to save data
	let query = supabase
		.from("budgets")
		.select(
			"id, order_id, version, status, budget_data, pdf_url, created_at, updated_at, relance_count, catering_orders!order_id(payment_method, status)",
			{ count: "exact" },
		);

	// Apply filters
	if (filters?.status && filters.status !== "all") {
		if (filters.status === "sent") {
			query = query.or("status.eq.sent,status.eq.ENVIADO");
		} else if (filters.status === "approved") {
			// ✅ Handle case sensitivity for approved status
			query = query.or("status.eq.approved,status.eq.APPROVED");
		} else if (filters.status.startsWith("relance_")) {
			// Filter by number of relances, excluding approved/rejected budgets
			const count = parseInt(filters.status.split("_")[1]);
			if (!isNaN(count)) {
				query = query.not("status", "in", "(approved,APPROVED,rejected)");
				if (count >= 3) {
					query = query.gte("relance_count", 3);
				} else {
					query = query.eq("relance_count", count);
				}
			}
		} else {
			query = query.eq("status", filters.status);
		}
	}

	if (filters?.searchTerm) {
		// ✅ Use shared sanitization helper
		const term = sanitizeSearchTerm(filters.searchTerm);
		if (term.length > 0) {
			// Search in budget_data JSON (clientInfo.name or email)
			query = query.or(
				`budget_data->clientInfo->>name.ilike.%${term}%,budget_data->clientInfo->>email.ilike.%${term}%`,
			);
		}
	}

	if (filters?.year) {
		query = query.ilike(
			"budget_data->clientInfo->>eventDate",
			`%${filters.year}%`,
		);
	}

	if (filters?.eventType) {
		query = query.ilike(
			"budget_data->clientInfo->>eventType",
			`%${filters.eventType}%`,
		);
	}

	// ✅ Use shared pagination helper
	const { from, to } = getPaginationRange(page, pageSize);

	query = query.order("created_at", { ascending: false }).range(from, to);

	const { data, error, count } = await query;

	if (error) {
		throw error;
	}

	return {
		data: data || [],
		count: count || 0,
	};
};
