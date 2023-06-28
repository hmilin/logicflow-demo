import type { AnchorConfig, BaseNodeModel, ConnectRule } from '@logicflow/core'

interface BaseNodeDecoratorProps {
  /** default true */
  isShowAnchor?: boolean
}

/** 一个类装饰器，定义所有节点的共同属性 */
export default function BaseNodeDecorator(props: BaseNodeDecoratorProps = {}) {
  const properties = { isShowAnchor: true, ...props }

  return function <T extends { new (...args: any[]): BaseNodeModel }>(constructor: T) {
    return class extends constructor {
      initNodeData(data: any) {
        super.initNodeData(data)
      }
      setIsShowAnchor() {
        /** 锚点常显 */
        this.isShowAnchor = properties.isShowAnchor
      }
      getConnectedSourceRules(): ConnectRule[] {
        const rules = super.getConnectedSourceRules()
        // 自己不能连自己
        rules.push({
          message: '',
          validate(source?, target?) {
            return source?.id !== target?.id
          },
        })
        rules.push({
          message: '左连接点只能作为终点',
          validate(source?, target?, sourceAnchor?) {
            return !isLeftAnchor(sourceAnchor?.id)
          },
        })
        // 限制一个右锚点只能出一条线
        rules.push({
          message: '一个连接点只能有一条连线',
          validate: (source, target, sourceAnchor?: AnchorConfig) => {
            return this.graphModel.edges.find((edge) => edge.sourceAnchorId === sourceAnchor?.id)
              ? false
              : true
          },
        })
        return rules
      }
      getConnectedTargetRules(): ConnectRule[] {
        const rules = super.getConnectedTargetRules()
        rules.push({
          message: '右连接点只能作为起点',
          validate(source?, target?, sourceAnchor?, targetAnchor?) {
            return isLeftAnchor(targetAnchor?.id)
          },
        })
        // 限制一个左锚点只能入一条线
        rules.push({
          message: '一个连接点只能有一条连线',
          validate: (source, target, sourceAnchor?: AnchorConfig, targetAnchor?: AnchorConfig) => {
            return this.graphModel.edges.find((edge) => edge.targetAnchorId === targetAnchor?.id)
              ? false
              : true
          },
        })
        return rules
      }
    }
  }
}

function isLeftAnchor(id?: string) {
  return id?.endsWith('left') ?? false
}
