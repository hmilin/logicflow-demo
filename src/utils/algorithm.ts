export interface PolyPoint {
  x: number
  y: number
  id?: string
}

/* 两点之间距离 */
export const distance = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.hypot(x1 - x2, y1 - y2)

/**
 * 获取折线中最长的一个线
 * @param pointsList 多个点组成的数组
 */
export const getLongestEdge = (pointsList: PolyPoint[]) => {
  let points: [PolyPoint, PolyPoint]
  if (pointsList.length === 1) {
    points = [pointsList[0], pointsList[0]]
  } else if (pointsList.length >= 2) {
    let point1 = pointsList[0]
    let point2 = pointsList[1]
    let edgeLength = distance(point1.x, point1.y, point2.x, point2.y)
    for (let i = 1; i < pointsList.length - 1; i++) {
      const newPoint1 = pointsList[i]
      const newPoint2 = pointsList[i + 1]
      const newEdgeLength = distance(newPoint1.x, newPoint1.y, newPoint2.x, newPoint2.y)
      if (newEdgeLength > edgeLength) {
        edgeLength = newEdgeLength
        point1 = newPoint1
        point2 = newPoint2
      }
    }
    points = [point1, point2]
  }
  return points
}

/** 获取线的中点 */
export const getEdgeCenter = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
}): [number, number] => {
  const xOffset = Math.abs(targetX - sourceX) / 2
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset

  const yOffset = Math.abs(targetY - sourceY) / 2
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset

  return [centerX, centerY]
}

/** 删除折线多余的点 */
export function shortPolyPoints(pointsList: PolyPoint[]) {
  const prePointsList = [...pointsList]
  // 在多个点在同一条线上，只保留头尾两个点
  const linePoints: PolyPoint[] = []
  // 当前比较线段的斜率
  let slope: number | null = null
  const points: PolyPoint[] = []

  while (prePointsList.length) {
    const target = prePointsList.shift()
    if (!target) continue
    if (!linePoints.length) {
      linePoints.push(target)
    } else {
      // 比较
      let failed = false
      const start = linePoints[0]
      // 每个比较的点都和起始点计算斜率比较
      const currentSlope = getSlope(start.x, start.y, target.x, target.y)
      if (slope === null || currentSlope === slope) {
        slope = currentSlope
        linePoints.push(target)
      } else {
        failed = true
      }
      if (!failed && prePointsList.length) continue
      // 只保留前后两个点
      const startPoint = linePoints.shift()
      startPoint ? points.push(startPoint) : null
      const endPoint = linePoints.pop()
      endPoint ? points.push(endPoint) : null
      linePoints.length = 0
      if (failed) {
        if (prePointsList.length) {
          // 如果后面还有点，把目标节点作为下一个比较对象
          linePoints.push(target)
        } else {
          points.push(target)
        }
      }
      failed = false
      slope = null
    }
  }

  return points
}

export const getSlope = (x1: number, y1: number, x2: number, y2: number) => {
  return (y2 - y1) / (x2 - x1)
}

/** 获取折线中间段 */
export const getCenterSegment = (pointsList: PolyPoint[]) => {
  const center = Math.ceil(pointsList.length / 2 - 1)
  return [pointsList[center], pointsList[center + 1]]
}

/** 获取一段线段的方向 */
export const getSegmentDirection = (pointsList: [PolyPoint, PolyPoint]) => {
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = pointsList
  const slop = getSlope(x1, y1, x2, y2)
  // 斜率等于x轴和线段的夹角的正切值 夹角在-45度和45度之间，则为水平
  return Math.abs(slop) > 1 ? 'vertical' : 'horizontal'
}
