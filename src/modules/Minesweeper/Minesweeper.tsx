import React, {useEffect, useRef, useState} from 'react';
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
    const [smileScared, setSmileScared] = useState(false)

    const bombsLeft = 40 - cells.filter(x => x.marked === 'flag').length

    useEffect(() => {
        const x = setInterval(() => {
            if(gameStatus === 'started') setTimer(x => Math.min(x + 1, 999))
            else clearInterval(x)
        }, 1000)
        if(gameStatus === 'notStarted') {
            setTimer(0)
        }
        return () => clearInterval(x)
    }, [gameStatus])

    const restart = () => {
        setGameStatus('notStarted')
        setCells(generateField(-1))
    }
    const clickStartHandler = () => {
        if((gameStatus === 'notStarted' || gameStatus === 'started') && !smileScared) setSmileScared(true)
    }
    const clickEndHandler = (i: number, button: 'left' | 'right') => {
        if(gameStatus === 'ended' || gameStatus === 'won') return
        if(smileScared) setSmileScared(false)
        if(gameStatus === 'notStarted') setGameStatus('started')
        if(i === -1) return
        let newCells = [...cells]
        if(button === 'left') {
            if(newCells[i].marked) return;
            if(cells.filter(x => x.revealed).length < 1) {
                if(cells[i].hasBomb) {
                    newCells[i].hasBomb = false
                    while (true) {
                        const rand = Math.floor(Math.random() * 256)
                        if(!newCells[rand].hasBomb) {
                            newCells[rand].hasBomb = true
                            break
                        }
                    }
                }
            }
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
                        if(
                            i - 1 >= Math.floor(i / 16) * 16 &&
                            !newCells[i - 1].revealed &&
                            !newCells[i - 1].hasBomb &&
                            !newCells[i - 1].marked &&
                            numbersStack.indexOf(i) < 0
                        )
                        {
                            if(newCells[i - 1].bombsNear > 0) numbersStack.push(i - 1)
                            stack.push(i - 1)
                        }
                        // правая ячейка
                        if(
                            i + 1 <= Math.floor(i / 16) * 16 + 15 &&
                            !newCells[i + 1].revealed &&
                            !newCells[i + 1].hasBomb &&
                            !newCells[i + 1].marked &&
                            numbersStack.indexOf(i) < 0
                        )
                        {
                            if(newCells[i + 1].bombsNear > 0) numbersStack.push(i + 1)
                            stack.push(i + 1)
                        }
                        // верхняя ячейка
                        if(
                            i - 16 >= 0 &&
                            !newCells[i - 16].revealed &&
                            !newCells[i - 16].hasBomb &&
                            !newCells[i - 16].marked &&
                            numbersStack.indexOf(i) < 0
                        )
                        {
                            if(newCells[i - 16].bombsNear > 0) numbersStack.push(i - 16)
                            stack.push(i - 16)
                        }
                        // нижняя ячейка
                        if(
                            i + 16 <= 255 &&
                            !newCells[i + 16].revealed &&
                            !newCells[i + 16].hasBomb &&
                            !newCells[i + 16].marked &&
                            numbersStack.indexOf(i) < 0
                        )
                        {
                            if(newCells[i + 16].bombsNear > 0) numbersStack.push(i + 16)
                            stack.push(i + 16)
                        }
                        // левая верхняя ячейка
                        if(
                            i - 17 >= Math.floor(i / 16 - 1) * 16 &&
                            i - 17 >= 0 &&
                            !newCells[i - 17].revealed &&
                            !newCells[i - 17].hasBomb &&
                            !newCells[i - 17].marked &&
                            numbersStack.indexOf(i) < 0
                        )
                        {
                            if(newCells[i - 17].bombsNear > 0) numbersStack.push(i - 17)
                            stack.push(i - 17)
                        }
                        // левая правая ячейка
                        if(
                            i - 15 <= Math.floor(i / 16 - 1) * 16 + 15 &&
                            i - 15 >= 0 &&
                            !newCells[i - 15].revealed &&
                            !newCells[i - 15].hasBomb &&
                            !newCells[i - 15].marked &&
                            numbersStack.indexOf(i) < 0
                        )
                        {
                            if(newCells[i - 15].bombsNear > 0) numbersStack.push(i - 15)
                            stack.push(i - 15)
                        }
                        // нижняя левая ячейка
                        if(
                            i + 15 >= Math.floor(i / 16 + 1) * 16 &&
                            i + 15 <= 255 &&
                            !newCells[i + 15].revealed &&
                            !newCells[i + 15].hasBomb &&
                            !newCells[i + 15].marked &&
                            numbersStack.indexOf(i) < 0
                        )
                        {
                            if(newCells[i + 15].bombsNear > 0) numbersStack.push(i + 15)
                            stack.push(i + 15)
                        }
                        // нижняя правая
                        if(
                            i + 17 <= Math.floor(i / 16 + 1) * 16 + 15 &&
                            i + 17 <= 255 &&
                            !newCells[i + 17].revealed &&
                            !newCells[i + 17].hasBomb &&
                            !newCells[i + 17].marked &&
                            numbersStack.indexOf(i) < 0
                        )
                        {
                            if(newCells[i + 17].bombsNear > 0) numbersStack.push(i + 17)
                            stack.push(i + 17)
                        }
                        // console.log(i)
                    }
                    numbersStack.forEach(i => newCells[i].revealed = true)
                }
            }
            if(newCells.filter(x => x.revealed).length >= 256 - 40) setGameStatus("won")
        } else {
            if(bombsLeft <= 0) return;
            if(newCells[i].revealed) return;
            if(newCells[i].marked === false) newCells[i].marked = 'flag'
            else if(newCells[i].marked === 'flag') newCells[i].marked = 'question'
            else newCells[i].marked = false
        }
        setCells(newCells)
    }

    return (
        <div className={'window bordered popped'} onMouseLeave={() => clickEndHandler(-1, 'left')}>
            <HeaderBar status={smileScared ? 'scared' : gameStatus} bombsLeft={bombsLeft} timer={timer} onSmileClick={restart}/>
            <MineField cells={cells} onClickStart={clickStartHandler} onClickEnd={clickEndHandler}/>
        </div>
    );
};

export default Minesweeper;