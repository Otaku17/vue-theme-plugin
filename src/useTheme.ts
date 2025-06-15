import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Represents the name of a theme.
 *
 * This type is used to identify and reference different themes by their string names.
 */
type ThemeName = string;

/**
 * Represents the configuration options for a theme.
 *
 * @property class - An optional CSS class name to apply for the theme.
 * @property dataTheme - An optional data attribute value (e.g., for `data-theme`) to specify the theme.
 */
type ThemeConfig = {
  class?: string;
  dataTheme?: string;
};

/**
 * Options for configuring the theme system.
 *
 * @property defaultTheme - The name of the theme to use by default.
 * @property available - An array of theme names that are available for selection.
 * @property themes - An optional mapping of theme names to their configuration objects.
 * @property key - An optional storage key used to persist the selected theme.
 * @property storage - The storage mechanism to use for persisting the theme selection.
 *   Can be 'local', 'session', 'none', or a custom StorageLike implementation.
 * @property detectTheme - An optional function to detect and return the current theme name, or null if not detected.
 */
type ThemeOptions = {
  defaultTheme?: ThemeName;
  available: ThemeName[];
  themes?: Record<ThemeName, ThemeConfig>;
  key?: string;
  storage?: 'local' | 'session' | 'none' | StorageLike;

  detectTheme?: () => ThemeName | null;
};

/**
 * Represents a minimal interface for storage mechanisms that support
 * getting, setting, and optionally removing string key-value pairs.
 *
 * This interface is compatible with browser storage APIs such as
 * `localStorage` and `sessionStorage`, but can also be implemented
 * by custom storage solutions.
 *
 * @interface StorageLike
 */
interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

/**
 * Provides reactive theme management for Vue applications.
 *
 * Allows switching between multiple themes, persisting the selected theme in storage,
 * and applying theme-specific classes and data attributes to the document root.
 *
 * @param options - Configuration options for theme management.
 * @param options.defaultTheme - The default theme name to use if none is set or detected.
 * @param options.available - An array of available theme names.
 * @param options.themes - An object mapping theme names to their configuration (class, dataTheme, etc.).
 * @param options.key - The storage key used to persist the selected theme. Defaults to 'theme'.
 * @param options.storage - The storage mechanism to use: 'local', 'session', 'none', or a custom StorageLike object. Defaults to 'local'.
 * @param options.detectTheme - Optional function to detect the preferred theme (e.g., based on system settings).
 *
 * @returns An object containing:
 * - `theme`: A ref holding the current theme name.
 * - `themes`: The array of available theme names.
 * - `setTheme`: Function to set the current theme.
 * - `toggleTheme`: Function to cycle to the next available theme.
 *
 * @example
 * ```ts
 * const { theme, setTheme, toggleTheme } = useTheme({
 *   available: ['light', 'dark'],
 *   themes: {
 *     light: { class: 'theme-light', dataTheme: 'light' },
 *     dark: { class: 'theme-dark', dataTheme: 'dark' }
 *   }
 * });
 * ```
 */
export function useTheme(options: ThemeOptions) {
  const {
    defaultTheme = options.available[0],
    available,
    themes = {},
    key = 'theme',
    storage = 'local',
    detectTheme,
  } = options;

  const resolvedStorage: StorageLike | null =
    storage === 'local'
      ? localStorage
      : storage === 'session'
      ? sessionStorage
      : storage === 'none'
      ? null
      : storage;

  const theme = ref<ThemeName>(defaultTheme);

  /**
   * Applies the specified theme to the document by updating the root element's class and data-theme attribute.
   *
   * This function removes all previously applied theme classes from the document's root element,
   * then adds the new theme's class (if defined) and sets or removes the `data-theme` attribute accordingly.
   *
   * @param name - The name of the theme to apply.
   */
  const _applyTheme = (name: ThemeName) => {
    const config = themes[name];
    const el = document.documentElement;

    Object.values(themes).forEach(({ class: cls }) => {
      if (cls) el.classList.remove(cls);
    });

    if (config?.class) el.classList.add(config.class);
    if (config?.dataTheme) el.setAttribute('data-theme', config.dataTheme);
    else el.removeAttribute('data-theme');
  };

  /**
   * Sets the current theme to the specified value if it is available and different from the current theme.
   * Applies the new theme and persists the selection in storage.
   *
   * @param value - The name of the theme to set.
   */
  const setTheme = (value: ThemeName) => {
    if (!available.includes(value)) return;
    if (theme.value === value) return;
    theme.value = value;
    _applyTheme(value);
    resolvedStorage?.setItem(key, value);
  };

  /**
   * Toggles the current theme to the next available theme in the list.
   *
   * Finds the index of the current theme in the `available` array,
   * then sets the theme to the next one in the array, cycling back to the start if necessary.
   *
   * @remarks
   * This function assumes that `theme.value` holds the current theme,
   * `available` is an array of theme names, and `setTheme` is a function to update the theme.
   */
  const toggleTheme = () => {
    const currentIndex = available.indexOf(theme.value);
    const nextIndex = (currentIndex + 1) % available.length;
    setTheme(available[nextIndex]);
  };

  onMounted(() => {
    const stored = resolvedStorage?.getItem(key);
    const isValid = stored && available.includes(stored);

    // Détecte un thème à appliquer en automatique, si la fonction detectTheme est fournie
    const detected = !isValid && detectTheme ? detectTheme() : null;

    const initial = isValid
      ? stored!
      : detected && available.includes(detected)
      ? detected
      : defaultTheme;

    setTheme(initial);
  });

  return {
    theme,
    themes: available,
    setTheme,
    toggleTheme,
  };
}
