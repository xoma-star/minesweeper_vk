import React, {useState} from 'react';
import './Cell.css'
import CellSchema from "../../../schemas/cell.schema";

interface props {
    cellData: CellSchema,
    onMouseDown(): void,
    onMouseUp(): void
}

const Cell = ({cellData, onMouseDown, onMouseUp}: props) => {
    let cellStatus = 'default'
    if(cellData.revealed) {
        cellStatus = 'revealed-empty'
        if(cellData.bombsNear > 0) cellStatus = 'revealed-number'
        if(cellData.hasBomb) cellStatus = 'revealed-bomb'
        if(cellData.marked === "bomb") cellStatus = 'revealed-bomb-red'
    }


    return (
        <div
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            className={`cell cell-${cellStatus}`}
            style={{'--left': `${-(cellData.bombsNear - 1) * 17}px`} as React.CSSProperties}
        />
    );
};

export default Cell;