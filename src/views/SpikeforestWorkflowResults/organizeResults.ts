import { SpikeforestWorkflowResult } from "./SpikeforestWorkflowResultsViewData"

export type OrganizedResults = {
    sorterNames: string[]
    trueUnitMetricNames: string[]
    resultsBySorter: {
        sorterName: string
        results: SpikeforestWorkflowResult[]
    }[]
    studySets: OrganizedStudySet[]
}

export type OrganizedStudySet = {
    studySetName: string
    resultsBySorter: {
        sorterName: string
        results: SpikeforestWorkflowResult[]
    }[]
    studies: OrganizedStudy[]
}

export type OrganizedStudy = {
    studySetName: string
    studyName: string
    resultsBySorter: {
        sorterName: string
        results: SpikeforestWorkflowResult[]
    }[]
    recordings: OrganizedRecording[]
}

export type OrganizedRecording = {
    studySetName: string
    studyName: string
    recordingName: string
    resultsBySorter: {
        sorterName: string
        results: SpikeforestWorkflowResult[]
    }[]
}

export const organizeResults = (results: SpikeforestWorkflowResult[]): OrganizedResults => {
    const allStudySetNames = unique(results.map(r => (r.recording.studySetName)))
    allStudySetNames.sort()

    const allSorterNames = unique(results.map(r => (r.sorter.name)))
    allSorterNames.sort()

    let allTrueUnitMetricNames: string[] = []
    for (let r of results) {
        if (r.sorting_true_metrics) {
            for (let a of r.sorting_true_metrics.unit_metrics) {
                for (let b in a) {
                    if (b !== 'unitId') allTrueUnitMetricNames.push(b)
                }
            }
        }
    }
    allTrueUnitMetricNames = unique(allTrueUnitMetricNames)
    allTrueUnitMetricNames.sort()

    return {
        sorterNames: allSorterNames,
        trueUnitMetricNames: allTrueUnitMetricNames,
        resultsBySorter: allSorterNames.map(sorterName => ({
            sorterName,
            results: results.filter(r => (r.sorter.name === sorterName))
        })),
        studySets: allStudySetNames.map(studySetName => (
            organizeStudySet(studySetName, results.filter(r => (r.recording.studySetName === studySetName)), allSorterNames)
        ))
    }
}

const organizeStudySet = (studySetName: string, results: SpikeforestWorkflowResult[], sorterNames: string[]): OrganizedStudySet => {
    const allStudyNames = unique(results.map(r => (r.recording.studyName)))
    allStudyNames.sort()

    return {
        studySetName,
        resultsBySorter: sorterNames.map(sorterName => ({
            sorterName,
            results: results.filter(r => (r.sorter.name === sorterName))
        })),
        studies: allStudyNames.map(studyName => (
            organizeStudy(studySetName, studyName, results.filter(r => (r.recording.studyName === studyName)), sorterNames)
        ))
    }
}

const organizeStudy = (studySetName: string, studyName: string, results: SpikeforestWorkflowResult[], sorterNames: string[]): OrganizedStudy => {
    const allRecordingNames = unique(results.map(r => (r.recording.name)))
    allRecordingNames.sort()

    return {
        studySetName,
        studyName,
        resultsBySorter: sorterNames.map(sorterName => ({
            sorterName,
            results: results.filter(r => (r.sorter.name === sorterName))
        })),
        recordings: allRecordingNames.map(recordingName => (
            organizeRecording(studySetName, studyName, recordingName, results.filter(r => (r.recording.name === recordingName)), sorterNames)
        ))
    }
}

const organizeRecording = (studySetName: string, studyName: string, recordingName: string, results: SpikeforestWorkflowResult[], sorterNames: string[]): OrganizedRecording => {
    return {
        studySetName,
        studyName,
        recordingName,
        resultsBySorter: sorterNames.map(sorterName => ({
            sorterName,
            results: results.filter(r => (r.sorter.name === sorterName))
        }))
    }
}

const unique = (x: string[]) => {
    return [...new Set(x)]
}