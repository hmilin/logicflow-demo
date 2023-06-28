<script>
export default {
  props: {
    lf: Object,
  },
  data() {
    return {
      menus: [
        {
          icon: 'icon-fullscreen',
          onClick: this.autoLayout,
          title: '自动布局',
        },
        {
          icon: 'icon-fullscreenexit',
          onClick: this.reSet,
          title: '适应',
        },
        {
          icon: 'icon-zoomin',
          onClick: this.processZoomIn,
          title: '放大',
        },
        {
          icon: 'icon-zoomout',
          onClick: this.processZoomOut,
          title: '缩小',
        },
        {
          icon: 'icon-selection',
          onClick: this.openSelection,
          title: '选区',
        },
      ],
    }
  },
  methods: {
    //重置
    reSet() {
      this.lf.resetZoom()
    },
    //放大
    processZoomIn() {
      this.lf.zoom(true)
    },
    //缩小
    processZoomOut() {
      this.lf.zoom(false)
    },
    // 自动布局
    autoLayout() {
      this.lf.extension.layout?.autoLayout()
    },
    // 设置选区
    openSelection() {
      this.lf.extension.selectionSelect.openSelectionSelect()
      this.lf.once('selection:selected', () => {
        this.lf.extension.selectionSelect.closeSelectionSelect()
      })
    },
  },
}
</script>

<template>
  <div class="flow-controls">
    <a v-for="menu in menus" :key="menu.title" :title="menu.title">
      <Icon class="icon" :type="menu.icon" @click="menu.onClick" />
    </a>
  </div>
</template>

<style lang="less" scoped>
.flow-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 40px;
  padding: 12px 0;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 20%);
  user-select: none;

  > a {
    color: @heading-color;
    line-height: 24px;

    &:hover {
      color: @primary-color;
    }

    &:not(:last-child) {
      padding-bottom: 10px;
      border-bottom: 1px solid #f0f0f0;
    }
  }

  .icon {
    font-size: 24px;
  }
}
</style>
