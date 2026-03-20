import { transformAsync } from '@babel/core'
import domPickerReactMarkerPlugin from './markerPlugin.js'

const DEFAULT_INCLUDE = /\.[jt]sx$/
const DEFAULT_EXCLUDE = /\/node_modules\//

function toMatcher(pattern, defaultValue) {
  if (!pattern) {
    return defaultValue
  }

  if (pattern instanceof RegExp) {
    return (value) => pattern.test(value)
  }

  if (Array.isArray(pattern)) {
    const matchers = pattern.map((item) => toMatcher(item, () => false))
    return (value) => matchers.some((matcher) => matcher(value))
  }

  return (value) => value.includes(pattern)
}

export default function createDomPickerReactPlugin(options = {}) {
  const include = toMatcher(options.include, (value) => DEFAULT_INCLUDE.test(value))
  const exclude = toMatcher(options.exclude, (value) => DEFAULT_EXCLUDE.test(value))

  return {
    name: 'dom-picker-react-vite',
    enforce: 'pre',
    apply: 'serve',
    async transform(code, id) {
      const cleanId = id.split('?')[0]

      if (!include(cleanId) || exclude(cleanId)) {
        return null
      }

      const result = await transformAsync(code, {
        babelrc: false,
        configFile: false,
        filename: cleanId,
        sourceMaps: true,
        plugins: [domPickerReactMarkerPlugin],
        parserOpts: {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        },
      })

      if (!result?.code) {
        return null
      }

      return {
        code: result.code,
        map: result.map ?? null,
      }
    },
  }
}
