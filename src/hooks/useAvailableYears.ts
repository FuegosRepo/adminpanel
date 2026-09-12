/**
 * Años para los chips de filtro rápido (Pedidos y Presupuestos): año actual
 * y dos para adelante (las bodas se reservan con mucha anticipación).
 *
 * Antes se calculaba consultando el min/max de event_date en la base, pero
 * hay pedidos con fechas mal cargadas (años como 1996 o 2030+) que hacían
 * aparecer decenas de chips inútiles. Una ventana fija y chica, calculada
 * desde la fecha de hoy, es más simple y no depende de la limpieza de los
 * datos existentes.
 */
export function useAvailableYears() {
    const currentYear = new Date().getFullYear()
    const years = [currentYear, currentYear + 1, currentYear + 2]

    return { years }
}
