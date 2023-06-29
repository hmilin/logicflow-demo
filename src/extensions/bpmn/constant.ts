import type { BaseNodeModel } from '@logicflow/core'
import type { Theme } from '@logicflow/core/types/constant/DefaultTheme'

const fillConfig = {
  stroke: '#613EEA',
  strokeWidth: 1,
}

export const theme: Theme = {
  rect: {
    ...fillConfig,
  },
  circle: {
    r: 40,
    ...fillConfig,
  },
  diamond: {
    ...fillConfig,
    rx: 40,
    ry: 40,
  },
  polygon: {
    ...fillConfig,
    rx: 100,
    ry: 100,
  },
  polyline: {
    ...fillConfig,
    selectedStroke: '#613EEA',
    hoverStroke: '#613EEA',
  },
  bezier: {
    ...fillConfig,
    selectedStroke: '#613EEA',
    hoverStroke: '#613EEA',
  },
  anchor: {
    fill: '#D0D0D0',
    stroke: 'none',
    hoverStroke: '#613EEA',
  },
  edgeText: {
    fontSize: 12,
    color: 'transparent',
  },
  // 箭头样式
  arrow: {
    offset: 8,
    verticalLength: 4,
  },
  outline: {
    fill: 'none',
    strokeWidth: 0,
  },
}

/** 约定的节点类型 */
export enum StepTypes {
  Start = '0',
  End = '1',
  ServiceTask = '2',
  ExclusiveGateway = '3',
  UserTask = '4',
  ScriptTask = '5',
  Flow = 'sequenceFlow',
}

function addEllipsis(text: string, length: number) {
  return `${text.substring(0, length)}${text.length > length ? '...' : ''}`
}

/** 节点展示文本 */
export function getNodeText(node: BaseNodeModel['properties']) {
  return `${addEllipsis(node?.name || '', 20)}${
    node?.displayName ? `-${addEllipsis(node.displayName, 20)}` : ''
  }`
}

/** 节点宽高 */
export const nodeSize: Record<StepTypes, { width: number; height: number }> = {
  [StepTypes.Start]: {
    width: 60,
    height: 60,
  },
  [StepTypes.End]: {
    width: 64,
    height: 64,
  },
  [StepTypes.UserTask]: {
    width: 280,
    height: 148,
  },
  [StepTypes.ServiceTask]: {
    width: 280,
    height: 148,
  },
  [StepTypes.ExclusiveGateway]: {
    width: 280,
    height: 148,
  },
  [StepTypes.ScriptTask]: {
    width: 280,
    height: 148,
  },
  [StepTypes.Flow]: {
    width: 0,
    height: 1,
  },
}

export const defaultNodeSize = {
  width: 60,
  height: 60,
}

/** 锚点和节点的距离 */
export const anchorOffset = 0
export const anchorRadius = 4

export const nodeIDPrefixs: Record<StepTypes, string> = {
  [StepTypes.Start]: 'Event',
  [StepTypes.End]: 'Event',
  [StepTypes.ServiceTask]: 'Activity',
  [StepTypes.ExclusiveGateway]: 'Gateway',
  [StepTypes.ScriptTask]: 'Activity',
  [StepTypes.UserTask]: 'Activity',
  [StepTypes.Flow]: 'Flow',
}
