<script setup lang="ts">
import type { NodeProperties } from '~/models/graph'
import type { StepTypes } from '../constant'
import Icon from '~/components/Icon'
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'

const props = defineProps<{ properties: NodeProperties; type: StepTypes; text: string }>()
const emit = defineEmits(['edit', 'delete', 'clone'])
</script>

<template>
  <div class="node-card">
    <div class="node-card-header">
      <Icon :type="props.properties.icon" :style="{ fontSize: '20px' }"></Icon>
      <div class="node-card-title">{{ props.text }}</div>
      <a @click="emit('edit')"><EditOutlined /></a>
    </div>
    <div class="node-card-body">
      <div class="node-card-content">{{ props.properties.description }}</div>

      <div class="node-card-action">
        <a-dropdown>
          <EllipsisOutlined :style="{ fontSize: '24px' }" @click.prevent />
          <template #overlay>
            <a-menu>
              <a-menu-item key="delete" @click="emit('delete')">删除</a-menu-item>
              <a-menu-item key="clone" @click="emit('clone')">复制</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.node-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  margin: 4px auto;
  line-height: @line-height-base;
  background-color: @component-background;
  border: 1px solid rgb(0 0 0 / 15%);
  border-radius: 8px;

  &:hover {
    box-shadow: 0 0 8px @primary-3;
  }

  .node-card-header {
    display: flex;
    gap: 8px;
    align-items: center;
    height: 32px;
    padding: 0 12px;
    border-bottom: 1px solid @border-color-base;

    .node-card-title {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .node-card-body {
    flex: 1;
    padding: 8px 12px 16px;
  }

  .node-card-action {
    position: absolute;
    right: 4px;
    bottom: 0;
  }

  .node-card-content {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .end-status {
    &::before {
      display: inline-block;
      width: 8px;
      height: 8px;
      vertical-align: middle;
      background-color: @success-color;
      content: '';
    }

    &::after {
      display: inline-block;
      margin-left: 8px;
      vertical-align: middle;
    }

    &[data-status='fail']::before {
      background-color: @error-color;
    }

    &[data-status='fail']::after {
      content: '失败';
    }

    &[data-status='succeed']::after {
      content: '成功';
    }
  }
}
</style>
