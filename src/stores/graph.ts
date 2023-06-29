import type LogicFlow from '@logicflow/core'
import type { BaseNodeModel } from '@logicflow/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { StepTypes } from '~/extensions/bpmn/constant'
import type { NodeProperties } from '~/models/graph'

interface GraphState {
  /** 是否打开编辑节点的弹窗 */
  modal: boolean
  /** 正在编辑的elementId */
  targetId: string | null
  /** 正在编辑的节点类型 */
  nodeType: string
  /** 当前编辑对象的数据模型 */
  targetModel: Partial<NodeProperties> | null
  /** LogicFlow实例 */
  lfInstance?: LogicFlow | null
  /** 当前节点处于编辑状态 */
  editMode: 'update' | 'add'
  // 是否有改动
  change: boolean
}

export const useGraphStore = defineStore('graph', {
  state: (): GraphState => ({
    modal: false,
    nodeType: '',
    targetModel: {},
    targetId: null,
    editMode: 'add',
    lfInstance: null,
    change: false,
  }),
  getters: {
    /** 当前节点列表 */
    nodes: (state) => state.lfInstance?.getGraphRawData().nodes,
    apiNames: (state) =>
      state.lfInstance
        ?.getGraphRawData()
        .nodes.filter(({ type }) => type === StepTypes.ServiceTask)
        .map(({ properties }) => properties?.name as string),
  },
  actions: {
    editModel(editMode: GraphState['editMode'], elementId: string, initModel?: BaseNodeModel) {
      // 开始节点不可编辑
      if (initModel?.type === StepTypes.Start) return
      this.$patch({
        targetId: elementId,
        modal: true,
        nodeType: initModel?.type,
        targetModel: initModel?.properties,
        editMode,
      })
    },
    saveModel(elementId: string, model: NodeProperties) {
      // 更新节点信息
      this.lfInstance?.setProperties(elementId, model)
      this.modal = false
      this.resetTarget()
      this.change = true
    },
    closeModal() {
      if (this.editMode === 'add') {
        // 添加了节点没保存数据，删除该节点
        this.lfInstance?.deleteElement(this.targetId)
      }
      this.modal = false
      this.resetTarget()
    },
    resetTarget() {
      this.$patch({
        targetId: null,
        nodeType: '',
        targetModel: null,
      })
    },
    initLF(lf: LogicFlow) {
      this.lfInstance = lf
    },
    saveGraph() {
      this.change = false
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGraphStore, import.meta.hot))
}
