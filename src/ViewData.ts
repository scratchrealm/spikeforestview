import { isOneOf } from "figurl/viewInterface/kacheryTypes"
import { SpikeforestWorkflowResultsViewData, isSpikeforestWorkflowResultsViewData } from "views/SpikeforestWorkflowResults/SpikeforestWorkflowResultsViewData"

export type ViewData =
    SpikeforestWorkflowResultsViewData

export const isViewData = (x: any): x is ViewData => {
    return isOneOf([
        isSpikeforestWorkflowResultsViewData
    ])(x)
}