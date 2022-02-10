import { FunctionComponent } from "react"
import Slider from "react-rangeslider"
import 'react-rangeslider/lib/index.css'
import { toTitleCase } from '../util'
import { ConfigModes, FormatType, MetricType, SliderProps } from './ConfigurationTypes'

const getSliderLabel = (format: FormatType, metric: MetricType) => {
    switch (format) {
        case 'average':
            return "Minimum SNR"
        case 'count':
            return `Minimum ${toTitleCase(metric)}`
        case 'cpu':
            return "Maximum CPU Time"
        default:
            throw new Error('Unsupported slider format in getSliderCopy().')
    }
}

const getRoundedValue = (step: number, value: number) => {
    const quantizedToStepSize = Math.round(value / step) * step
    return Math.round(quantizedToStepSize * 100) / 100
}


const SliderCard: FunctionComponent<SliderProps> = (Props: SliderProps) => {
    const extraClass = Props.useColumnFormat ? 'card__std-col' : 'card__std'
    const step = ConfigModes[Props.format].sliderStep
    const roundValue = getRoundedValue(step, Props.cutoffValue)
    return (
        <div className={`card ${extraClass}`} style={{maxWidth: 300, minWidth: 300}}>
            <div className="content">
                <div className="card__label">
                    <p>
                        {getSliderLabel(Props.format, Props.metric)}: <strong>{roundValue}</strong>
                    </p>
                </div>
                <div className="card__footer">
                    <hr />
                    <div className="slider__horizontal">
                        <Slider 
                            min={0}
                            max={ConfigModes[Props.format].sliderMax}
                            value={roundValue}
                            step={step}
                            orientation="horizontal"
                            onChange={Props.onValueChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SliderCard;

