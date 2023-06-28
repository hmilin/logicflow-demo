<script lang="ts">
import LogicFlow from '@logicflow/core'
import { StepTypes } from '~/extensions/bpmn/constant'
import { EndIcon, ExclusiveGatewayIcon, ScriptTaskIcon, ServiceTaskIcon } from './icons'

const BpmnNodes = [
  {
    type: StepTypes.ServiceTask,
    text: 'api调用',
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
        properties: {},
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
  flex-direction: column;
  gap: 24px;
  padding: 24px 8px;
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
