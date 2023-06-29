import {
  EndEvent,
  ExclusiveGateway,
  ScriptTask,
  ServiceTask,
  StartEvent,
  UserTask,
} from './elements'

const theme = {
  rect: {
    fill: 'rgb(222, 222, 222)',
    strokeWidth: 2,
    stroke: 'transparent',
  },
}

// 小地图里的节点
class MiniElement {
  static pluginName = 'MiniElement'
  constructor({ lf }) {
    lf.setTheme(theme)
    lf.register(StartEvent)
    lf.register(EndEvent)
    lf.register(ExclusiveGateway)
    lf.register(ServiceTask)
    lf.register(ScriptTask)
    lf.register(UserTask)
  }
}

export default MiniElement
