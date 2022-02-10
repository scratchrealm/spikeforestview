import { render, screen } from '@testing-library/react'
import ConfigurationPanel from './ConfigurationPanel'
import { FormatType, HeatmapConfiguration } from './ConfigurationTypes'

const fixture: HeatmapConfiguration = {
    format: 'average',
    metric: 'accuracy',
    cutoffValue: 8,
    onFormatChange: () => {},
    onMetricChange: () => {},
    onImputeMissingValuesChange: () => {},
    onValueChange: () => {}
}

describe('Basic rendering tests', () => {
    it("Renders a column layout", () => {
        const { container } = render(
            <ConfigurationPanel {...fixture} useColumnFormat={true} />
        )
        const columnDiv = container.firstChild?.firstChild
        expect(columnDiv).toHaveClass('options-group')
    })
    it("Renders a row layout", () => {
        const { container } = render(
            <ConfigurationPanel {...fixture} />
        )
        // This is awfully implementation-details-specific
        const rowElement = container.firstChild?.firstChild?.firstChild
        expect(rowElement).toHaveClass('container__heatmap--row')
        const cols = rowElement?.childNodes
        expect(cols?.length).toEqual(3)
    })
    test("ModeCard is only displayed element when showing CPU in row layout", () => {
        const cpu = {...fixture, format: 'cpu' as FormatType}
        const { container } = render(
            <ConfigurationPanel {...cpu} />
        )
        const rowElement = container.firstChild?.firstChild?.firstChild
        expect(rowElement).toHaveClass('container__heatmap--row')
        const cols = rowElement?.childNodes
        expect(cols?.length).toEqual(1)
        const cpuText = screen.getAllByText(/compute/)
        expect(cpuText[0]).toBeInTheDocument()
    })
})