import type { GraphModel } from '@logicflow/core'
import { RectNodeModel } from '@logicflow/core'
import { getBpmnId } from '../../bpmnIds'
import BaseNodeDecorator from '../base/BpmnBaseNode'
import BaseCardView from '../card/BaseCardView'
import { StepTypes, nodeIDPrefixs, nodeSize } from '../constant'

/** 数据处理节点 */
@BaseNodeDecorator()
class ScriptTaskModel extends RectNodeModel {
  static extendKey = 'ServiceTaskModel'
  constructor(data: any, graphModel: GraphModel) {
    if (!data.id) {
      data.id = `${nodeIDPrefixs[StepTypes.ScriptTask]}_${getBpmnId()}`
    }
    super(data, graphModel)
    this.setIsShowAnchor()
  }

  setAttributes() {
    this.width = nodeSize[StepTypes.ScriptTask].width
    this.height = nodeSize[StepTypes.ScriptTask].height
  }

  getDefaultAnchor() {
    const { x, y, width, id } = this
    return [
      {
        // x 轴上偏移 size / 2
        x: x - width / 2 - 8,
        y,
        id: `${id}_left`,
      },
      {
        // x 轴上偏移 size / 2
        x: x + width / 2 + 8,
        y,
        id: `${id}_right`,
      },
    ]
  }
}

class ScriptTaskView extends BaseCardView {
  static extendKey = 'ServiceTaskNode'
}

const ScriptTask = {
  type: StepTypes.ScriptTask,
  view: ScriptTaskView,
  model: ScriptTaskModel,
}

export { ScriptTaskView, ScriptTaskModel }
export default ScriptTask
