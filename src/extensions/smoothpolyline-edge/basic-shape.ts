import { h } from '@logicflow/core'

interface Point {
  x: number
  y: number
}

interface Props {
  points: string
  pointsList: Point[]
  borderRadius: number
  [key: string]: any
}

export function getSmoothPolylineShape({ pointsList, points, borderRadius, ...oth }: Props) {
  if (pointsList.length <= 2) {
    return h('polyline', {
      points,
      ...oth,
    })
  }
  const newPoints = getSmoothPolylinePoints(pointsList, borderRadius)

  return h(
    'g',
    {},
    h('path', {
      d: getSmoothPath(newPoints),
      fill: 'none',
      ...oth,
    }),
  )
}

interface SmoothPoint {
  start: Point
  end: Point
  // 只有曲线有控制点
  control?: Point
}
/** 获取每一个线段的起点 终点 和 控制点 */
export function getSmoothPolylinePoints(pointList: Point[], borderRadius: number) {
  let i = 1
  const result: SmoothPoint[] = [
    {
      start: pointList[0],
      end: pointList[1],
    },
  ]
  // 除了起点和终点，每个点需要变成两个点，造出一段曲线
  while (i < pointList.length - 1) {
    const start = movePointBTowardsPointA(pointList[i - 1], pointList[i], borderRadius)
    const end = movePointBTowardsPointA(pointList[i + 1], pointList[i], borderRadius)

    // 修改上一段直线的终点
    result[result.length - 1].end = { ...start }

    result.push(
      ...[
        {
          start,
          end,
          control: pointList[i],
        },
        {
          start: end,
          end: pointList[i + 1],
        },
      ],
    )

    i++
  }
  return result
}

function movePointBTowardsPointA(pointA: Point, pointB: Point, offset: number): Point {
  // 计算从点B到点A的向量
  const vectorAB = {
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y,
  }

  // 计算向量AB的长度
  const distanceAB = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y)

  // 根据偏移量将点B向点A移动 如果offset小于长度的一半，只移动一半的距离，防止曲线重叠
  const scaleFactor = Math.min(offset, distanceAB / 2) / distanceAB
  const movedPointB = {
    x: pointB.x + vectorAB.x * scaleFactor,
    y: pointB.y + vectorAB.y * scaleFactor,
  }

  return movedPointB
}

function getSmoothPath(points: SmoothPoint[]) {
  const { start } = points[0]
  let path = `M ${start.x} ${start.y}`
  let i = 0
  while (i < points.length) {
    const { end, control } = points[i]

    path += (control ? ` Q ${control.x} ${control.y} ` : ' L') + ` ${end.x} ${end.y}`
    i++
  }
  return path
}
