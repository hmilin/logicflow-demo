# Logicflow Demo

一个[LogicFlow](https://github.com/didi/LogicFlow)的 Vue3 使用案例，使用基础的 bpmn 元素作为节点，支持一键布局，支持 Vue 组件实现节点卡片，并实现了更简洁的轮廓小地图。

[线上地址](http://logicflow.meiling.fun/)

![demo](http://logicflow.meiling.fun/demo.png)

## 特性

- [x] 基于 dagre 实现自动布局
- [x] 自定义 Vue 组件作为节点
- [x] 实现 [react-flow](https://reactflow.dev/docs/api/plugin-components/minimap/) 风格的轮
- [x] 自定义连线规则
- [x] 基于`PolylineEdge`实现转折点带弧度的折线

## 开发

```
pnpm install
```

```
pnpm start
```
