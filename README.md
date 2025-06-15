
# @sdbnd/vue-theme-plugin

A Vue 3 composable plugin for flexible theme management. Supports any number of themes, configurable storage, and reactive updates. No hard dependency on 'dark' or 'light' themes.

## Features

- Supports multiple custom themes beyond just dark and light.
- Configurable storage options: localStorage, sessionStorage, custom storage, or none.
- Reactive theme state with Vue 3 Composition API.
- Automatically syncs with system color scheme preferences if available.
- Clean API to set, toggle, and track current theme.
- Applies theme classes and `data-theme` attributes to document root.

## Installation

```bash
npm install @sdbnd/vue-theme-plugin
```

## Usage

```ts
import { useTheme } from '@sdbnd/vue-theme-plugin';

const { theme, setTheme, toggleTheme } = useTheme({
  available: ['red', 'blue', 'green'],
  themes: {
    red: { class: 'theme-red', dataTheme: 'red' },
    blue: { class: 'theme-blue', dataTheme: 'blue' },
    green: { class: 'theme-green', dataTheme: 'green' },
  },
  defaultTheme: 'blue',
  key: 'my-theme',
  storage: 'local', // or 'session', 'none', or custom storage
});

// Use theme.value reactively, call setTheme('red') or toggleTheme() as needed.
```

## API

### `useTheme(options)`

- `options.defaultTheme`: string — Default theme name. Defaults to first in `available` if omitted.
- `options.available`: string[] — List of theme names allowed.
- `options.themes`: Record<string, { class?: string, dataTheme: string }> — Optional theme configurations for class and `data-theme` attribute.
- `options.key`: string — Storage key, default `'theme'`.
- `options.storage`: `'local' | 'session' | 'none' | StorageLike` — Storage type or custom storage object.

Returns an object with:

- `theme`: reactive Ref of current theme name.
- `themes`: array of available theme names.
- `setTheme(name)`: function to set theme by name.
- `toggleTheme()`: function to cycle through themes in `available`.

## License

MIT License
