import React, { FunctionComponent, useState } from "react";
import ExpandingHeatmapTableCell, { CellType, RowToggleCell } from "./ExpandingHeatmapTableCell";

export interface ExpandingHeatmapTableRowType {
    id: string
    cells: CellType[]
    subrows: ExpandingHeatmapTableRowType[]
}

type ExpandingHeatmapTableRowProps = ExpandingHeatmapTableRowType & {
    selectedCellId: string
    isSubrow: boolean
    cellSelectionHandler: (cell: CellType) => void
}

type RowState = "Empty" | "Expanded" | "Collapsed"

const toggleRowState = (current: RowState): RowState => {
    if (current === "Empty") return "Empty"
    return current === "Expanded" ? "Collapsed" : "Expanded"
}

const ExpandingHeatmapTableRow: FunctionComponent<ExpandingHeatmapTableRowProps> = (Props: ExpandingHeatmapTableRowProps) => {
    const hasSubrows = Props.subrows && Props.subrows.length > 0
    const [collapsedState, setCollapsedState] = useState<RowState>(hasSubrows ? "Collapsed" : "Empty")

    return (
        <React.Fragment key={'wrapper-' + Props.id}>
            <tr key={"row-key-" + Props.id}
                className={Props.isSubrow ? "subrow" : "toprow"}
            >
                <RowToggleCell
                    id={Props.id + "-toggleCell"}
                    toggleIsRequired={hasSubrows}
                    rowIsExpanded={collapsedState === "Expanded"}
                    handler={() => {setCollapsedState(toggleRowState(collapsedState))}}
                />
                {Props.cells.map((cell, i) => (
                    <ExpandingHeatmapTableCell
                        key={cell.id}
                        id={cell.id}
                        link={cell.link}
                        text={cell.text}
                        selected={cell.id === Props.selectedCellId}
                        rotate={cell.rotate}
                        borderRight={cell.borderRight}
                        borderTop={cell.borderTop}
                        selectable={cell.selectable}
                        spacer={cell.spacer}
                        idToExpandOnClick={cell.idToExpandOnClick}
                        cellWrap={cell.cellWrap}
                        color={cell.color}
                        bgcolor={cell.bgcolor}
                        textAlign={cell.textAlign}
                        hideContent={collapsedState === "Expanded" && i !== 0}
                        handleCellSelected={Props.cellSelectionHandler}
                    />
                ))}
            </tr>
            {
                collapsedState === "Expanded" && Props.subrows.map(row => (
                    <ExpandingHeatmapTableRow
                        id={row.id}
                        cells={row.cells}
                        subrows={row.subrows}
                        selectedCellId={Props.selectedCellId}
                        isSubrow={true}
                        cellSelectionHandler={Props.cellSelectionHandler}
                    />
                ))
            }
            {
                collapsedState === "Expanded" &&
                    <tr key={"expanded-empty-" + Props.id}>
                        <td>&nbsp;</td>
                    </tr>
            }
        </React.Fragment>
    )
}

export default ExpandingHeatmapTableRow
