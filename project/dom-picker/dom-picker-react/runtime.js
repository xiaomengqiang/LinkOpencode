import { installDomPicker } from '../dom-picker-core/runtime.js'

export function installReactDomPicker() {
  installDomPicker({
    logPrefix: 'dom-picker-react',
    idleHint: 'Move over JSX-rendered DOM (file:startLine:endLine)',
  })
}
