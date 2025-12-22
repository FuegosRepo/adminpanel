import { BudgetData } from '../types'

export const recalculateTotals = (data: BudgetData): BudgetData => {
    const updated = { ...data }

    // Recalcular menú
    if (updated.menu) {
        const menuHT = updated.menu.pricePerPerson * updated.menu.totalPersons
        updated.menu.totalHT = menuHT
        updated.menu.tva = menuHT * (updated.menu.tvaPct / 100)
        updated.menu.totalTTC = menuHT + updated.menu.tva
    }

    // Recalcular servicio (valores fijos: 40€/hora HT, TVA 20%)
    if (updated.service) {
        // Asegurar valores fijos
        updated.service.pricePerHour = 40
        updated.service.tvaPct = 20
        const serviceHT = updated.service.mozos * updated.service.hours * updated.service.pricePerHour
        updated.service.totalHT = serviceHT
        updated.service.tva = serviceHT * (updated.service.tvaPct / 100)
        updated.service.totalTTC = serviceHT + updated.service.tva
    }

    // Recalcular material (excluyendo "Serveurs") y aplicar Seguro
    if (updated.material && updated.material.items) {
        let materialHTForInsurance = 0
        updated.material.items
            .filter(item => {
                // Excluir items relacionados con "Serveurs"
                const itemNameLower = item.name.toLowerCase()
                const isServer = itemNameLower.includes('serveur') ||
                    itemNameLower.includes('servicio') ||
                    itemNameLower.includes('mozos')

                // También excluir items que sean manualmente "Livraison" o "Reprise" para no duplicar seguro
                const isDeliveryReprise = itemNameLower.includes('livraison') ||
                    itemNameLower.includes('reprise')

                return !isServer && !isDeliveryReprise
            })
            .forEach(item => {
                item.total = item.quantity * item.pricePerUnit
                materialHTForInsurance += item.total
            })

        // Calcular HT total de materiales (incluyendo los de entrega/recogida manuales que no llevan seguro)
        let totalMaterialItemsHT = 0
        updated.material.items
            .filter(item => {
                const itemNameLower = item.name.toLowerCase()
                return !itemNameLower.includes('serveur') &&
                    !itemNameLower.includes('servicio') &&
                    !itemNameLower.includes('mozos')
            })
            .forEach(item => {
                totalMaterialItemsHT += item.total
            })

        const insPct = (updated.material.insurancePct ?? 6) / 100
        const insurance = materialHTForInsurance * insPct
        updated.material.insurancePct = insPct * 100
        updated.material.insuranceAmount = insurance

        // Agregar Livraison et Reprise al HT de Material
        const lrCost = (updated.deliveryReprise?.deliveryCost || 0) + (updated.deliveryReprise?.pickupCost || 0)

        const materialHTWithInsuranceAndLR = totalMaterialItemsHT + insurance + lrCost
        updated.material.totalHT = materialHTWithInsuranceAndLR
        updated.material.tva = materialHTWithInsuranceAndLR * (updated.material.tvaPct / 100)
        updated.material.totalTTC = updated.material.totalHT + updated.material.tva
    }

    // Recalcular Livraison et Reprise (mantenemos esto por si se usa en otros lados, pero ya se integra en material)
    if (updated.deliveryReprise) {
        const lrHT = (updated.deliveryReprise.deliveryCost || 0) + (updated.deliveryReprise.pickupCost || 0)
        updated.deliveryReprise.totalHT = lrHT
        updated.deliveryReprise.tva = lrHT * ((updated.deliveryReprise.tvaPct || 0) / 100)
        updated.deliveryReprise.totalTTC = updated.deliveryReprise.totalHT + updated.deliveryReprise.tva
    }

    // Recalcular Boissons Soft
    if (updated.boissonsSoft) {
        const bsHT = updated.boissonsSoft.pricePerPerson * updated.boissonsSoft.totalPersons
        updated.boissonsSoft.totalHT = bsHT
        // Asegurar TVA fijo del 20%
        updated.boissonsSoft.tvaPct = 20
        updated.boissonsSoft.tva = bsHT * 0.20
        updated.boissonsSoft.totalTTC = bsHT + updated.boissonsSoft.tva
    }

    // Recalcular desplazamiento
    if (updated.deplacement) {
        const deplacementHT = updated.deplacement.distance * updated.deplacement.pricePerKm
        updated.deplacement.totalHT = deplacementHT
        updated.deplacement.tva = deplacementHT * (updated.deplacement.tvaPct / 100)
        updated.deplacement.totalTTC = deplacementHT + updated.deplacement.tva
    }

    // Recalcular totales generales
    let totalHT = updated.menu.totalHT
    let totalTVA = updated.menu.tva

    if (updated.material) {
        totalHT += updated.material.totalHT
        totalTVA += updated.material.tva
    }

    // IMPORTANTE: Ya no sumamos deliveryReprise aquí porque ya está dentro de material
    /* 
    if (updated.deliveryReprise) {
        totalHT += updated.deliveryReprise.totalHT
        totalTVA += updated.deliveryReprise.tva
    }
    */

    if (updated.boissonsSoft) {
        totalHT += updated.boissonsSoft.totalHT
        totalTVA += updated.boissonsSoft.tva
    }

    if (updated.deplacement) {
        totalHT += updated.deplacement.totalHT
        totalTVA += updated.deplacement.tva
    }

    if (updated.service) {
        totalHT += updated.service.totalHT
        totalTVA += updated.service.tva
    }

    let totalTTC = totalHT + totalTVA

    // Aplicar descuento si existe
    if (updated.totals.discount && updated.totals.discount.amount > 0) {
        totalTTC -= updated.totals.discount.amount
    }

    updated.totals = {
        ...updated.totals,
        totalHT,
        totalTVA,
        totalTTC
    }

    return updated
}
