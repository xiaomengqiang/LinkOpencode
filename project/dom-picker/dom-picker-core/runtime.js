const ATTRIBUTE_NAME = 'data-dom-picker-source'
const OVERLAY_ID = 'dom-picker-overlay'
const BADGE_ID = 'dom-picker-badge'
const PANEL_ID = 'dom-picker-panel'
const TOGGLE_ID = 'dom-picker-toggle'

const COPY_SOURCE_ID = 'dom-picker-copy-source'

function parseLocation(location) {
  if (!location) {
    return null
  }

  const parts = location.split(':')
  if (parts.length < 3) {
    return null
  }

  const endLine = parts.pop()
  const startLine = parts.pop()
  const filePath = parts.join(':')

  if (!filePath || !startLine || !endLine) {
    return null
  }

  return {
    filePath,
    startLine,
    endLine
  }
}

function createEditorCommand(location) {
  const parsed = parseLocation(location)
  if (!parsed) {
    return 'code -g <file>:<startLine>'
  }

  return `code -g "${parsed.filePath}:${parsed.startLine}"`
}

function createOverlay() {
  const overlay = document.createElement('div')
  overlay.id = OVERLAY_ID
  overlay.style.position = 'fixed'
  overlay.style.zIndex = '2147483646'
  overlay.style.pointerEvents = 'none'
  overlay.style.border = '2px solid #007bff'
  overlay.style.background = 'rgba(0, 123, 255, 0.1)'
  overlay.style.opacity = '0'
  overlay.style.transition = 'all 0.1s ease-out'
  return overlay
}

function createBadge() {
  const badge = document.createElement('div')
  badge.id = BADGE_ID
  badge.innerHTML = `
    <span data-role="tag">dom</span>
    <div id="${COPY_SOURCE_ID}">复制元素</div>
  `

  Object.assign(badge.style, {
    position: 'fixed',
    zIndex: '2147483647',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    borderRadius: '3px',
    background: '#007bff',
    color: '#eff6ff',
    boxShadow: '0 10px 30px rgba(0, 123, 255, 0.28)',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: '20px',
    lineHeight: '1',
    opacity: '0',
    pointerEvents: 'auto',
    transition: 'opacity 0.1s ease-out',
  })

  const tag = badge.querySelector('[data-role="tag"]')
  Object.assign(tag.style, {
    maxWidth: '240px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: '700',
  })

  const copyButton = badge.querySelector(`#${COPY_SOURCE_ID}`)
  Object.assign(copyButton.style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width:'96px',
    border: '1px solid rgba(239, 246, 255, 0.42)',
    borderRadius: '3px',
    padding: '2px 6px',
    background: 'rgba(239, 246, 255, 0.14)',
    color: '#eff6ff',
    fontSize: '20px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    cursor: 'pointer',
  })

  return badge
}

function createPanel() {
  const panel = document.createElement('aside')
  panel.id = PANEL_ID
  panel.innerHTML = `
    <button id="${TOGGLE_ID}" type="button">DOM Picker: On</button>

    `

  Object.assign(panel.style, {
    position: 'fixed',
    right: '16px',
    top: '16px',
    width: 'min(360px, calc(100vw - 32px))',
    zIndex: '2147483647',
    pointerEvents:'none',
    opacity:'0',
  })

  const button = panel.querySelector(`#${TOGGLE_ID}`)
  Object.assign(button.style, {
    justifySelf: 'start',
    border: '0',
    borderRadius: '999px',
    padding: '7px 12px',
    background: '#ff6b35',
    color: '#fff7ed',
    font: 'inherit',
    fontWeight: '700',
    cursor: 'pointer',
  })


  return panel
}

function updateOverlay(overlay, element) {
  if (!element) {
    overlay.style.opacity = '0'
    return
  }

  const rect = element.getBoundingClientRect()
  overlay.style.opacity = '1'
  overlay.style.top = `${rect.top}px`
  overlay.style.left = `${rect.left}px`
  overlay.style.width = `${rect.width}px`
  overlay.style.height = `${rect.height}px`
}

function updateBadge(badge, element, location) {
  const copyButton = badge.querySelector(`#${COPY_SOURCE_ID}`)

  if (!element || !location) {
    badge.style.opacity = '0'
    badge.dataset.source = ''
    return
  }

  const tag = badge.querySelector('[data-role="tag"]')
  const rect = element.getBoundingClientRect()
  const sourceChanged = badge.dataset.source !== location

  tag.textContent = element.tagName.toLowerCase()
  badge.dataset.source = location
  badge.style.opacity = '1'
  badge.style.left = '8px'
  badge.style.top = '8px'
  const badgeRect = badge.getBoundingClientRect()
  const outsideTop = rect.top - badgeRect.height < 0
  const top = outsideTop ? rect.top : rect.top - badgeRect.height
  const left = Math.min(Math.max(0, rect.left), Math.max(0, window.innerWidth - badgeRect.width))

  badge.style.left = `${left}px`
  badge.style.top = `${Math.max(0, top)}px`

  if (sourceChanged) {
    const existingTimer = Number(copyButton.dataset.resetTimer || 0)
    if (existingTimer) {
      window.clearTimeout(existingTimer)
      copyButton.dataset.resetTimer = ''
    }

    copyButton.textContent = '复制元素'
  }
}

function showCopySuccess(button) {
  if (!button) {
    return
  }

  const existingTimer = Number(button.dataset.resetTimer || 0)
  if (existingTimer) {
    window.clearTimeout(existingTimer)
  }

  button.innerHTML = '√ 已复制'

  const timer = window.setTimeout(() => {
    button.textContent = '复制元素'
    button.dataset.resetTimer = ''
  }, 1500)

  button.dataset.resetTimer = String(timer)
}

export function installDomPicker(options = {}) {
  const {
    logPrefix = 'dom-picker',
      idleHint = 'Move over rendered DOM (file:startLine:endLine)',
  } = options

  if (typeof window === 'undefined' || document.getElementById(PANEL_ID)) {
    return
  }

  const overlay = createOverlay()
  const badge = createBadge()
  const panel = createPanel()


  const toggle = panel.querySelector(`#${TOGGLE_ID}`)
  const copySource = badge.querySelector(`#${COPY_SOURCE_ID}`)

  let enabled = true
  let activeElement = null
  let currentCommand = createEditorCommand('')

  const syncPanel = (message, value) => {
    currentCommand = createEditorCommand(value)

  }

  const getMarkedElement = (target) => {
    if (!(target instanceof Element)) {
      return null
    }

    if (target.closest(`#${BADGE_ID}`)) {
      return activeElement
    }

    if (target.closest(`#${PANEL_ID}`)) {
      return null
    }

    return target.closest(`[${ATTRIBUTE_NAME}]`)
  }

  const handlePointerMove = (event) => {
    if (!enabled) {
      return
    }

    activeElement = getMarkedElement(event.target)
    updateOverlay(overlay, activeElement)

    if (activeElement) {
      const location = activeElement.getAttribute(ATTRIBUTE_NAME)
      updateBadge(badge, activeElement, location)
      syncPanel('Ready to inspect', location)
    } else {
      updateBadge(badge, null, '')
      syncPanel('No source marker on current node', idleHint)
    }
  }

  const handleClick = async (event) => {
    if (!enabled) {
      return
    }

    if (event.target instanceof Element && event.target.closest(`#${BADGE_ID}`)) {
      return
    }

    const element = getMarkedElement(event.target)
    if (!element) {
      return
    }

    const location = element.getAttribute(ATTRIBUTE_NAME)
    event.preventDefault()
    event.stopPropagation()

    updateBadge(badge, element, location)
    syncPanel('Selected node source range', location)
    console.log(`[${logPrefix}] selected:`, location, element)
    console.log(`[${logPrefix}] editor:`, currentCommand)
  }

  const handleScrollOrResize = () => {
    if (enabled) {
      updateOverlay(overlay, activeElement)
      updateBadge(badge, activeElement, activeElement?.getAttribute(ATTRIBUTE_NAME))
    }
  }

  toggle.addEventListener('click', () => {
    enabled = !enabled
    toggle.textContent = `DOM Picker: ${enabled ? 'On' : 'Off'}`
    toggle.style.background = enabled ? '#ff6b35' : '#475467'

    if (!enabled) {
      activeElement = null
      updateOverlay(overlay, null)
      updateBadge(badge, null, '')
      syncPanel('Picker paused', 'Turn it back on to inspect nodes')
      return
    }

    syncPanel('Move and click any marked DOM node', 'Waiting for selection (file:startLine:endLine)')
  })



  copySource.addEventListener('click', async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const location = badge.dataset.source || activeElement?.getAttribute(ATTRIBUTE_NAME)
    if (!location) {
      // status.textContent = 'No selected source to copy' 
      return
    }

    if (!navigator.clipboard?.writeText) {
      // status.textContent = 'Clipboard API unavailable'
      return
    }

    try {
      await navigator.clipboard.writeText(location)
      // status.textContent = 'Source range copied from overlay badge' 
      showCopySuccess(copySource)
    } catch {
      // status.textContent = 'Failed to copy source range'
    }
  })

  document.body.append(overlay, badge, panel)
  window.addEventListener('pointermove', handlePointerMove, true)
  window.addEventListener('click', handleClick, true)
  window.addEventListener('scroll', handleScrollOrResize, true)
  window.addEventListener('resize', handleScrollOrResize)
  window.addEventListener('message',(event)=>{
    if(event.origin !== 'http://localhost:8080' && event.origin !== 'http://127.0.0.1:8080'&& event.origin !== 'http://127.0.0.1:7687'){
      return
    }
    if(event.data.type === 'TOGGLE_DOM_PICKER'){
      toggle.click()
    }
  })
  console.log(`[${logPrefix}] ready`)
}


