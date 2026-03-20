# @dom-picker/react

React integration for DOM picker.

## Exports

- `@dom-picker/react`
- `@dom-picker/react/runtime`
- `@dom-picker/react/vite-plugin`
- `@dom-picker/react/babel-plugin`

## Runtime

```js
import { installReactDomPicker } from '@dom-picker/react'

if (import.meta.env.DEV) {
  installReactDomPicker()
}
```

## Vite Plugin

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import createDomPickerReactPlugin from '@dom-picker/react/vite-plugin'

export default defineConfig({
  plugins: [createDomPickerReactPlugin(), react()],
})
```

## Babel Plugin

```js
import createDomPickerReactPlugin from '@dom-picker/react/babel-plugin'
```
