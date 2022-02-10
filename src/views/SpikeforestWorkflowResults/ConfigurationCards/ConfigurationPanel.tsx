import { FunctionComponent } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { HeatmapConfiguration } from "./ConfigurationTypes"
import MetricCard from "./MetricCard"
import ModeCard from "./ModeCard"
import SliderCard from "./SliderCard"

const ConfigurationPanel: FunctionComponent<HeatmapConfiguration> = (Props: HeatmapConfiguration) => {
    return (
        <div>
            { Props.useColumnFormat
                ?   <ColumnLayout {...Props} />
                :   <RowLayout {...Props} />
            }
        </div>
    )
}

const ColumnLayout: FunctionComponent<HeatmapConfiguration> = (Props: HeatmapConfiguration) => {
    return (
        <div className="options-group">
            <ModeCard {...Props} />
            <SliderCard {...Props} />
            <MetricCard {...Props} />
        </div>
    )
}

const RowLayout: FunctionComponent<HeatmapConfiguration> = (Props: HeatmapConfiguration) => {
    const fullWidthModeCard = Props.format === 'cpu'
    const modeCardWidth = fullWidthModeCard ? 12 : 4
    return (
        <Container className="container__heatmap">
            <Row className="container__heatmap--row">
                <Col lg={modeCardWidth} sm={12}>
                    <ModeCard {...Props} />
                </Col>
                { !fullWidthModeCard &&
                    <Col lg={4} sm={12}>
                        <SliderCard {...Props} />
                    </Col>
                }
                { !fullWidthModeCard &&
                    <Col lg={4} sm={12}>
                        <MetricCard {...Props} />
                    </Col>
                }
            </Row>
        </Container>
    )
}

export default ConfigurationPanel