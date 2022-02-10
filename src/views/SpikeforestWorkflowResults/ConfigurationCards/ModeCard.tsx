import { FunctionComponent } from 'react'
import { Form } from 'react-bootstrap'
import { ConfigModes, FormatType, ModeProps } from './ConfigurationTypes'

const ModeCard: FunctionComponent<ModeProps> = (Props: ModeProps) => {
    const extraClass = Props.useColumnFormat ? 'card__std-col card__std-top' : 'card__std'
    const modesList: Array<FormatType> = ['average', 'count']
    if (Props.showCPU) {
        modesList.push('cpu')
    }

    return (
        <div className={`card ${extraClass}`} style={{maxWidth: 300}}>
            <div className="content">
                <div className="card__label">
                    <p>
                        Mode: <strong>{ConfigModes[Props.format].description}</strong>
                    </p>
                </div>
                <div className="card__footer">
                    <hr />
                    <div className="card__form">
                        <Form.Control
                            as="select"
                            size="lg"
                            value={Props.format}
                            onChange={e => Props.onFormatChange(e.target.value as FormatType)}
                        >
                            {modesList.map(modekey => (
                                <option key={`${modekey}-1`} value={modekey}>
                                    { ConfigModes[modekey].description }
                                </option>
                            ))}
                        </Form.Control>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModeCard
