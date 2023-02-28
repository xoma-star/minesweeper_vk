import React from 'react';
import './MineField.css'
import CellSchema from "../../schemas/cell.schema";
import Cell from "../../common/ui/Cell/Cell";

interface props {
    cells: CellSchema[],
    onClickStart(): void,
    onClickEnd(i: number): void
}

const MineField = ({cells, onClickEnd, onClickStart}: props) => {
    return (
        <div className={'mine-field bordered pushed'}>
            {/*здесь я использовал i в качестве key, т.к. нет операций ведущих к структурным изменениям массива*/}
            {cells.map((x, i) => <Cell cellData={x} onMouseUp={() => onClickEnd(i)} onMouseDown={onClickStart} key={`c${i}`}/>)}
        </div>
    );
};

export default MineField;