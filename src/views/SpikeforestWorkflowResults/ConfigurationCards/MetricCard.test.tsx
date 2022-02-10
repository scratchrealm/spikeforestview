import { render, screen } from '@testing-library/react'
import { basicConfig } from '../../sampleData/HeatmapConfigTestData'
import MetricCard from './MetricCard'

describe('Basic rendering tests', () => {
    test("Default values render correctly", () => {
        render(
            <MetricCard {...basicConfig} />
        )
        const accText = screen.getByText(/balances precision/)
        expect(accText).toBeInTheDocument()
    })
    test("Imputation state is wired correctly", () => {
        const imputeOn = {...basicConfig, imputeMissingValues: true}
        render(
            <MetricCard {...imputeOn}/>
        )
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement
        expect(checkbox.checked).toEqual(true)
    })
    test("Column format styles applied when flagged on", () => {
        const columnsOn = {...basicConfig, useColumnFormat: true}
        const { container } = render(
            <MetricCard {...columnsOn} />
        )
        expect(container.firstChild).toHaveClass('card card__std-col', {exact: true})
    })
    test("Column format styles not applied when flagged off", () => {
        const columnsConfirmedOff = {...basicConfig, useColumnFormat: false}
        const { container } = render(
            <MetricCard {...columnsConfirmedOff} />
        )
        expect(container.firstChild).toHaveClass('card card__std', {exact: true})
    })
})

// onImputeMissingValuesChange: (value: boolean) => void
// onMetricChange: () => void
