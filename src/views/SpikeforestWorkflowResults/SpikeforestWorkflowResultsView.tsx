import { Grid } from '@material-ui/core';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import * as d3 from "d3";
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormatType, MetricType } from './ConfigurationCards/ConfigurationTypes';
import MetricCard from './ConfigurationCards/MetricCard';
import ModeCard from './ConfigurationCards/ModeCard';
import SliderCard from './ConfigurationCards/SliderCard';
import ExpandingHeatmapTable from './ExpandingHeatmapTable/ExpandingHeatmapTable';
import { ExpandingHeatmapTableRowType } from './ExpandingHeatmapTable/ExpandingHeatmapTableRow';
import ResultView from './ResultView';
import { ComparisonWithTruthUnit, SpikeforestWorkflowResult, SpikeforestWorkflowResultsViewData } from './SpikeforestWorkflowResultsViewData';

type Props = {
    data: SpikeforestWorkflowResultsViewData
    width: number
    height: number
}

type Page = {
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

const SpikeforestWorkflowResultsView: FunctionComponent<Props> = ({data, width, height}) => {
    const {results} = data
    const organizedResults = organizeResults(results)

    const [page, setPage] = useState<Page>({type: 'main'})
    const [metric, setMetric] = useState<MetricType>('accuracy')
    const [format, setFormat] = useState<FormatType>('average')

    const [snrCutoff, setSnrCutoff] = useState<number>(8)
    const [metricCutoff, setMetricCutoff] = useState<number>(0.8)

    useEffect(() => {
        // for now, force snr cutoff to be 0 - because we don't have access to the unit snrs yet
        if (snrCutoff !== 0) {
            setSnrCutoff(0)
        }
    }, [snrCutoff])

    const cutoff = useMemo(() => (
        format === 'average' ? snrCutoff : metricCutoff
    ), [format, snrCutoff, metricCutoff])

    const setCutoff = useCallback((cutoff: number) => {
        if (format === 'average') setSnrCutoff(cutoff)
        else setMetricCutoff(cutoff)
    }, [format])

    const header: ExpandingHeatmapTableRowType = useMemo(() => (
        {
            id: 'header',
            cells: [{id: '_name', text: ''}, ...organizedResults.sorterNames.map((sorterName) => ({
                id: sorterName,
                text: sorterName,
                rotate: true
            }))],
            subrows: []
        }
    ), [organizedResults.sorterNames])

    const metricValueForUnit = useMemo(() => ((unit: ComparisonWithTruthUnit) => {
        if (metric === 'accuracy') {
            return unit.accuracy
        }
        else if (metric === 'precision') {
            return unit.num_matches / (unit.num_matches + unit.num_false_positives)
        }
        else if (metric === 'recall') {
            return unit.num_matches / (unit.num_matches + unit.num_false_negatives)
        }
        else return 0
    }), [metric])

    const tableValueForResults = useMemo(() => ((results: SpikeforestWorkflowResult[]) => {
        if (format === 'average') {
            return meanOfArrays(results.map(r => (
                r.comparison_with_truth.map(u => (metricValueForUnit(u)))
            )))
        }
        else {
            return countAboveThresholdOfArrays(results.map(r => (
                r.comparison_with_truth.map(u => (metricValueForUnit(u)))
            )), metricCutoff)
        }
    }), [metricValueForUnit, format, metricCutoff])

    const formatTableValue = useMemo(() => ((x: number) => {
        return format === 'average' ? `${x.toFixed(3)}` : `${x}`
    }), [format])

    const rows: ExpandingHeatmapTableRowType[] = useMemo(() => {
        const rows: ExpandingHeatmapTableRowType[] = []
        if (page.type === 'main') {
            for (let studySet of organizedResults.studySets) {
                const r = createStudySetRow(studySet, setPage, tableValueForResults, formatTableValue)
                rows.push(r)
            }
        }
        else if (page.type === 'studyset') {
            const studySet = organizedResults.studySets.filter(x => (x.studySetName === page.studySetName))[0]
            for (let study of studySet.studies) {
                const r = createStudyRow(study, setPage, tableValueForResults, formatTableValue)
                rows.push(r)
            }
        }
        else if (page.type === 'study') {
            const studySet = organizedResults.studySets.filter(x => (x.studySetName === page.studySetName))[0]
            const study = studySet.studies.filter(x => (x.studyName === page.studyName))[0]
            for (let recording of study.recordings) {
                const r = createRecordingRow(recording, setPage, tableValueForResults, formatTableValue)
                rows.push(r)
            }
        }
        else if (page.type === 'recording') {
            const studySet = organizedResults.studySets.filter(x => (x.studySetName === page.studySetName))[0]
            const study = studySet.studies.filter(x => (x.studyName === page.studyName))[0]
            const recording = study.recordings.filter(x => (x.recordingName === page.recordingName))[0]
            const r = createRecordingRow(recording, setPage, tableValueForResults, formatTableValue)
            rows.push(r)
        }
        else if (page.type === 'result') {

        }
        return rows
    }, [organizedResults, page, tableValueForResults, formatTableValue])

    const handleGotoMain = useCallback(() => {
        setPage({type: 'main'})
    }, [])

    const handleGotoStudySet = useCallback(() => {
        if ((page.type === 'study') || (page.type === 'recording') || (page.type === 'result')) {
            setPage({
                type: 'studyset',
                studySetName: page.studySetName
            })
        }
    }, [page])

    const handleGotoStudy = useCallback(() => {
        if ((page.type === 'recording') || (page.type === 'result')) {
            setPage({
                type: 'study',
                studySetName: page.studySetName,
                studyName: page.studyName
            })
        }
    }, [page])

    const handleGotoRecording = useCallback(() => {
        if (page.type === 'result') {
            setPage({
                type: 'recording',
                studySetName: page.studySetName,
                studyName: page.studyName,
                recordingName: page.recordingName
            })
        }
    }, [page])


    return (
        <div style={{padding: 50}}>
            <div className="page__body page__body--alert">
                {
                    page.type === 'main' ? (
                        <span />
                    ) : page.type === 'studyset' ? (
                        <h4><Hyperlink onClick={handleGotoMain}>all</Hyperlink> {page.studySetName}</h4>
                    ) : page.type === 'study' ? (
                        <h4><Hyperlink onClick={handleGotoMain}>all</Hyperlink> <Hyperlink onClick={handleGotoStudySet}>{page.studySetName}</Hyperlink> {page.studyName}</h4>
                    ) : page.type === 'recording' ? (
                        <h4><Hyperlink onClick={handleGotoMain}>all</Hyperlink> <Hyperlink onClick={handleGotoStudySet}>{page.studySetName}</Hyperlink> <Hyperlink onClick={handleGotoStudy}>{page.studyName}</Hyperlink> {page.recordingName}</h4>
                    ) : page.type === 'result' ? (
                        <h4><Hyperlink onClick={handleGotoMain}>all</Hyperlink> <Hyperlink onClick={handleGotoStudySet}>{page.studySetName}</Hyperlink> <Hyperlink onClick={handleGotoStudy}>{page.studyName}</Hyperlink> <Hyperlink onClick={handleGotoRecording}>{page.recordingName}</Hyperlink> {page.sorterName}</h4>
                    ) :<span />
                }
                {
                    page.type === 'result' ? (
                        page.result ? (
                            <ResultView
                                result={page.result}
                            />
                        ) : <span>No result found</span>
                    ): (
                        <div>
                            <Grid container direction='row'>
                                <Grid item>
                                    <ModeCard
                                        format={format}
                                        onFormatChange={setFormat}
                                    />
                                </Grid>
                                <Grid item>
                                    <SliderCard
                                        format={format}
                                        cutoffValue={cutoff}
                                        metric={metric}
                                        onValueChange={setCutoff}
                                    />
                                </Grid>
                                <Grid item>
                                    <MetricCard
                                        metric={metric}
                                        onMetricChange={setMetric}
                                        onImputeMissingValuesChange={() => {}}
                                    />
                                </Grid>
                            </Grid>
                            <ExpandingHeatmapTable
                                header={header}
                                rows={rows}
                                onCellSelected={() => {}}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

const createStudySetRow = (studySet: OrganizedStudySet, setPage: (page: Page) => void, tableValueForResults: (results: SpikeforestWorkflowResult[]) => number, formatTableValue: (x: number) => string) => {
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

const createStudyRow = (study: OrganizedStudy, setPage: (page: Page) => void, tableValueForResults: (results: SpikeforestWorkflowResult[]) => number, formatTableValue: (x: number) => string) => {
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
                const val = meanOfArrays(x.results.map(r => (
                    r.comparison_with_truth.map(u => (u.accuracy))
                )))
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

const createRecordingRow = (recording: OrganizedRecording, setPage: (page: Page) => void, tableValueForResults: (results: SpikeforestWorkflowResult[]) => number, formatTableValue: (x: number) => string) => {
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
                const val = meanOfArrays(x.results.map(r => (
                    r.comparison_with_truth.map(u => (u.accuracy))
                )))
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

const meanOfArrays = (x: number[][]) => {
    return meanOfArray(([] as number[]).concat(...x))
}

const meanOfArray = (x: number[]) => {
    if (x.length === 0) return 0
    return x.reduce((a, b) => a + b) / x.length
}

const countAboveThresholdOfArrays = (x: number[][], threshold: number) => {
    return countAboveThreshold(([] as number[]).concat(...x), threshold)
}

const countAboveThreshold = (x: number[], threshold: number) => {
    return x.filter(a => (a >= threshold)).length
}

type OrganizedResults = {
    sorterNames: string[]
    resultsBySorter: {
        sorterName: string
        results: SpikeforestWorkflowResult[]
    }[]
    studySets: OrganizedStudySet[]
}

type OrganizedStudySet = {
    studySetName: string
    resultsBySorter: {
        sorterName: string
        results: SpikeforestWorkflowResult[]
    }[]
    studies: OrganizedStudy[]
}

type OrganizedStudy = {
    studySetName: string
    studyName: string
    resultsBySorter: {
        sorterName: string
        results: SpikeforestWorkflowResult[]
    }[]
    recordings: OrganizedRecording[]
}

type OrganizedRecording = {
    studySetName: string
    studyName: string
    recordingName: string
    resultsBySorter: {
        sorterName: string
        results: SpikeforestWorkflowResult[]
    }[]
}

const organizeResults = (results: SpikeforestWorkflowResult[]): OrganizedResults => {
    const allStudySetNames = unique(results.map(r => (r.recording.studySetName)))
    allStudySetNames.sort()

    const allSorterNames = unique(results.map(r => (r.sorter.name)))
    allSorterNames.sort()

    return {
        sorterNames: allSorterNames,
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

export default SpikeforestWorkflowResultsView