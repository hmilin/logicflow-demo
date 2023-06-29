import { StepTypes, theme } from './constant'
import EndEvent, { EndEventModel, EndEventView } from './events/EndEvent'
import StartEvent, { StartEventModel, StartEventView } from './events/StartEvent'
import SequenceFlow, { SequenceFlowModel, SequenceFlowView } from './flow/SequenceFlow'
import ExclusiveGateway, {
  ExclusiveGatewayModel,
  ExclusiveGatewayView,
} from './gateways/ExclusiveGateway'
import ScriptTask, { ScriptTaskModel, ScriptTaskView } from './tasks/ScriptTask'
import ServiceTask, { ServiceTaskModel, ServiceTaskView } from './tasks/ServiceTask'
import UserTask, { UserTaskModel, UserTaskView } from './tasks/UserTask'

class BpmnElement {
  static pluginName = 'BpmnElement'
  constructor({ lf }) {
    lf.setTheme(theme)
    lf.register(StartEvent)
    lf.register(EndEvent)
    lf.register(ExclusiveGateway)
    lf.register(ServiceTask)
    lf.register(UserTask)
    lf.register(ScriptTask)
    // 支持自定义bpmn元素的连线
    if (!lf.options.customBpmnEdge) {
      lf.register(SequenceFlow)
      lf.setDefaultEdgeType(StepTypes.Flow)
    }
  }
}

export {
  BpmnElement,
  EndEventModel,
  EndEventView,
  ExclusiveGatewayModel,
  ExclusiveGatewayView,
  ScriptTaskModel,
  ScriptTaskView,
  SequenceFlowModel,
  SequenceFlowView,
  ServiceTaskModel,
  ServiceTaskView,
  StartEventModel,
  StartEventView,
  UserTaskModel,
  UserTaskView,
}
