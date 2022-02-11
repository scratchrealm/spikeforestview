import { Grid } from '@material-ui/core';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormatType, MetricType } from './ConfigurationCards/ConfigurationTypes';
import MetricCard from './ConfigurationCards/MetricCard';
import ModeCard from './ConfigurationCards/ModeCard';
import SliderCard from './ConfigurationCards/SliderCard';
import { createRecordingRow, createStudyRow, createStudySetRow } from './createTableRow';
import ExpandingHeatmapTable from './ExpandingHeatmapTable/ExpandingHeatmapTable';
import { ExpandingHeatmapTableRowType } from './ExpandingHeatmapTable/ExpandingHeatmapTableRow';
import { organizeResults } from './organizeResults';
import { Page } from './Page';
import ResultView from './ResultView';
import { ComparisonWithTruthUnit, SpikeforestWorkflowResult, SpikeforestWorkflowResultsViewData } from './SpikeforestWorkflowResultsViewData';
import TrueUnitsTable, { TrueUnit } from './TrueUnitsTable';

type Props = {
    data: SpikeforestWorkflowResultsViewData
    width: number
    height: number
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

    const trueUnits = useMemo(() => {
        const filteredResults =
            page.type === 'recording' ? results.filter(r => ((r.recording.studySetName === page.studySetName) && (r.recording.studyName === page.studyName) && (r.recording.name === page.recordingName))) :
            page.type === 'study' ? results.filter(r => ((r.recording.studySetName === page.studySetName) && (r.recording.studyName === page.studyName))) :
            page.type === 'studyset' ? results.filter(r => (r.recording.studySetName === page.studySetName)) :
            undefined
        if (!filteredResults) return undefined
        const trueUnits: TrueUnit[] = []
        const X: {[key: string]: TrueUnit} = {}
        for (let r of filteredResults) {
            for (let u of r.comparison_with_truth) {
                const key = r.recording.studyName + '::' + r.recording.name + '::' + u.unit_id
                if (!(key in X)) {
                    const tu = {
                        recording: r.recording,
                        comparisonWithTruthUnitsBySorter: {}
                    }
                    X[key] = tu
                    trueUnits.push(tu)
                }
                X[key].comparisonWithTruthUnitsBySorter[r.sorter.name] = u
            }
        }
        return trueUnits
    }, [results, page])

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
                            {
                                trueUnits ? (
                                    <TrueUnitsTable
                                        trueUnits={trueUnits}
                                    />
                                ) : <span />
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
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

export default SpikeforestWorkflowResultsView