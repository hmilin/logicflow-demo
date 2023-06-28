import { StepTypes } from '../bpmn/constant'
import createMiniElement from './createMiniElement'

const StartEvent = createMiniElement(StepTypes.Start)

const EndEvent = createMiniElement(StepTypes.End)
const ExclusiveGateway = createMiniElement(StepTypes.ExclusiveGateway)
const ServiceTask = createMiniElement(StepTypes.ServiceTask)
const ScriptTask = createMiniElement(StepTypes.ScriptTask)

export { EndEvent, ExclusiveGateway, ScriptTask, ServiceTask, StartEvent }
