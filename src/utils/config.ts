import type LogicFlow from '@logicflow/core'
import type { BaseEdgeModel, Definition } from '@logicflow/core'
import removeIconUrl from '~/assets/img/remove.svg?url'
import { StepTypes } from '~/extensions/bpmn/constant'

// 插件
import { SelectionSelect } from '@logicflow/extension'
import { BpmnElement } from '~/extensions'
import EdgeMenu from '~/extensions/edge-menu'
import Layout from '~/extensions/layout'
import MiniElement from '~/extensions/minielement'
import { MiniMap } from '~/extensions/minimap'

export const nodeModalComponent: Record<string, string> = {
  [StepTypes.ScriptTask]: 'ScriptTask',
  [StepTypes.ServiceTask]: 'ServiceTask',
  [StepTypes.ExclusiveGateway]: 'ConditionTask',
  [StepTypes.End]: 'EndEvent',
}

// 编辑框标题
export const nodeModalTitle: Record<string, string> = {
  [StepTypes.ScriptTask]: '数据处理节点',
  [StepTypes.ServiceTask]: '编辑API调用节点',
  [StepTypes.ExclusiveGateway]: '判断节点',
  [StepTypes.End]: '结束节点',
}

export const lfConfig: Omit<Definition, 'container'> = {
  snapline: true,
  stopScrollGraph: false,
  background: {
    backgroundColor: '#F5F5F5',
  },
  keyboard: {
    enabled: true,
  },
  /** 不允许修改折线的锚点 */
  adjustEdgeMiddle: true,
  plugins: [
    // Snapshot,
    BpmnElement,
    SelectionSelect,
    Layout,
    EdgeMenu,
    MiniMap,
  ],
  pluginsOptions: {
    MiniMap: {
      width: 240,
      // 小地图会创建一个lf实例，disabledPlugins定义初始化lf时禁用的插件
      disabledPlugins: ['BpmnElement', 'edgeMenu', 'layout', 'startAnchorMenu', 'snapshot'],
      // 自定义miniMap插件，只显示节点轮廓
      plugins: [MiniElement],
    },
  },
}

export const setMenuConfig = (lf: LogicFlow) => {
  lf.setEdgeMenuItems([
    {
      icon: removeIconUrl,
      callback(data: BaseEdgeModel) {
        lf.deleteEdge(data.id)
      },
    },
  ])
}
