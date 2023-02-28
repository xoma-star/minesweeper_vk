import React, {useState} from 'react';
import './Minesweeper.css';
import HeaderBar from "../../widgets/HeaderBar/HeaderBar";
import MineField from "../../widgets/MineField/MineField";
import CellSchema from "../../schemas/cell.schema";
import generateField from "../../widgets/MineField/functions/generateField";
import GameStatusSchema from "../../schemas/gameStatus.schema";

const Minesweeper = () => {
    const [cells, setCells] = useState<CellSchema[]>(generateField(-1))
    const [gameStatus, setGameStatus] = useState<GameStatusSchema>('notStarted')
    const [timer, setTimer] = useState(0)

    const bombsLeft = 40 - cells.filter(x => x.marked === 'flag').length

    const restart = () => {
        setGameStatus('notStarted')
        setCells(generateField(-1))
    }
    const clickStartHandler = () => {
        if(gameStatus === 'notStarted' || gameStatus === 'started') setGameStatus('scared')
    }
    const clickEndHandler = (i: number) => {
        if(gameStatus === 'ended' || gameStatus === 'won') return
        if(gameStatus === 'scared') setGameStatus('started')
        if(i === -1) return
        if(cells.filter(x => x.revealed).length < 1) {
            if(cells[i].hasBomb) setCells(generateField(i))
        }
        let newCells = [...cells]
        newCells[i].revealed = true
        if(newCells[i].hasBomb) {
            setGameStatus('ended')
            newCells[i].marked = 'bomb'
            newCells = newCells.map(x => {
                if (x.hasBomb) return {...x, revealed: true}
                return x
            })
        } else {
            if(newCells[i].bombsNear > 0) {
                newCells[i].revealed = true
            }
            else {
                let stack = [i]
                let numbersStack: number[] = []
                // надо было делать через двумерный массив :D
                while (stack.length > 0) {
                    let i = stack.pop()
                    if(typeof i === 'undefined') break
                    newCells[i].revealed = true
                    // левая ячейка
                    if(i - 1 >= Math.floor(i / 16) * 16 && !newCells[i - 1].revealed && !newCells[i - 1].hasBomb && numbersStack.indexOf(i) < 0) {
                        if(newCells[i - 1].bombsNear > 0) numbersStack.push(i - 1)
                        stack.push(i - 1)
                    }
                    // правая ячейка
                    if(i + 1 <= Math.floor(i / 16) * 16 + 15 && !newCells[i + 1].revealed && !newCells[i + 1].hasBomb && numbersStack.indexOf(i) < 0) {
                        if(newCells[i + 1].bombsNear > 0) numbersStack.push(i + 1)
                        stack.push(i + 1)
                    }
                    // верхняя ячейка
                    if(i - 16 >= 0 && !newCells[i - 16].revealed && !newCells[i - 16].hasBomb && numbersStack.indexOf(i) < 0) {
                        if(newCells[i - 16].bombsNear > 0) numbersStack.push(i - 16)
                        stack.push(i - 16)
                    }
                    // нижняя ячейка
                    if(i + 16 <= 255 && !newCells[i + 16].revealed && !newCells[i + 16].hasBomb && numbersStack.indexOf(i) < 0) {
                        if(newCells[i + 16].bombsNear > 0) numbersStack.push(i + 16)
                        stack.push(i + 16)
                    }
                    // левая верхняя ячейка
                    if(i - 17 >= Math.floor(i / 16 - 1) * 16 && i - 17 >= 0 && !newCells[i - 17].revealed && !newCells[i - 17].hasBomb && numbersStack.indexOf(i) < 0) {
                        if(newCells[i - 17].bombsNear > 0) numbersStack.push(i - 17)
                        stack.push(i - 17)
                    }
                    // левая правая ячейка
                    if(i - 15 <= Math.floor(i / 16 - 1) * 16 + 15 && i - 15 >= 0 && !newCells[i - 15].revealed && !newCells[i - 15].hasBomb && numbersStack.indexOf(i) < 0) {
                        if(newCells[i - 15].bombsNear > 0) numbersStack.push(i - 15)
                        stack.push(i - 15)
                    }
                    // нижняя левая ячейка
                    if(i + 15 >= Math.floor(i / 16 + 1) * 16 && i + 15 <= 255 && !newCells[i + 15].revealed && !newCells[i + 15].hasBomb && numbersStack.indexOf(i) < 0) {
                        if(newCells[i + 15].bombsNear > 0) numbersStack.push(i + 15)
                        stack.push(i + 15)
                    }
                    // нижняя правая
                    if(i + 17 <= Math.floor(i / 16 + 1) * 16 + 15 && i + 17 <= 255 && !newCells[i + 17].revealed && !newCells[i + 17].hasBomb && numbersStack.indexOf(i) < 0) {
                        if(newCells[i + 17].bombsNear > 0) numbersStack.push(i + 17)
                        stack.push(i + 17)
                    }
                    // console.log(i)
                }
                numbersStack.forEach(i => newCells[i].revealed = true)
            }
        }
        setCells(newCells)
    }

    return (
        <div className={'window bordered popped'} onMouseLeave={() => clickEndHandler(-1)}>
            <HeaderBar status={gameStatus} bombsLeft={bombsLeft} timer={timer} onSmileClick={restart}/>
            <MineField cells={cells} onClickStart={clickStartHandler} onClickEnd={clickEndHandler}/>
        </div>
    );
};

export default Minesweeper;