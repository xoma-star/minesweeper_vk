import getRandomFromInterval from "../../../common/functions/getRandomFromInterval";
import CellSchema from "../../../schemas/cell.schema";

const generateField = (exclude: number) => {
    const cells: CellSchema[] = []
    const bombs = getRandomFromInterval(0, 256, 40, [exclude])
    for(let i = 0; i < 256; i++) {
        // начиная от левого верхнего угла
        const bombsNear = [
            i % 16 !== 0 ? i - 17 : -1,
            i - 16,
            (i + 1) % 16 !== 0 ? i - 15 : -1,
            (i + 1) % 16 !== 0 ? i + 1 : -1,
            (i + 1) % 16 !== 0 ? i + 17 : -1,
            i + 16,
            i % 16 !== 0 ? i + 15 : -1,
            i % 16 !== 0 ? i - 1 : -1
        ].reduce((a, b) => {
            if (bombs.indexOf(b) > -1) return a + 1
            return a
        }, 0)

        cells.push({
            hasBomb: bombs.indexOf(i) > -1,
            bombsNear,
            revealed: false,
            marked: false
        })
    }

    return cells
}

export default generateField