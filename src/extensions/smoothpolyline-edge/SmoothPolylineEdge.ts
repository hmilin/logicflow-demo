import type { GraphModel } from '@logicflow/core'
import { PolylineEdge, PolylineEdgeModel } from '@logicflow/core'
import { getSmoothPolylineShape } from './basic-shape'

/** 转折点平滑的折线 */
class SmoothPolylineEdgeModel extends PolylineEdgeModel {
  static extendKey = 'smoothPolyline'
  /** 圆弧部分的长度，当borderRadius为0时，路径和PolylineEdge一致 */
  borderRadius = 8
  constructor(data: any, graphModel: GraphModel) {
    super(data, graphModel)
  }
}

class SmoothPolylineEdgeView extends PolylineEdge {
  constructor() {
    super()
  }
  getEdge() {
    const { model } = this.props
    const { pointsList, points, borderRadius, isAnimation, arrowConfig } = model

    const style = model.getEdgeStyle()
    const animationStyle = model.getEdgeAnimationStyle()
    const {
      strokeDasharray,
      stroke,
      strokeDashoffset,
      animationName,
      animationDuration,
      animationIterationCount,
      animationTimingFunction,
      animationDirection,
    } = animationStyle

    return getSmoothPolylineShape({
      pointsList,
      points,
      borderRadius,
      ...style,
      ...arrowConfig,
      ...(isAnimation
        ? {
            strokeDasharray,
            stroke,
            style: {
              strokeDashoffset,
              animationName,
              animationDuration,
              animationIterationCount,
              animationTimingFunction,
              animationDirection,
            },
          }
        : {}),
    })
  }
}

const SmoothPolylineEdge = {
  type: SmoothPolylineEdgeModel.extendKey,
  view: SmoothPolylineEdgeView,
  model: SmoothPolylineEdgeModel,
}

export { SmoothPolylineEdgeModel, SmoothPolylineEdgeView }
export default SmoothPolylineEdge
