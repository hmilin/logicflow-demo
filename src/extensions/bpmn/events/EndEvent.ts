import type { GraphModel} from '@logicflow/core';
import { RectNodeModel } from '@logicflow/core'
import { getBpmnId } from '../../bpmnIds'
import BaseNodeDecorator from '../base/BpmnBaseNode'
import BaseCardView from '../card/BaseCardView'
import { StepTypes, nodeIDPrefixs, nodeSize } from '../constant'

/** 结束节点，在规范基础上新增了调试结果展示的UI */
@BaseNodeDecorator()
class EndEventModel extends RectNodeModel {
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

  getDefaultAnchor() {
    const { x, y, width, id } = this
    return [
      {
        // x 轴上偏移 size / 2
        x: x - width / 2 - 4,
        y,
        id: `${id}_left`,
      },
    ]
  }

  setAttributes() {
    this.width = nodeSize[StepTypes.End].width
    this.height = nodeSize[StepTypes.End].height
  }
}

class EndEventView extends BaseCardView {
  static extendKey = 'EndEventView'
}

const EndEvent = {
  type: StepTypes.End,
  view: EndEventView,
  model: EndEventModel,
}

export { EndEventModel, EndEventView }
export default EndEvent
