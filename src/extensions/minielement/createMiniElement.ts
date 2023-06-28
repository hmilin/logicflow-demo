import type { GraphModel } from '@logicflow/core'
import { RectNode, RectNodeModel } from '@logicflow/core'
import type { StepTypes } from '../bpmn/constant'
import { nodeIDPrefixs, nodeSize } from '../bpmn/constant'
import { getBpmnId } from '../bpmnIds'

const createMiniElement = function (type: StepTypes) {
  return {
    type,
    model: class ExclusiveGatewayModel extends RectNodeModel {
      constructor(data: any, graphModel: GraphModel) {
        if (!data.id) {
          data.id = `${nodeIDPrefixs[type]}_${getBpmnId()}`
        }
        if (!data.text) {
          data.text = ''
        }
        super(data, graphModel)

        this.setIsShowAnchor()
      }
      setAttributes() {
        this.width = nodeSize[type].width
        this.height = nodeSize[type].height
      }
    },
    view: class ExclusiveGatewayView extends RectNode {},
  }
}

export default createMiniElement
