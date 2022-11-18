const colorMap = {
    R: "red",
    G: "green",
    B: "blue",
    P: "purple",
    Y: "yellow",
    w: "white",
    b: "black",
    g: "grey"
}
const reverseColorMap = {
    "red": "R",
    "green": "G",
    "blue": "B",
    "white": "w",
    "black": "b",
    "grey": "g",
    "purple": "P",
    "yellow": "Y",
}
const shuffleArr = arr => {
    var i = arr.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
}
class MarkovJnr {
    constructor(rules = []) {
        this.rules = rules
        this.cellMap = undefined
    }

    getNeighbors(i, j, dir = null) {
        if (dir == null) {
            return [
                [i, j + 1, 0],
                [i + 1, j, 1],
                [i, j - 1, 2],
                [i - 1, j, 3],
            ]
        }
        else {
            switch (dir) {
                case 0:
                    return [[i, j + 1]]
                case 1:
                    return [[i + 1, j]]
                case 2:
                    return [[i, j - 1]]
                case 3:
                    return [[i - 1, j]]
                default:
                    return undefined
            }
        }
    }
    match(rule, cells, i, j, path = [], curr = "", dir = null) {
        if (path.length == rule[0].length) return undefined
        const cellColor = reverseColorMap[cells[i][j].color]
        if (cellColor != rule[0][path.length]) return undefined
        curr += cellColor
        path.push([i, j])
        if (curr == rule[0]) return path
        const neighbors = this.getNeighbors(i, j, dir).filter(([x, y]) => x >= 0 && y >= 0 && x < cells.length && y < cells[0].length)
        if (dir == null) shuffleArr(neighbors)
        const pathString = path.map(arr => arr.join(',')).join(' ')
        for (const n of neighbors) {
            if (pathString.includes(n.join(','))) continue
            const m = this.match(rule, cells, n[0], n[1], path.slice(0), `${curr}`, n[2])
            if (m !== undefined) return m
        }
        return undefined
    }
    // match(rule, cells, i, j, path = [], curr = "") {
    //     if (path.length == rule[0].length) return undefined
    //     let results = []
    //     curr += reverseColorMap[cells[i][j].color]
    //     path.push([i, j])
    //     if (curr == rule[0]) return [path]
    //     const neighbors = this.getNeighbors(i, j).filter(([x, y]) => x >= 0 && y >= 0 && x < cells.length && y < cells[0].length)
    //     const pathString = path.map(arr => arr.join(',')).join(' ')
    //     for (const n of neighbors) {
    //         if (pathString.includes(n.join(','))) continue
    //         const m = this.match(rule, cells, n[0], n[1], path.slice(0), `${curr}`)
    //         if (m !== undefined) results = [...results, ...m]
    //     }
    //     return results
    // }
    transform(path, rule, cells) {
        for (let i = 0; i < path.length; i++) {
            const [x, y] = path[i]
            cells[x][y].color = colorMap[rule[1][i]]
        }
    }
    update(cells) {
        const w = cells.length
        const h = cells[0].length
        const cellCoords = []
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                cellCoords.push({ i, j })
            }
        }
        shuffleArr(cellCoords)
        for (const rule of this.rules) {
            for (const { i, j } of cellCoords) {
                const result = this.match(rule, cells, i, j)
                if (result != undefined) {
                    this.transform(result, rule, cells)
                    return true
                }
            }
        }
        return false
    }
}