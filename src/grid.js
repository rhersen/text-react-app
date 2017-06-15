const margin = 0
const w = 64
const xMax = margin + w + margin + w + margin
const xHalf = (xMax - w) / 2
const x1 = margin
const x2 = xHalf - x1
const xMid = (x1 + x2) / 2
const y1 = margin + w + margin
const y2 = margin + w + margin + w

export function leftTriangle() {
    return `${xMid},${y1} ${x2},${y2} ${x1},${y2}`
}

export function rightTriangle() {
    return `${xMax - xMid},${y2} ${xMax - x2},${y1} ${xMax - x1},${y1}`
}