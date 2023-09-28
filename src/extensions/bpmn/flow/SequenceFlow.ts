import type { GraphModel } from '@logicflow/core'
import {
  SmoothPolylineEdgeModel,
  SmoothPolylineEdgeView,
} from '~/extensions/smoothpolyline-edge/SmoothPolylineEdge'
import { getBpmnId } from '../../bpmnIds'
import { StepTypes, nodeIDPrefixs } from '../constant'

const strokeDefault = '#D0D0D0'
const strokeActive = '#D1BDFF'

/** 流对象，连线关系 */
class SequenceFlowModel extends SmoothPolylineEdgeModel {
  static extendKey = 'SequenceFlowModel'
  constructor(data: any, graphModel: GraphModel) {
    if (!data.id) {
      data.id = `${nodeIDPrefixs[StepTypes.Flow]}_${getBpmnId()}`
    }
    super(data, graphModel)
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle()
    if (this.isSelected || this.isHovered) {
      style.strokeWidth = 3
      style.stroke = strokeActive
    } else {
      style.strokeWidth = 2
      style.stroke = strokeDefault
    }
    style.cursor = 'pointer'
    return style
  }

  setAttributes() {
    this.isAnimation = true
  }

  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle()
    if (this.isSelected || this.isHovered) {
      style.animationName = 'edge-selected'
      style.stroke = strokeActive
    } else {
      style.animationName = 'edge-blur'
      style.stroke = strokeDefault
    }
    style.strokeDasharray = 'none'
    style.animationDuration = '0.3s'
    style.animationDirection = 'normal'
    style.animationIterationCount = '1'
    return style
  }

  /**
   * 重写此方法，使保存数据是能带上锚点数据。
   */
  getData() {
    const data = super.getData()
    data.sourceAnchorId = this.sourceAnchorId
    data.targetAnchorId = this.targetAnchorId
    return data
  }

  initEdgeData(data: any): void {
    const { x, y } = data.endPoint
    // 终点往左边缩小一点
    data.endPoint = { x: x - 2, y }
    if (data.pointsList) {
      data.pointsList[data.pointsList.length - 1] = data.endPoint
    }
    super.initEdgeData(data)
  }
}

class SequenceFlowView extends SmoothPolylineEdgeView {
  constructor() {
    super()
  }
  getEdge() {
    const edge = super.getEdge()
    return edge
  }
}

const SequenceFlow = {
  type: StepTypes.Flow,
  view: SequenceFlowView,
  model: SequenceFlowModel,
}

export { SequenceFlowModel, SequenceFlowView }
export default SequenceFlow
