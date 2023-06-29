import type { GraphModel } from '@logicflow/core'
import { h, RectNode, RectNodeModel } from '@logicflow/core'
import { getBpmnId } from '../../bpmnIds'
import BaseNodeDecorator from '../base/BpmnBaseNode'
import { nodeIDPrefixs, nodeSize, StepTypes } from '../constant'

/** 结束节点 */
@BaseNodeDecorator()
class StartEventModel extends RectNodeModel {
  static extendKey = 'StartEventModel'
  constructor(data: any, graphModel: GraphModel) {
    if (!data.id) {
      data.id = `${nodeIDPrefixs[StepTypes.Start]}_${getBpmnId()}`
    }
    if (!data.text) {
      data.text = ''
    }
    // fix: 不能直接全部加，会导致下载后再次上传，位置错误。
    // data.text.y += 40;
    super(data, graphModel)
    this.setIsShowAnchor()
  }

  getConnectedTargetRules() {
    const rules = super.getConnectedTargetRules()
    const notAsTarget = {
      message: '起始节点不能作为连线的终点',
      validate: () => false,
    }
    rules.push(notAsTarget)
    return rules
  }

  setAttributes() {
    this.width = nodeSize[StepTypes.Start].width
    this.height = nodeSize[StepTypes.Start].height
  }

  // 设置自定义锚点
  // 只需要为每个锚点设置相对于节点中心的偏移量
  getDefaultAnchor() {
    const { x, y, width, id } = this
    return [
      {
        // x 轴上偏移 size / 2
        x: x + width / 2,
        y,
        id: `${id}_right`,
      },
    ]
  }

  getNodeStyle() {
    const style = super.getNodeStyle()
    style.filter = 'drop-shadow(16px 16px 10px black)'
    return style
  }
}

class StartEventView extends RectNode {
  static extendKey = 'StartEventNode'

  getLabelShape() {
    const model = this.props.model
    const { x, y, width, height } = model
    const { stroke } = model.getNodeStyle()
    return h(
      'svg',
      {
        x: x - width / 2 + 15,
        y: y - height / 2 + 15,
        width: 30,
        height: 30,
        viewBox: '0 0 21 30',
      },
      h('path', {
        fill: stroke,
        d: 'M0 27.0725V2.92754C0 1.29297 1.85441 0.348658 3.17634 1.31007L19.776 13.3825C20.8742 14.1812 20.8742 15.8188 19.776 16.6175L3.17634 28.6899C1.8544 29.6513 0 28.707 0 27.0725Z',
      }),
    )
  }
  getShape() {
    const model = this.props.model
    const { x, y, width, height } = model
    const { strokeWidth, fill } = model.getNodeStyle()
    // todo: 将basic-shape对外暴露，在这里可以直接用。现在纯手写有点麻烦。
    return h(
      'g',
      {
        class: 'node-filter',
      },
      [
        h('rect', {
          x: x - width / 2,
          y: y - height / 2,
          rx: 8,
          ry: 8,
          fill,
          stroke: 'rgba(0, 0, 0, 0.15)',
          strokeWidth,
          width,
          height,
        }),
        this.getLabelShape(),
      ],
    )
  }
  getStateClassName() {
    const className = super.getStateClassName()
    return `${className} start-node`
  }
}

const StartEvent = {
  type: StepTypes.Start,
  view: StartEventView,
  model: StartEventModel,
}

export { StartEventModel, StartEventView }
export default StartEvent
