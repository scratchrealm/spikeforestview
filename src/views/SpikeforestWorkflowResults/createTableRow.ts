import { OrganizedRecording, OrganizedStudy, OrganizedStudySet } from "./organizeResults"
import * as d3 from "d3";
import { Page } from "./Page";
import { SpikeforestWorkflowResult } from "./SpikeforestWorkflowResultsViewData";

export const createStudySetRow = (studySet: OrganizedStudySet, setPage: (page: Page) => void, tableValueForResults: (results: SpikeforestWorkflowResult[]) => number, formatTableValue: (x: number) => string) => {
    return {
        id: studySet.studySetName,
        cells: [
            {
                id: '_name',
                text: studySet.studySetName,
                color: 'black',
                bgcolor: 'white',
                textAlign: 'right',
                cellWrap: true,
                onClick: () => {setPage({type: 'studyset', studySetName: studySet.studySetName})}
            },
            ...studySet.resultsBySorter.map(x => {
                const val = tableValueForResults(x.results)
                return {
                    id: x.sorterName,
                    text: formatTableValue(val),
                    textAlign: 'center',
                    bgcolor: computeBackgroundColor(val, 'average'),
                    color: computeForegroundColor(val)
                }
            })
        ],
        subrows: studySet.studies.map((study) => (
            createStudyRow(study, setPage, tableValueForResults, formatTableValue)
        ))
    }
}

export const createStudyRow = (study: OrganizedStudy, setPage: (page: Page) => void, tableValueForResults: (results: SpikeforestWorkflowResult[]) => number, formatTableValue: (x: number) => string) => {
    return {
        id: study.studyName,
        cells: [
            {
                id: '_name2',
                text: study.studyName,
                color: 'black',
                bgcolor: 'white',
                textAlign: 'right',
                cellWrap: true,
                onClick: () => {setPage({type: 'study', studySetName: study.studySetName, studyName: study.studyName})}
            },
            ...study.resultsBySorter.map(x => {
                const val = tableValueForResults(x.results)
                return {
                    id: x.sorterName,
                    text: formatTableValue(val),
                    textAlign: 'center',
                    bgcolor: computeBackgroundColor(val, 'average'),
                    color: computeForegroundColor(val)
                }
            }
        )],
        subrows: study.recordings.map((recording) => (
            createRecordingRow(recording, setPage, tableValueForResults, formatTableValue)
        ))
    }
}

export const createRecordingRow = (recording: OrganizedRecording, setPage: (page: Page) => void, tableValueForResults: (results: SpikeforestWorkflowResult[]) => number, formatTableValue: (x: number) => string) => {
    return {
        id: recording.recordingName,
        cells: [
            {
                id: '_name3',
                text: recording.recordingName,
                color: 'black',
                bgcolor: 'white',
                textAlign: 'right',
                cellWrap: true,
                onClick: () => {setPage({type: 'recording', studySetName: recording.studySetName, studyName: recording.studyName, recordingName: recording.recordingName})}
            },
            ...recording.resultsBySorter.map(x => {
                const val = tableValueForResults(x.results)
                const result = x.results.length === 1 ? x.results[0] : undefined
                return {
                    id: x.sorterName,
                    text: formatTableValue(val),
                    textAlign: 'center',
                    bgcolor: computeBackgroundColor(val, 'average'),
                    color: computeForegroundColor(val),
                    onClick: () => {setPage({type: 'result', studySetName: recording.studySetName, studyName: recording.studyName, recordingName: recording.recordingName, sorterName: x.sorterName, result})}
                    // link: result0 ? result0.sorting_figurl : undefined
                }
            })
        ],
        subrows: []
    }
}

const computeBackgroundColor = (
    val: number | undefined,
    format: "count" | "average" | "cpu"
) => {
    if (val === undefined) return "white"
    let square = Math.pow(val, 2)
    if (format === "count") return d3.interpolateGreens(square)
    else if (format === "average") return d3.interpolateBlues(square)
    else if (format === "cpu") return d3.interpolateYlOrRd(square)
    else return "white"
}

const computeForegroundColor = (val: number | undefined) => {
    if (val === undefined) return "black"
    return val < 0.7 ? "black" : "white"
}

