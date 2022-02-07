import React, { FunctionComponent, useState } from "react";
import { CellType } from './ExpandingHeatmapTableCell';
import ExpandingHeatmapTableRow, { ExpandingHeatmapTableRowType } from "./ExpandingHeatmapTableRow";

interface MyProps {
    header: ExpandingHeatmapTableRowType,
    rows: ExpandingHeatmapTableRowType[],
    onCellSelected: (cell: CellType) => void
}

const ExpandingHeatmapTable: FunctionComponent<MyProps> = (Props: MyProps) => {
    const [selectedCellId, setSelectedCellId] = useState<string>("")
    const handleCellSelected = (cell: CellType): void => {
        if (!cell.selectable) return
        setSelectedCellId(cell.id)
        Props.onCellSelected(cell)
    }
    
    return (
        <div className="expandingheatmaptable-container">
            <table className="expandingheatmaptable">
                <thead key="head">
                    <ExpandingHeatmapTableRow
                        id={Props.header.id}
                        cells={Props.header.cells}
                        subrows={Props.header.subrows}
                        selectedCellId={selectedCellId}
                        isSubrow={false}
                        cellSelectionHandler={handleCellSelected}
                    />
                </thead>
                <tbody key="body">
                    {Props.rows.map((row) => {
                        return (<ExpandingHeatmapTableRow
                            key={row.id}
                            id={row.id}
                            cells={row.cells}
                            subrows={row.subrows}
                            selectedCellId={selectedCellId}
                            isSubrow={false}
                            cellSelectionHandler={handleCellSelected}
                        />)
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ExpandingHeatmapTable;
