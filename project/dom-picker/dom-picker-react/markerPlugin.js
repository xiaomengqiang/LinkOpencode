import path from 'node:path'

const ATTRIBUTE_NAME = 'data-dom-picker-source'
const CWD = globalThis.process?.cwd?.() ?? ''

// 获取元素标识符（#id 或 标签.class）
function getElementIdentifier(node, t) {
  let id = ''
  let className = ''
  const tagName = node.name?.name || ''

  for (const attribute of node.attributes) {
    if (!t.isJSXAttribute(attribute)) continue
    
    const attrName = attribute.name?.name
    
    // 获取 id
    if (attrName === 'id' && t.isStringLiteral(attribute.value)) {
      id = attribute.value.value
    }
    
    // 获取 className
    if (attrName === 'className' && t.isStringLiteral(attribute.value)) {
      className = attribute.value.value
    }
  }

  // 优先返回 #id 格式
  if (id) return `{#${id} `
  
  // 其次返回 标签.class 格式
  if (className) return `{${tagName}.${className} `
  
  // 都没有则只返回 {
  return '{'
}

export default function domPickerReactMarkerPlugin({ types: t }) {
  return {
    name: 'dom-picker-react-source-attribute',
    visitor: {
      JSXOpeningElement(pathState, state) {
        const { node } = pathState
        const elementNode = pathState.parentPath?.node

        const hasMarker = node.attributes.some((attribute) => {
          return (
            t.isJSXAttribute(attribute) &&
            t.isJSXIdentifier(attribute.name, { name: ATTRIBUTE_NAME })
          )
        })

        if (hasMarker || !node.loc || !elementNode?.loc || !state.filename) {
          return
        }

        const relativeFilename = path
          .relative(CWD, state.filename)
          .split(path.sep)
          .join('/')

        // 获取元素标识符前缀
        const identifier = getElementIdentifier(node, t)
        
        const location = `${identifier}@project/${relativeFilename}:L${elementNode.loc.start.line}-${elementNode.loc.end.line}}`

        node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier(ATTRIBUTE_NAME), t.stringLiteral(location)),
        )
      },
    },
  }
}