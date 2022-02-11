import { isOneOf, isString } from "figurl/viewInterface/kacheryTypes"
import { default as validateObject, isArrayOf, isEqualTo, isNull, optional } from "figurl/viewInterface/validateObject"

export type ComparisonWithTruthUnit = {
    unit_id: number
    accuracy: number
    best_unit: number
    matched_unit: number
    num_matches: number
    num_false_negatives: number
    num_false_positives: number
    f_n: number
    f_p: number
}

export type SpikeforestWorkflowResult = {
    comparison_with_truth_uri: string
    comparison_with_truth: ComparisonWithTruthUnit[]
    recording: {
        durationSec: number
        name: string
        numChannels: number
        numTrueUnits: number
        recordingUri: string
        sampleRateHz: number
        sortingTrueUri: string
        spikeSign: number
        studyName: string
        studySetName: string
    }
    recording_nwb_uri: string
    sorter: {
        name: string
        algorithm: string
        sorting_params: {[key: string]: any}
    }
    sorting_npz_uri: string
    sorting_true_npz_uri: string
    sorting_true_metrics_uri?: string | null
    sorting_true_metrics?: {
        unit_metrics: {[key: string]: any}[]
    } | null
    sorting_figurl?: string
}

export const isSpikeforestWorkflowResult = (x: any): x is SpikeforestWorkflowResult => {
    return validateObject(x, {
        comparison_with_truth_uri: isString,
        comparison_with_truth: isArrayOf(() => (true)),
        recording: (() => (true)),
        recording_nwb_uri: isString,
        sorter: () => (true),
        sorting_npz_uri: isString,
        sorting_true_npz_uri: isString,
        sorting_true_metrics_uri: optional(isOneOf([isNull, isString])),
        sorting_true_metrics: optional(() => (true)),
        sorting_figurl: optional(isOneOf([isNull, isString]))
    }, {allowAdditionalFields: true})
}

export type SpikeforestWorkflowResultsViewData = {
    type: 'spikeforest-workflow-results'
    results: SpikeforestWorkflowResult[]
}

export const isSpikeforestWorkflowResultsViewData = (x: any): x is SpikeforestWorkflowResultsViewData => {
    return validateObject(x, {
        type: isEqualTo('spikeforest-workflow-results'),
        results: isArrayOf(isSpikeforestWorkflowResult)
    })
}