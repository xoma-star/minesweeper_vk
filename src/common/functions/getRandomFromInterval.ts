const getRandomFromInterval = (a: number, b: number, count: number, exclude?: number[]) => {
    const arr: number[] = []
    while (arr.length < Math.min(count, Math.abs(b - a))) {
        const random = Math.floor(Math.random() * (b - a + 1)) + a
        if(arr.indexOf(random) < 0 && (exclude?.indexOf(random) || 0) < 0) arr.push(random)
    }

    return arr
}

export default getRandomFromInterval