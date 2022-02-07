import React, { FunctionComponent, useMemo } from 'react';
import ExpandingHeatmapTable from './ExpandingHeatmapTable/ExpandingHeatmapTable';
import { ExpandingHeatmapTableRowType } from './ExpandingHeatmapTable/ExpandingHeatmapTableRow';
import { SpikeforestWorkflowResult, SpikeforestWorkflowResultsViewData } from './SpikeforestWorkflowResultsViewData';
import * as d3 from "d3"

type Props = {
    data: SpikeforestWorkflowResultsViewData
    width: number
    height: number
}

const SpikeforestWorkflowResultsView: FunctionComponent<Props> = ({data, width, height}) => {
    const {results} = data
    const organizedResults = organizeResults(results)

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

    const rows: ExpandingHeatmapTableRowType[] = useMemo(() => {
        const rows: ExpandingHeatmapTableRowType[] = []
        for (let studySet of organizedResults.studySets) {
            const r = {
                id: studySet.studySetName,
                cells: [
                    {
                        id: '_name',
                        text: studySet.studySetName,
                        color: 'black',
                        bgcolor: 'white',
                        textAlign: 'right',
                        cellWrap: true
                    },
                    ...studySet.resultsBySorter.map(x => {
                        const val = meanOfArrays(x.results.map(r => (
                            r.comparison_with_truth.map(u => (u.accuracy))
                        )))
                        return {
                            id: x.sorterName,
                            text: formatNum(val),
                            textAlign: 'center',
                            bgcolor: computeBackgroundColor(val, 'average'),
                            color: computeForegroundColor(val)
                        }
                    })
                ],
                subrows: studySet.studies.map((study) => ({
                    id: study.studyName,
                    cells: [
                        {
                            id: '_name2',
                            text: study.studyName,
                            color: 'black',
                            bgcolor: 'white',
                            textAlign: 'right',
                            cellWrap: true
                        },
                        ...study.resultsBySorter.map(x => {
                            const val = meanOfArrays(x.results.map(r => (
                                r.comparison_with_truth.map(u => (u.accuracy))
                            )))
                            return {
                                id: x.sorterName,
                                text: formatNum(val),
                                textAlign: 'center',
                                bgcolor: computeBackgroundColor(val, 'average'),
                                color: computeForegroundColor(val)
                            }
                        }
                    )],
                    subrows: []
                }))
            }
            rows.push(r)
        }
        return rows
    }, [organizedResults])

    return (
        <div style={{padding: 50}}>
            <div className="page__body page__body--alert">
                <ExpandingHeatmapTable
                    header={header}
                    rows={rows}
                    onCellSelected={() => {}}
                />
            </div>
        </div>
    )
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
  

const formatNum = (x: number) => {
    return x.toPrecision(3)
}

const meanOfArrays = (x: number[][]) => {
    return meanOfArray(([] as number[]).concat(...x))
}

const meanOfArray = (x: number[]) => {
    if (x.length === 0) return 0
    return x.reduce((a, b) => a + b) / x.length
}

const organizeResults = (results: SpikeforestWorkflowResult[]) => {
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

const organizeStudySet = (studySetName: string, results: SpikeforestWorkflowResult[], sorterNames: string[]) => {
    const allStudyNames = unique(results.map(r => (r.recording.studyName)))
    allStudyNames.sort()

    return {
        studySetName,
        resultsBySorter: sorterNames.map(sorterName => ({
            sorterName,
            results: results.filter(r => (r.sorter.name === sorterName))
        })),
        studies: allStudyNames.map(studyName => (
            organizeStudy(studyName, results.filter(r => (r.recording.studyName === studyName)), sorterNames)
        ))
    }
}

const organizeStudy = (studyName: string, results: SpikeforestWorkflowResult[], sorterNames: string[]) => {
    return {
        studyName,
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