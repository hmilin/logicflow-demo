import type { GraphModel } from '@logicflow/core'
import { RectNodeModel } from '@logicflow/core'
import { getBpmnId } from '../../bpmnIds'
import BaseNodeDecorator from '../base/BpmnBaseNode'
import BaseCardView from '../card/BaseCardView'
import { StepTypes, nodeIDPrefixs, nodeSize } from '../constant'

/** api调用节点 */
@BaseNodeDecorator()
class ServiceTaskModel extends RectNodeModel {
  static extendKey = 'ServiceTaskModel'
  constructor(data: any, graphModel: GraphModel) {
    if (!data.id) {
      data.id = `${nodeIDPrefixs[StepTypes.ServiceTask]}_${getBpmnId()}`
    }
    super(data, graphModel)
    this.setIsShowAnchor()
  }

  setAttributes() {
    this.width = nodeSize[StepTypes.ServiceTask].width
    this.height = nodeSize[StepTypes.ServiceTask].height
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

class ServiceTaskView extends BaseCardView {
  static extendKey = 'ServiceTaskNode'
}

const ServiceTask = {
  type: StepTypes.ServiceTask,
  view: ServiceTaskView,
  model: ServiceTaskModel,
}

export { ServiceTaskModel, ServiceTaskView }
export default ServiceTask
