import React, { FunctionComponent } from 'react';
import { ComparisonWithTruthUnit, SpikeforestWorkflowRecording } from './SpikeforestWorkflowResultsViewData';

type Props = {
    trueUnits: TrueUnit[]
}

export type TrueUnit = {
    recording: SpikeforestWorkflowRecording
    comparisonWithTruthUnitsBySorter: {[key: string]: ComparisonWithTruthUnit}
}


const TrueUnitsTable: FunctionComponent<Props> = ({trueUnits}) => {
    return (
        <div>
            <pre>
                {JSON.stringify(trueUnits, null, 4)}
            </pre>
        </div>
    )
}

export default TrueUnitsTable