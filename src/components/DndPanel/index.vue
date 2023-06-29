<script lang="ts">
import LogicFlow from '@logicflow/core'
import { StepTypes } from '~/extensions/bpmn/constant'
import { nodeDefaultValues } from '~/utils/config'
import {
  StartIcon,
  EndIcon,
  ExclusiveGatewayIcon,
  ScriptTaskIcon,
  ServiceTaskIcon,
  UserTaskIcon,
} from './icons'

const BpmnNodes = [
  {
    type: StepTypes.Start,
    text: '开始',
    icon: StartIcon,
  },
  {
    type: StepTypes.UserTask,
    text: '用户任务',
    icon: UserTaskIcon,
  },
  {
    type: StepTypes.ServiceTask,
    text: '系统任务',
    icon: ServiceTaskIcon,
  },
  {
    type: StepTypes.ExclusiveGateway,
    text: '条件判断',
    icon: ExclusiveGatewayIcon,
  },
  {
    type: StepTypes.ScriptTask,
    text: '数据处理',
    icon: ScriptTaskIcon,
  },
  {
    type: StepTypes.End,
    text: '结束',
    icon: EndIcon,
  },
]

export default {
  props: {
    lf: LogicFlow,
  },
  data() {
    return {
      nodeList: BpmnNodes,
    }
  },
  methods: {
    drageNode(item: (typeof BpmnNodes)[number]) {
      this.lf?.dnd.startDrag({
        type: item.type,
        text: '',
        properties: {
          ...nodeDefaultValues[item.type],
          description: '节点内容...',
        },
      })
    },
  },
}
</script>

<template>
  <div class="node-panel">
    <div v-for="item in nodeList" :key="item.text" class="node-item" @mousedown="drageNode(item)">
      <div class="node-item-icon" v-html="item.icon" />
      <div class="node-text">
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.node-panel {
  position: absolute;
  top: 10px;
  left: 24px;
  z-index: 101;
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  text-align: center;
  background: rgb(255 255 255);
  border: 1px dashed rgb(0 0 0 / 15%);
  border-radius: 2px;
  user-select: none;
}

.node-item-icon {
  width: 100%;
  cursor: move;

  :deep(.panel-icon-border) {
    transition: stroke 0.2s ease-in;
    stroke: rgb(0 0 0 / 15%);
  }

  &:hover :deep(.panel-icon-border) {
    stroke: @primary-color;
  }
}

.node-text {
  color: rgb(0 0 0 / 45%);
  font-weight: normal;
  font-size: 12px;
  font-style: normal;
}
</style>
