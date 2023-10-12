import type LogicFlow from '@logicflow/core'
import type { EdgeConfig, Point } from '@logicflow/core'
import type { graphlib } from 'dagre'
import dagre from 'dagre'
import { groupBy } from 'lodash'
import { getEdgeCenter, shortPolyPoints } from '~/utils/algorithm'
import { StepTypes, anchorOffset, defaultNodeSize, nodeIDPrefixs, nodeSize } from '../bpmn/constant'
import { getGatewayAnchor } from '../bpmn/gateways/ExclusiveGateway'

/** 自动布局插件 */
export default class Layout {
  static pluginName = 'layout'
  // 算法库没有设置节点距离的参数，为了增大节点直接的距离，需要适当增加节点宽度，然后在线的起点和终点坐标抵消掉
  offsetLeft = 236
  offsetTop = 140
  private lf: LogicFlow
  /** dagreGraph instance */
  private dagreGraph?: graphlib.Graph | null

  constructor({ lf }: { lf: LogicFlow }) {
    this.lf = lf
  }

  /** 自动布局 */
  async autoLayout() {
    /** 设置dagreGraph数据 */
    this.initDagreGraph()
    this.updateLayoutElements()
    /** 计算布局 */
    dagre.layout(this.dagreGraph!)
    /** 将新的位置更新到logicFlow的数据里 */
    this.updateLogicFlowLayout()
    this.lf.resetTranslate()
  }

  private initDagreGraph() {
    this.dagreGraph = new dagre.graphlib.Graph({ multigraph: true })
    this.dagreGraph.setDefaultEdgeLabel(() => ({}))
    this.dagreGraph.setGraph({ rankdir: 'LR', marginx: 48, marginy: 128, ranksep: 100 })
  }

  private updateLayoutElements() {
    const { nodes, edges } = this.lf.getGraphRawData()

    // 同一源节点下的连线分组
    const sourceEdges = groupBy(edges, (edge) => edge.sourceNodeId)
    const nodeOrders: Record<string, number> = {}
    for (const edge in sourceEdges) {
      sourceEdges[edge].sort((a, b) => a.startPoint!.y - b.startPoint!.y)
      sourceEdges[edge].forEach((edge, index) => {
        nodeOrders[edge.targetNodeId] = (nodeOrders[edge.targetNodeId] || 0) + 1 + index
      })
    }

    // dagre算法中同一层级节点的order是根据node的先后顺序确定，所以手动排下序
    nodes.sort((a, b) => nodeOrders[a.id!] - nodeOrders[b.id!])
    // 设置节点
    nodes.forEach((node) => {
      const t = node.type as StepTypes
      this.dagreGraph!.setNode(node.id!, {
        width: nodeSize[t]?.width || defaultNodeSize.width,
        height: nodeSize[t]?.height || defaultNodeSize.height,
      })
    })

    edges.forEach((edge) => {
      const name = this.getEdgeName(edge)
      this.dagreGraph!.setEdge(
        edge.sourceNodeId,
        edge.targetNodeId,
        {
          points: edge.pointsList,
        },
        name,
      )
    })
  }

  private updateLogicFlowLayout() {
    const { nodes, edges } = this.lf.getGraphRawData()
    nodes.forEach((node) => {
      const nodeWithPosition = this.dagreGraph!.node(node.id!)
      // dagre 也是以节点的中心位置为坐标值，所以不需要转换
      node.x = nodeWithPosition.x
      node.y = nodeWithPosition.y
    })
    edges.forEach((edge) => {
      const name = this.getEdgeName(edge)
      const edgeWithPosition = this.dagreGraph!.edge(edge.sourceNodeId, edge.targetNodeId, name)
      const points = edgeWithPosition.points
      const pointsLength = points.length
      // 起点和终点算上锚点和节点之间的距离
      points[0].x += anchorOffset
      points[pointsLength - 1].x -= anchorOffset
      // 以条件节点开始的线需要重新计算起点
      if (edge.sourceNodeId?.startsWith(nodeIDPrefixs[StepTypes.ExclusiveGateway])) {
        const p = this.getGatewayPointStart(edge.sourceNodeId, edge.sourceAnchorId!)
        if (p) {
          points[0].x = p.x
          points[0].y = p.y
        }
      }
      // 当结束点被多次链接的时候，默认会铺开，所有结束节点都要重新计算位置
      const targetNodePosition = this.dagreGraph!.node(edge.targetNodeId)
      points[pointsLength - 1].x = targetNodePosition.x - targetNodePosition.width / 2
      points[pointsLength - 1].y = targetNodePosition.y

      edge.startPoint = points[0]
      edge.endPoint = points[pointsLength - 1]
      edge.pointsList = edgeWithPosition.points
      // 有多段的都要重新计算中间点
      if (points.length > 2) {
        // 添加一个点
        const start = { ...points[0] }
        const end = { ...points[pointsLength - 1] }
        // 计算中点
        const center = getEdgeCenter({
          sourceX: start.x,
          sourceY: start.y,
          targetX: end.x,
          targetY: end.y,
        })
        edge.pointsList = [start, { x: center[0], y: start.y }, { x: center[0], y: end.y }, end]
        // 去重
        edge.pointsList = shortPolyPoints(edge.pointsList) as Point[]
      }
    })
    this.lf.renderRawData({ nodes, edges })

    this.dagreGraph = null
  }

  private getEdgeName(edge: EdgeConfig) {
    return `${edge.sourceAnchorId}-${edge.targetAnchorId}`
  }

  private getGatewayPointStart(sourceNodeId: string, sourceAnchorId: string) {
    // 获取条件节点位置，计算锚点位置
    const nodePosition = this.dagreGraph!.node(sourceNodeId)
    const anchors = getGatewayAnchor(
      nodePosition.x,
      nodePosition.y,
      nodeSize[StepTypes.ExclusiveGateway].width,
      nodeSize[StepTypes.ExclusiveGateway].height,
      sourceNodeId,
    )
    const targetAnchor = anchors.find(({ id }) => id === sourceAnchorId)
    if (targetAnchor) {
      return {
        x: targetAnchor.x,
        y: targetAnchor.y,
      }
    }
  }
}
