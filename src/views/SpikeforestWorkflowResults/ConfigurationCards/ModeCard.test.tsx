import { render, screen } from '@testing-library/react'
import { basicConfig } from '../../sampleData/HeatmapConfigTestData'
import ModeCard from './ModeCard'

describe('Basic rendering tests', () => {
    test("Default values render correctly", () => {
        render(
            <ModeCard {...basicConfig}/>
        )
        const desc = screen.getAllByText(/SNR.*threshold/)
        expect(desc[0]).toBeInTheDocument()
    })

    test("CPU option not displayed if toggled off", () => {
        const confirmCpuOff = {...basicConfig, showCPU: false}
        render(
            <ModeCard {...confirmCpuOff}/>
        )
        const avgDropdownItem = screen.getByRole("option", { name: /Average.*SNR/ })
        expect(avgDropdownItem).toBeInTheDocument()
        const cpuDropdownItme = screen.queryByRole("option", { name: /compute time/ })
        expect(cpuDropdownItme).toBeNull()
    })

    test("CPU option is displayed if toggled on", () => {
        const confirmCpuOn = {...basicConfig, showCPU: true}
        render(
            <ModeCard {...confirmCpuOn}/>
        )
        const cpuDropdownItem = screen.getByRole("option", { name: /compute time/ })
        expect(cpuDropdownItem).toBeInTheDocument()
    })

    test("Column format styles applied when flagged on", () => {
        const confirmColumnsOn = {...basicConfig, useColumnFormat: true}
        const { container } = render(
            <ModeCard {...confirmColumnsOn}/>
        )
        expect(container.firstChild).toHaveClass('card card__std-col card__std-top', {exact: true})
    })
    
    test("Column format styles not applied when flagged off", () => {
        const confirmColumnsOff = {...basicConfig, useColumnFormat: false}
        const { container } = render(
            <ModeCard {...confirmColumnsOff}/>
        )
        expect(container.firstChild).toHaveClass('card card__std', {exact: true})
    })
})
