import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import React, { FunctionComponent, useMemo } from 'react';
import { SpikeforestWorkflowResult } from './SpikeforestWorkflowResultsViewData';

type Props = {
    result: SpikeforestWorkflowResult
}

const ResultView: FunctionComponent<Props> = ({result}) => {
    const unitMetricNames: string[] = useMemo(() => {
        if (result.sorting_true_metrics) {
            const a = result.sorting_true_metrics.unit_metrics[0]
            if (a) {
                return Object.keys(a).filter(metricName => (metricName !== 'unitId'))
            }
        }
        return []
    }, [result])
    return (
        <span>
            <Table className="NiceTable">
                <TableBody>
                    <TableRow>
                        <TableCell>Recording</TableCell>
                        <TableCell>{result.recording.studySetName} {result.recording.studyName} {result.recording.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Num. channels</TableCell>
                        <TableCell>{result.recording.numChannels}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Duration (sec)</TableCell>
                        <TableCell>{result.recording.durationSec}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Num. true units</TableCell>
                        <TableCell>{result.recording.numTrueUnits}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Recording NWB</TableCell>
                        <TableCell>{result.recording_nwb_uri}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sorting true NPZ</TableCell>
                        <TableCell>{result.sorting_true_npz_uri}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sorting NPZ</TableCell>
                        <TableCell>{result.sorting_npz_uri}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sorter</TableCell>
                        <TableCell>{result.sorter.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sorting algorithm</TableCell>
                        <TableCell>{result.sorter.algorithm}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sorting parameters</TableCell>
                        <TableCell><SortingParameters sortingParameters={result.sorter.sorting_params} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>View</TableCell>
                        <TableCell>{
                            result.sorting_figurl ? (
                                <a href={result.sorting_figurl} target="_blank" rel="noreferrer">view with spikesortingview</a>
                            ) : <span>Not available</span>
                        }</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <h3>&nbsp;</h3>
            <h3>Comparison with truth</h3>
            <Table className="NiceTable">
                <TableHead>
                    <TableRow>
                        <TableCell>True unit</TableCell>
                        <TableCell>Best match</TableCell>
                        <TableCell>Accuracy</TableCell>
                        <TableCell>Precision</TableCell>
                        <TableCell>Recall</TableCell>
                        {
                            unitMetricNames.map(metricName => (
                                <TableCell>{metricName}</TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        result.comparison_with_truth.map(x => (
                            <TableRow key={x.unit_id}>
                                <TableCell>{x.unit_id}</TableCell>
                                <TableCell>{x.best_unit}</TableCell>
                                <TableCell>{formatNum(x.accuracy)}</TableCell>
                                <TableCell>{formatNum(x.num_matches / (x.num_matches + x.num_false_positives))}</TableCell>
                                <TableCell>{formatNum(x.num_matches / (x.num_matches + x.num_false_negatives))}</TableCell>
                                {
                                    unitMetricNames.map(metricName => (
                                        <TableCell>{formatMetricValue(trueUnitMetricValue(result, x.unit_id, metricName))}</TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </span>
    )
}

const trueUnitMetricValue = (result: SpikeforestWorkflowResult, unitId: number, metricName: string) => {
    if (!result.sorting_true_metrics) return undefined
    const a = result.sorting_true_metrics.unit_metrics.filter(x => (x['unitId'] === unitId))[0]
    if (!a) return
    return a[metricName]
}

const formatMetricValue = (x: any) => {
    if (!x) return x
    if (typeof(x) === 'number') return x.toPrecision(4)
    return x
}

const formatNum = (x: number) => {
    return x.toFixed(3)
}

const SortingParameters: FunctionComponent<{sortingParameters: {[key: string]: any}}> = ({sortingParameters}) => {
    return (
        <span>
            {
                Object.keys(sortingParameters).map((k) => (
                    <span key={k}>
                        {k}: {toString(sortingParameters[k])}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                ))
            }
        </span>
    )
}

const toString = (x: any) => {
    if (typeof(x) === 'boolean') {
        return x ? 'true' : 'false'
    }
    else return `${x}`
}

export default ResultView