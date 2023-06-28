<script lang="ts" setup>
import type { BaseNodeModel } from '@logicflow/core'
import LogicFlow from '@logicflow/core'
import { onMounted, ref, toRaw } from 'vue'
import { lfConfig, setMenuConfig } from '~/utils/config'
import { useGraphStore } from '~/stores/graph'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import { message } from 'ant-design-vue'

interface LFNodeEvent {
  event?: Event
  data: BaseNodeModel
}

const store = useGraphStore()

const lf = ref<LogicFlow>()

const render = (data = {}) => {
  const lfRaw = toRaw(lf.value)
  lfRaw?.render(data)
}

onMounted(() => {
  lf.value = new LogicFlow({
    ...lfConfig,
    container: document.querySelector('#container')!,
  })
  store.initLF(lf.value)
  setMenuConfig(lf.value)
  initEvent()
  render()
  // 设置小地图，定位通过css覆盖
  lf.value.extension.miniMap.show(0, 0)
})

// 定义lf事件
const initEvent = () => {
  if (!lf.value) return
  // 双击节点
  lf.value.on('node:dbclick', () => {
    // 取消text编辑状态
    lf.value?.graphModel.textEditElement.setElementState(1)
  })
  lf.value.on('custom:node-edit', (data: BaseNodeModel) => {
    store.editModel('update', data.id, data)
    // 取消text编辑状态
    lf.value?.graphModel.textEditElement.setElementState(1)
  })
  // 双击边
  lf.value.on('edge:dbclick', ({ event }: LFNodeEvent) => {
    event?.preventDefault()
    // 取消text编辑状态
    lf.value?.graphModel.textEditElement.setElementState(1)
  })
  // 添加节点
  lf.value.on('node:dnd-add', ({ data }: LFNodeEvent) => {
    store.editModel('add', data.id, data)
  })
  // 非法连接提示
  lf.value.on('connection:not-allowed', ({ msg }) => {
    if (msg) {
      message.warning(msg)
    }
  })
}
</script>

<template>
  <div class="home">
    <div class="home-pannel">
      <!-- 菜单工具栏 -->
      <DndPanel :lf="lf" />
    </div>
    <!-- 放大缩小恢复 -->
    <Control :lf="lf" />
    <div id="container" />
  </div>
</template>

<style lang="less">
#container {
  width: 100%;
  height: 100%;
  line-height: 0;
}
.home {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: @body-background;

  &-top {
    padding: 0 40px 0 24px;
    font-size: 14px;
    line-height: 56px;
    background: @component-background;
  }

  &-main {
    display: flex;
    flex: 1;
  }

  &-pannel-wrap {
    position: absolute;
    width: 140px;
    background: #f5f5f5;
  }

  &-pannel {
    position: relative;
    width: 116px;
  }
}

.flow-controls {
  position: absolute;
  bottom: 48px;
  left: 24px;
  z-index: 999;
}
</style>
