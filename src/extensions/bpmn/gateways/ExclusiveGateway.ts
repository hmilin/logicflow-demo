import type { GraphModel } from '@logicflow/core'
import { RectNodeModel } from '@logicflow/core'
import { getBpmnId } from '../../bpmnIds'
import BaseNodeDecorator from '../base/BpmnBaseNode'
import BaseCardView from '../card/BaseCardView'
import { StepTypes, nodeIDPrefixs, nodeSize } from '../constant'

/**
 * 获取锚点坐标位置
 * @param {number} x 节点中心X坐标
 * @param {number} y 节点中心Y坐标
 * @param {number} width 节点中心宽度
 */
export const getGatewayAnchor = (
  x: number,
  y: number,
  width: number,
  height: number,
  id: string,
) => {
  return [
    {
      x: Math.round(x - width / 2),
      y,
      id: `${id}_left`,
    },
    {
      x: Math.round(x + width / 2),
      y: Math.round(y - height / 6),
      id: `${id}_true`,
      text: 'true',
    },
    {
      x: Math.round(x + width / 2),
      y: Math.round(y + height / 6),
      id: `${id}_false`,
      text: 'false',
    },
  ]
}

/** 条件判断节点 */
@BaseNodeDecorator()
class ExclusiveGatewayModel extends RectNodeModel {
  static extendKey = 'ExclusiveGatewayModel'
  constructor(data: any, graphModel: GraphModel) {
    if (!data.id) {
      data.id = `${nodeIDPrefixs[StepTypes.ExclusiveGateway]}_${getBpmnId()}`
    }
    if (!data.text) {
      data.text = ''
    }
    super(data, graphModel)

    this.setIsShowAnchor()
  }
  setAttributes() {
    this.width = nodeSize[StepTypes.ExclusiveGateway].width
    this.height = nodeSize[StepTypes.ExclusiveGateway].height
  }

  getDefaultAnchor() {
    const { width, height, x, y, id } = this
    return getGatewayAnchor(x, y, width, height, id)
  }
}

class ExclusiveGatewayView extends BaseCardView {
  static extendKey = 'ExclusiveGatewayNode'

  setHtml(rootEl: HTMLElement) {
    super.setHtml(rootEl)
    const fragment = document.createDocumentFragment()
    rootEl.style.position = 'relactive'
    rootEl.style.overflow = 'visible'
    const { x, y, width, height } = this.props.model
    this.props.model.anchors.forEach((anchor) => {
      const anchorTextDom = document.createElement('span')
      anchorTextDom.style.color = 'rgba(0, 0, 0, 0.65)'
      anchorTextDom.style.position = 'absolute'
      anchorTextDom.style.left = `${Math.round(anchor.x - x + width / 2 + 4)}px`
      anchorTextDom.style.top = `${Math.round(anchor.y - y + height / 2 - 8)}px`
      if (anchor.text) {
        anchorTextDom.append(anchor.text as string)
        fragment.appendChild(anchorTextDom)
      }
    })
    rootEl.appendChild(fragment)
  }
}

const ExclusiveGateway = {
  type: StepTypes.ExclusiveGateway,
  view: ExclusiveGatewayView,
  model: ExclusiveGatewayModel,
}

export { ExclusiveGatewayModel, ExclusiveGatewayView }
export default ExclusiveGateway
