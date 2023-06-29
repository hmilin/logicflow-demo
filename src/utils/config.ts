import type LogicFlow from '@logicflow/core'
import type { BaseEdgeModel, BaseNodeModel, Definition } from '@logicflow/core'
import removeIconUrl from '~/assets/img/remove.svg?url'

// 插件
import { Menu, SelectionSelect } from '@logicflow/extension'
import { BpmnElement } from '~/extensions'
import { StepTypes } from '~/extensions/bpmn/constant'
import EdgeMenu from '~/extensions/edge-menu'
import Layout from '~/extensions/layout'
import MiniElement from '~/extensions/minielement'
import { MiniMap } from '~/extensions/minimap'

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
    Menu,
    EdgeMenu,
    MiniMap,
  ],
  pluginsOptions: {
    MiniMap: {
      width: 240,
      // 小地图会创建一个lf实例，disabledPlugins定义初始化lf时禁用的插件
      disabledPlugins: ['BpmnElement', 'menu', 'edgeMenu', 'layout', 'startAnchorMenu', 'snapshot'],
      // 自定义miniMap插件，只显示节点轮廓
      plugins: [MiniElement],
    },
  },
}

export const setMenuConfig = (lf: LogicFlow) => {
  const menu = [
    {
      text: '复制',
      callback(node: BaseNodeModel) {
        lf.cloneNode(node.id)
      },
    },
    {
      text: '删除',
      callback(node: BaseNodeModel): void {
        // node为该节点数据
        lf.deleteNode(node.id)
      },
    },
  ]
  lf.setMenuConfig({
    nodeMenu: [],
    edgeMenu: [],
    graphMenu: [], // 覆盖默认的边右键菜单，与false表现一样
  })
  lf.setMenuByType({
    type: StepTypes.Start,
    menu,
  })
  lf.setMenuByType({
    type: StepTypes.End,
    menu,
  })
  lf.setEdgeMenuItems([
    {
      icon: removeIconUrl,
      callback(data: BaseEdgeModel) {
        lf.deleteEdge(data.id)
      },
    },
  ])
}

export const nodeDefaultValues = {
  [StepTypes.Start]: {
    name: '开始',
    icon: 'icon-start',
  },
  [StepTypes.UserTask]: {
    name: '用户任务',
    icon: 'icon-user',
  },
  [StepTypes.ServiceTask]: {
    name: '系统任务',
    icon: 'icon-service',
  },
  [StepTypes.ScriptTask]: {
    name: '数据处理',
    icon: 'icon-db',
  },
  [StepTypes.ExclusiveGateway]: {
    name: '条件判断',
    icon: 'icon-condition',
  },
  [StepTypes.End]: {
    name: '结束',
    icon: 'icon-stop',
  },
  [StepTypes.Flow]: {},
}
