import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import NiceTable from 'components/NiceTable/NiceTable';
import React, { FunctionComponent, useMemo } from 'react';
import { Page } from './Page';
import { ComparisonWithTruthUnit, SpikeforestWorkflowRecording, SpikeforestWorkflowResult } from './SpikeforestWorkflowResultsViewData';

type Props = {
    sorterNames: string[]
    trueUnitMetricNames: string[]
    trueUnits: TrueUnit[]
    metricValueForUnit: (unit: ComparisonWithTruthUnit) => number
    formatMetricValue: (x: number) => string
    formatTrueUnitMetricValue: (trueUnitMetricName: string, x: number) => string
    setPage: (page: Page) => void
}

export type TrueUnit = {
    recording: SpikeforestWorkflowRecording
    trueUnitId: number
    comparisonWithTruthUnitsBySorter: {[key: string]: ComparisonWithTruthUnit}
    trueUnitMetrics: {[key: string]: any}
    result: SpikeforestWorkflowResult
}


const TrueUnitsTable: FunctionComponent<Props> = ({sorterNames, trueUnitMetricNames, trueUnits, metricValueForUnit, formatMetricValue, formatTrueUnitMetricValue, setPage}) => {
    const columns = useMemo(() => ([
        {key: 'studyName', label: 'Study'},
        {key: 'recordingName', label: 'Recording'},
        {key: 'trueUnitId', label: 'True unit ID'},
        ...trueUnitMetricNames.map(trueUnitMetricName => (
            {key: `trueUnitMetric:${trueUnitMetricName}`, label: trueUnitMetricName}
        )),
        ...sorterNames.map(sorterName => (
            {key: `sorter:${sorterName}`, label: sorterName}
        ))
    ]), [sorterNames, trueUnitMetricNames])

    const rows = useMemo(() => (
        trueUnits.map(x => {
            const trueUnitMetricValues: {[key: string]: string} = {}
            for (let trueUnitMetricName of trueUnitMetricNames) {
                const a = x.trueUnitMetrics[trueUnitMetricName]
                if (a) trueUnitMetricValues['trueUnitMetric:' + trueUnitMetricName] = formatTrueUnitMetricValue(trueUnitMetricName, a)
            }
            const sorterValues: {[key: string]: {text: string, element: any}} = {}
            for (let sorterName of sorterNames) {
                const u = x.comparisonWithTruthUnitsBySorter[sorterName]
                if (u) {
                    const onclick = () => {
                        setPage({type: 'result', studySetName: x.recording.studySetName, studyName: x.recording.studyName, recordingName: x.recording.name, sorterName: sorterName, result: x.result})
                    }
                    sorterValues['sorter:' + sorterName] = {
                        text: formatMetricValue(metricValueForUnit(u)),
                        element: <Hyperlink onClick={onclick}>{formatMetricValue(metricValueForUnit(u))}</Hyperlink>
                    }
                }
            }
            return {
                key: `${x.recording.studySetName}:${x.recording.studyName}:${x.recording.name}:${x.trueUnitId}`,
                columnValues: {
                    studyName: `${x.recording.studySetName}/${x.recording.studyName}`,
                    recordingName: x.recording.name,
                    trueUnitId: x.trueUnitId,
                    ...trueUnitMetricValues,
                    ...sorterValues
                }
            }
        })), [trueUnits, trueUnitMetricNames, sorterNames, metricValueForUnit, formatMetricValue, formatTrueUnitMetricValue, setPage])
    return (
        <NiceTable
            rows={rows}
            columns={columns}
        />
    )
}

export default TrueUnitsTable