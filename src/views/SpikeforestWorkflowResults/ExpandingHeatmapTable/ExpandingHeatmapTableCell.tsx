import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import React, { CSSProperties, FunctionComponent, useMemo } from 'react';

export interface CellType {
    id: string,
    link?: string,
    text: string | any,
    rotate?: boolean,
    borderRight?: boolean,
    borderTop?: boolean,
    selectable?: boolean,
    spacer?: boolean,
    idToExpandOnClick?: string,
    cellWrap?: boolean
    color?: string,
    bgcolor?: string,
    textAlign?: any, // can't seem to find the actual definition anywhere
    onClick?: () => void
}

type CellProps = CellType & {
    hideContent: boolean
    selected?: boolean
    handleCellSelected: (cell: CellType) => void
}


export interface RowToggleProps {
    id: string,
    toggleIsRequired: boolean,
    rowIsExpanded: boolean,
    handler: (id: string) => void
}
const RowToggleButton: FunctionComponent<RowToggleProps> = (Props: RowToggleProps) => {
    return (
        <div
            onClick={() => Props.handler(Props.id)}
        >
            <span className="expandable-button">{Props.rowIsExpanded ? "-" : "+"}</span>
        </div>
    )
}

export const RowToggleCell: FunctionComponent<RowToggleProps> = (Props: RowToggleProps) => {
    if (!Props.toggleIsRequired) {
        return (
            <td key={"empty-cell-" + Props.id} />
        )
    } else {
        return (
            <td key={`${Props.rowIsExpanded ? "collapse" : "expand "}-button-${Props.id}`}>
                <RowToggleButton
                    id={Props.id}
                    toggleIsRequired={Props.toggleIsRequired}
                    rowIsExpanded={Props.rowIsExpanded}
                    handler={Props.handler}
                />
            </td>
        )
    }
}

const ExpandingHeatmapTableCell: FunctionComponent<CellProps> = (Props: CellProps) => {
    const contentSpan = Props.link  ? <a href={Props.link} target='_blank' rel="noreferrer" style={{color: Props.color}}>{Props.text}</a>
                        : Props.onClick ? <Hyperlink onClick={Props.onClick}><span style={{color: Props.color}}>{Props.text}</span></Hyperlink>
                        : <span>{Props.text}</span>
    const classList: string[] = useMemo(() => {
        const list: string[] = []
        // find a neater way to do this?
        if (Props.selected)          { list.push("selected")     }
        if (Props.rotate)            { list.push("rotate")       }
        if (Props.borderRight)       { list.push("borderRight")  }
        if (Props.borderTop)         { list.push("border_top")   } // this might not exist
        if (Props.selectable)        { list.push("selectable")   }
        if (Props.spacer)            { list.push("spacer")       }
        if (Props.idToExpandOnClick) { list.push("expandable")   }
        if (Props.cellWrap)          { list.push("cellWrap")     }
        return list
    }, [Props])

    // TODO: Look up how to do this more elegantly
    const cellStyling: CSSProperties = useMemo(() => ({
        color:            Props.color      || "black",
        backgroundColor:  Props.bgcolor    || "white",
        textAlign:        Props.textAlign || "left"
    }), [Props.color, Props.bgcolor, Props.textAlign])

    return (
        <td
            onClick={() => Props.handleCellSelected(Props)}
            className={classList.join(" ")}
            style = {Props.hideContent ? {} : cellStyling}
            key={Props.id}
        >
            <div>
                { Props.hideContent ? <span /> : contentSpan }
            </div>
        </td>
    )
}

export default ExpandingHeatmapTableCell
