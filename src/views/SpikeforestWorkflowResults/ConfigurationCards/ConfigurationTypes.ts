export type FormatType = 'average' | 'count' | 'cpu'

export type MetricType = 'accuracy' | 'precision' | 'recall'

export type ModeInfo = {
    'description': string,
    'sliderStep': number,
    'sliderMax': number
}

export interface SliderProps {
    format: FormatType
    metric: MetricType
    cutoffValue: number
    useColumnFormat?: boolean
    onValueChange: (v: number) => void
}

export interface MetricProps {
    metric: MetricType
    imputeMissingValues?: boolean
    useColumnFormat?: boolean
    onImputeMissingValuesChange: (value: boolean) => void
    onMetricChange: (v: MetricType) => void
}

export interface ModeProps {
    format: FormatType
    showCPU?: boolean
    useColumnFormat?: boolean
    onFormatChange: (v: FormatType) => void
}

// Will be useful for the control panel component
export type HeatmapConfiguration = SliderProps & MetricProps & ModeProps

// export interface HeatmapConfiguration {
//     format: FormatType
//     metric: MetricType
//     cutoffValue: number
//     imputeMissingValues?: boolean
//     showCPU?: boolean
//     useColumnFormat?: boolean
//     onFormatChange: (e: string) => void // TODO: NAME?
//     onMetricChange: () => void // TODO: DOUBLE-CHECK
//     onValueChange: () => void
//     onImputeMissingValuesChange: (value: boolean) => void
// }

export const ConfigMetrics: { [key in MetricType]: string } = {
    'accuracy' : " balances precision and recall",
    'precision': "= 1 - (false positive rate)",
    'recall'   : "= 1 - (false negative rate)"
}

export const ConfigModes: { [key in FormatType]: ModeInfo } = {
    'average' : {
        'description': 'Average metric above SNR threshold',
        'sliderStep': 1,
        'sliderMax': 50
    },
    'count'   : {
        'description': 'Number of units found above metric threshold',
        'sliderStep': 0.05,
        'sliderMax': 1
    },
    'cpu'     : {
        'description': 'Estimated average compute time',
        'sliderStep': 5,
        'sliderMax': 1000
    }
}
