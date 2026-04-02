'use client'

import { startOfMonth, subMonths, subYears, format } from 'date-fns'
import styles from '../FinancialReports.module.css'

interface ReportDateRangePickerProps {
    dateFrom: string
    dateTo: string
    onDateFromChange: (value: string) => void
    onDateToChange: (value: string) => void
}

type Preset = { label: string; from: string; to: string }

function getPresets(): Preset[] {
    const now = new Date()
    const fmt = (d: Date) => format(d, 'yyyy-MM-dd')

    return [
        { label: 'Este Mes', from: fmt(startOfMonth(now)), to: fmt(now) },
        { label: 'Ultimo Trimestre', from: fmt(subMonths(startOfMonth(now), 2)), to: fmt(now) },
        { label: 'Este Ano', from: fmt(new Date(now.getFullYear(), 0, 1)), to: fmt(now) },
        { label: 'Ultimo Ano', from: fmt(subYears(new Date(now.getFullYear(), 0, 1), 1)), to: fmt(new Date(now.getFullYear() - 1, 11, 31)) },
        { label: 'Todo', from: '', to: '' },
    ]
}

export default function ReportDateRangePicker({
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
}: ReportDateRangePickerProps) {
    const presets = getPresets()

    const handlePreset = (preset: Preset) => {
        onDateFromChange(preset.from)
        onDateToChange(preset.to)
    }

    return (
        <div className={styles.dateRangePicker}>
            <div className={styles.presets}>
                {presets.map((preset) => (
                    <button
                        key={preset.label}
                        className={`${styles.presetBtn} ${dateFrom === preset.from && dateTo === preset.to ? styles.active : ''}`}
                        onClick={() => handlePreset(preset)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
            <div className={styles.dateInputs}>
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => onDateFromChange(e.target.value)}
                    className={styles.dateInput}
                />
                <span className={styles.dateSeparator}>—</span>
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => onDateToChange(e.target.value)}
                    className={styles.dateInput}
                />
            </div>
        </div>
    )
}
