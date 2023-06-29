import type { GraphModel } from '@logicflow/core'
import { CircleNode, CircleNodeModel, h } from '@logicflow/core'
import { getBpmnId } from '../../bpmnIds'
import BaseNodeDecorator from '../base/BpmnBaseNode'
import { StepTypes, nodeIDPrefixs, nodeSize } from '../constant'

const radius = nodeSize[StepTypes.End].width / 2
/** 结束节点，在规范基础上新增了调试结果展示的UI */
@BaseNodeDecorator()
class EndEventModel extends CircleNodeModel {
  static extendKey = 'EndEventModel'
  constructor(data: any, graphModel: GraphModel) {
    if (!data.id) {
      data.id = `${nodeIDPrefixs[StepTypes.End]}_${getBpmnId()}`
    }
    super(data, graphModel)
    this.setIsShowAnchor()
  }

  getConnectedSourceRules() {
    const rules = super.getConnectedSourceRules()
    const notAsSource = {
      message: '结束节点不能作为连线的起点',
      validate: () => false,
    }
    rules.push(notAsSource)
    return rules
  }

  setAttributes() {
    this.r = radius
  }

  getDefaultAnchor() {
    const { x, y, width, id } = this
    return [
      {
        // x 轴上偏移 size / 2
        x: x - width / 2,
        y,
        id: `${id}_left`,
      },
    ]
  }
}

class EndEventView extends CircleNode {
  static extendKey = 'EndEventView'
  getShape() {
    const model = this.props.model
    const { x, y } = model
    const { strokeWidth, fill } = model.getNodeStyle()

    const Icon = h(
      'svg',
      {
        x: x - 60 / 2 + 18,
        y: y - 60 / 2 + 18,
        width: 25,
        height: 25,
        viewBox: '0 0 22 22',
      },
      h('rect', {
        fill: this.props.model.getNodeStyle().stroke,
        width: 20,
        height: 20,
      }),
    )
    return h(
      'g',
      {
        class: 'node-filter',
      },
      [
        h('circle', {
          cx: x,
          cy: y,
          fill,
          stroke: 'rgba(0, 0, 0, 0.15)',
          strokeWidth,
          r: radius,
        }),
        Icon,
      ],
    )
  }
}

const EndEvent = {
  type: StepTypes.End,
  view: EndEventView,
  model: EndEventModel,
}

export { EndEventModel, EndEventView }
export default EndEvent
