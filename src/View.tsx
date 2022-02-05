import React, { FunctionComponent } from 'react';
import SpikeforestWorkflowResultsView from 'views/SpikeforestWorkflowResults/SpikeforestWorkflowResultsView';
import { ViewData } from './ViewData';

type Props = {
    data: ViewData
    width: number
    height: number
}

const View: FunctionComponent<Props> = ({data, width, height}) => {
    if (data.type === 'spikeforest-workflow-results') {
        return <SpikeforestWorkflowResultsView data={data} width={width} height={height} />
    }
    else {
        return <div>Unexpected view data</div>
    }
}

export default View