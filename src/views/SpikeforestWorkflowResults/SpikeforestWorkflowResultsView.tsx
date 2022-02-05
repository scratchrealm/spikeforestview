import React, { FunctionComponent } from 'react';
import { SpikeforestWorkflowResultsViewData } from './SpikeforestWorkflowResultsViewData';

type Props = {
    data: SpikeforestWorkflowResultsViewData
    width: number
    height: number
}

const SpikeforestWorkflowResultsView: FunctionComponent<Props> = ({data, width, height}) => {
    const {results} = data
    return (
        <div>
            {
                results.map((result) => (
                    <div>
                        {result.comparison_with_truth_uri}
                    </div>
                ))
            }
        </div>
    )
}

export default SpikeforestWorkflowResultsView