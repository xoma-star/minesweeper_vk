import React, {useState} from 'react';
import './Cell.css'
import CellSchema from "../../../schemas/cell.schema";

interface props {
    cellData: CellSchema,
    onMouseDown(): void,
    onMouseUp(s: 'left' | 'right'): void
}

const Cell = ({cellData, onMouseDown, onMouseUp}: props) => {
    let cellStatus = 'default'
    if(cellData.marked) {
        if(cellData.marked === "flag") cellStatus = 'marked-flag'
        if(cellData.marked === 'question') cellStatus = 'marked-question'
    }
    if(cellData.revealed) {
        cellStatus = 'revealed-empty'
        if(cellData.bombsNear > 0) cellStatus = 'revealed-number'
        if(cellData.hasBomb) cellStatus = 'revealed-bomb'
        if(cellData.marked === "bomb") cellStatus = 'revealed-bomb-red'
        if(cellData.marked === 'flag' && cellData.hasBomb) cellStatus = 'revealed-bomb-cross'
    }


    return (
        <div
            onMouseDown={onMouseDown}
            onMouseUp={(e) => onMouseUp(e.button === 0 ? 'left' : 'right')}
            className={`cell cell-${cellStatus}`}
            style={{'--left': `${-(cellData.bombsNear - 1) * 17}px`} as React.CSSProperties}
        />
    );
};

export default Cell;