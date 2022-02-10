import { render, screen } from '@testing-library/react'
import { basicConfig } from '../../sampleData/HeatmapConfigTestData'
import { FormatType } from './ConfigurationTypes'
import SliderCard from './SliderCard'

describe('Basic rendering tests', () => {
    test("Default values render correctly", () => {
        render(
            <SliderCard {...basicConfig}/>
        )
        const accuracyText = screen.getByText(/SNR/)
        expect(accuracyText).toBeInTheDocument()
        const threshold = screen.getByText(/8/)
        expect(threshold).toBeInTheDocument()
    })
    
    it("Properly title-cases metric name", () => {
        const countFormat = {...basicConfig, format: 'count' as FormatType}
        render(
            <SliderCard {...countFormat} />
        )
        const accuracyText = screen.getByText(/Accuracy/)
        expect(accuracyText).toBeInTheDocument()
    })

    test("Column format styles applied when flagged on", () => {
        const confirmColumnOn = {...basicConfig, useColumnFormat: true}
        const { container } = render(
            <SliderCard {...confirmColumnOn}/>
        )
        expect(container.firstChild).toHaveClass('card card__std-col', {exact: true})
    })

    test("Column format styles not applied when flagged off", () => {
        expect(basicConfig.useColumnFormat).toBeFalsy()
        const { container } = render(
            <SliderCard {...basicConfig}/>
        )
        expect(container.firstChild).toHaveClass('card card__std', {exact: true})
    })
})

// TODO: Figure out how to use React Testing Library to confirm that
// things happen as expected when you move the slider

