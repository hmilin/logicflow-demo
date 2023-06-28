import type LogicFlow from '@logicflow/core'
import type { PolygonNodeModel } from '@logicflow/core'
import type { PolyPoint } from '~/utils/algorithm'
import {
  getCenterSegment,
  getEdgeCenter,
  getSegmentDirection,
  shortPolyPoints,
} from '~/utils/algorithm'

import './index.css'

interface MenuItem {
  icon: string
  callback?: (data: PolygonNodeModel) => void
  className?: string
  properties: Record<string, any>
}

/** 边的菜单 */
export default class EdgeMenu {
  static pluginName = 'edgeMenu'
  private menuDOM?: HTMLElement
  private lf: LogicFlow
  private toolOverlay: any
  private _activeData?: PolygonNodeModel
  commonMenuItems?: MenuItem[]
  isShow = false

  constructor({ lf }: { lf: LogicFlow }) {
    this.lf = lf
    this.lf.setEdgeMenuItems = (menus: MenuItem[]) => {
      this.setEdgeMenuItems(menus)
    }
    this.lf.hideContextMenu = () => {
      this.hideMenu()
    }
  }

  /**
   * 设置通用的菜单选项
   */
  setEdgeMenuItems(items: MenuItem[]) {
    this.commonMenuItems = items
  }

  render(lf: LogicFlow, toolOverlay: HTMLElement) {
    this.toolOverlay = toolOverlay
    // 边右键
    lf.on('edge:contextmenu', ({ data }) => {
      this._activeData = data
      this.createMenu()
    })
    lf.on('blank:click', () => {
      this.hideMenu()
    })
  }

  createMenu() {
    const menuDOM = document.createElement('div')
    menuDOM.setAttribute('class', 'lf-edge-menu')
    const menus = document.createDocumentFragment()
    this.commonMenuItems?.forEach((item) => {
      const menuItem = document.createElement('div')
      menuItem.className = 'lf-edge-menu-item'
      const img = document.createElement('img')
      img.src = item.icon
      img.className = 'lf-edge-menu-img'
      if (item.className) {
        menuItem.className = `${menuItem.className} ${item.className}`
      }
      img.addEventListener('click', () => {
        this.hideMenu()
        if (item.callback) {
          item.callback(this._activeData!)
        }
      })
      menuItem.appendChild(img)
      menus.appendChild(menuItem)
    })
    menuDOM.innerHTML = ''
    menuDOM.appendChild(menus)
    this.menuDOM = menuDOM
    this.showMenu()
  }

  // 计算出菜单应该显示的位置（节点的右上角）
  getContextMenuPosition() {
    const data = this._activeData
    if (!data) return []
    const model = this.lf.graphModel.getEdgeModelById(data.id)
    if (!model?.pointsList) return []
    // 将菜单放在最长那一段的中间
    const points = getCenterSegment(shortPolyPoints(model.pointsList))
    const [{ x: sourceX, y: sourceY }, { x: targetX, y: targetY }] = points
    const [x, y] = getEdgeCenter({ sourceX, sourceY, targetX, targetY })
    const direction = getSegmentDirection(points as [PolyPoint, PolyPoint])
    // 根据线段方向加偏移量。避免菜单挡住线
    const point: [number, number] = direction === 'horizontal' ? [x, y - 10] : [x + 10, y]
    return this.lf.graphModel.transformModel.CanvasPointToHtmlPoint(point)
  }

  showMenu() {
    if (!this.menuDOM) return
    const [x, y] = this.getContextMenuPosition()
    this.menuDOM.style.display = 'flex'
    // 将菜单显示到对应的位置
    this.menuDOM.style.top = `${y}px`
    this.menuDOM.style.left = `${x}px`
    this.toolOverlay.appendChild(this.menuDOM)
  }

  /**
   * 隐藏菜单
   */
  hideMenu() {
    if (!this.menuDOM) return
    this.menuDOM.innerHTML = ''
    this.menuDOM.style.display = 'none'
    if (this.isShow) {
      this.toolOverlay.removeChild(this.menuDOM)
    }
    this.lf.off('node:delete,edge:delete,node:drag,graph:transform', this.listenDelete)
    this.isShow = false
  }

  listenDelete = () => {
    this.hideMenu()
  }
}
