import type { GraphModel } from '@logicflow/core'
import { RectNodeModel } from '@logicflow/core'
import { getBpmnId } from '../../bpmnIds'
import BaseNodeDecorator from '../base/BpmnBaseNode'
import BaseCardView from '../card/BaseCardView'
import { StepTypes, nodeIDPrefixs, nodeSize } from '../constant'

/** api调用节点 */
@BaseNodeDecorator()
class UserTaskModel extends RectNodeModel {
  static extendKey = 'UserTaskModel'
  constructor(data: any, graphModel: GraphModel) {
    if (!data.id) {
      data.id = `${nodeIDPrefixs[StepTypes.UserTask]}_${getBpmnId()}`
    }
    super(data, graphModel)
    this.setIsShowAnchor()
  }

  setAttributes() {
    this.width = nodeSize[StepTypes.UserTask].width
    this.height = nodeSize[StepTypes.UserTask].height
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
      {
        // x 轴上偏移 size / 2
        x: x + width / 2,
        y,
        id: `${id}_right`,
      },
    ]
  }
}

class UserTaskView extends BaseCardView {
  static extendKey = 'UserTaskNode'
}

const UserTask = {
  type: StepTypes.UserTask,
  view: UserTaskView,
  model: UserTaskModel,
}

export { UserTaskModel, UserTaskView }
export default UserTask
