import { SpikeforestWorkflowResult } from "./SpikeforestWorkflowResultsViewData";

export type Page = {
    type: 'main'
} | {
    type: 'studyset'
    studySetName: string
} | {
    type: 'study'
    studySetName: string
    studyName: string
} | {
    type: 'recording'
    studySetName: string
    studyName: string
    recordingName: string
} | {
    type: 'result'
    studySetName: string
    studyName: string
    recordingName: string
    sorterName: string
    result?: SpikeforestWorkflowResult
}
