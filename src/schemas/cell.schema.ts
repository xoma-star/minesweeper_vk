interface CellSchema {
    hasBomb: boolean,
    revealed: boolean,
    bombsNear: number,
    marked: false | 'flag' | 'question' | 'bomb'
}

export default CellSchema