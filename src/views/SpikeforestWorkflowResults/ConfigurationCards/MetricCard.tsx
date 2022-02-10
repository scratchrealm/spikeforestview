import React, { FunctionComponent } from "react"
import {
    ButtonToolbar, ToggleButton,
    ToggleButtonGroup
} from 'react-bootstrap'
import { toTitleCase } from '../util'
import { ConfigMetrics, MetricProps } from "./ConfigurationTypes"


const MetricCard: FunctionComponent<MetricProps> = (Props: MetricProps) => {
    const extraClass = Props.useColumnFormat ? "card__std-col" : "card__std"
    return (
        <div className={`card ${extraClass}`} style={{maxWidth: 400}}>
            <div className="content">
                <div className="card__label">
                    <div className="card__label--row">
                        <p>
                            Metric: <strong>{toTitleCase(Props.metric)}</strong>{" "}
                            <span className="card__formula">{ConfigMetrics[Props.metric]}</span>
                        </p>
                        {/* <Form.Check
                            type="checkbox"
                            id="check-api-checkbox"
                            inline
                            className="card-label-form"
                        >
                            <Form.Check.Input
                                type="checkbox"
                                checked={Props.imputeMissingValues}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    Props.onImputeMissingValuesChange(e.target.checked)
                                }}
                            />
                            <Form.Check.Label className="input__label">
                                Impute missing values
                            </Form.Check.Label>
                        </Form.Check> */}
                    </div>
                </div>
                <div className="card__footer">
                    <hr />
                    <ButtonToolbar>
                        <ToggleButtonGroup
                            type="radio"
                            name="options"
                            size="lg"
                            value={Props.metric}
                            onChange={Props.onMetricChange}
                            className="metric_button_toggle"
                        >
                            {Object.keys(ConfigMetrics).map(k => {
                                return (
                                    <ToggleButton
                                    size="lg"
                                    value={k}
                                    key={k}
                                    variant="outline-dark"
                                >
                                    { toTitleCase(k) }
                                </ToggleButton>
                                )
                            })}
                        </ToggleButtonGroup>
                    </ButtonToolbar>
                </div>
            </div>
        </div>
    )
}

export default MetricCard