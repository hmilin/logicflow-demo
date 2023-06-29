import type { BaseNodeModel } from '@logicflow/core'
import { HtmlNode } from '@logicflow/core'
import type { App, DefineComponent, VNode } from 'vue'
import { createApp, h } from 'vue'
import { getNodeText } from '../constant'
import NodeCard from './NodeCard.vue'

/** 通用的卡片节点 */
export default class BaseCardView extends HtmlNode {
  private isMounted = false
  vnode?: VNode
  app?: App<Element>
  constructor(props: any) {
    super(props)
    this.isMounted = false // 用个属性来避免重复挂载
    this.vnode = h(NodeCard as unknown as DefineComponent, {
      properties: props.model.getProperties(),
      text: getNodeText(props.model.getProperties()),
      type: props.model.getData().type,
      onEdit: () => {
        console.log('编辑节点')
      },
      onDelete: () => {
        props.graphModel.deleteNode(props.model.getData().id)
      },
      onClone: () => {
        const nodeModel = props.graphModel.cloneNode(this.props.model.id) as BaseNodeModel
        // 更新ID
        props.graphModel.getNodeModelById(nodeModel.id).setProperties({
          ...nodeModel.properties,
          name: `${nodeModel.properties.name}_copy`,
        })
      },
    })
    this.app = createApp({
      render: () => this.vnode,
    })
  }

  get title() {
    return getNodeText(this.props.model.getProperties())
  }

  setHtml(rootEl: HTMLElement) {
    if (!this.isMounted) {
      this.isMounted = true
      rootEl.parentElement!.setAttribute('class', 'node-filter')
      const node = document.createElement('div')
      node.style.width = `${this.props.model.width}px`
      node.style.height = `${this.props.model.height}px`
      rootEl.appendChild(node)
      this.app?.mount(node)
    } else {
      this.vnode!.component!.props.properties = this.props.model.getProperties() // properties发生变化后，将properties作为props传给vue组件
      this.vnode!.component!.props.text = this.title
    }
  }
}
