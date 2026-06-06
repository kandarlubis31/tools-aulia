/**
 * ToolsAulia - Type Definitions
 * TypeScript interfaces for the plugin-based tool registry architecture
 */

// ==================== THEME TYPES ====================

export type ThemeColor =
  | 'blue'
  | 'red'
  | 'green'
  | 'amber'
  | 'violet'
  | 'rose'
  | 'sky'
  | 'emerald'
  | 'orange'
  | 'pink'
  | 'slate'
  | 'teal'
  | 'purple'
  | 'cyan'
  | 'indigo';

export type ThemeMode = 'light' | 'dark' | 'system';

// ==================== TRANSLATION TYPES ====================

export interface TranslationValue {
  id: string;
  en: string;
}

export type TranslationMap = Record<string, TranslationValue>;

// ==================== TOOL TYPES ====================

export interface ToolAction {
  id: string;
  nameKey: string;
  icon?: string;
  handler: () => void | Promise<void>;
}

export interface ToolFile {
  name: string;
  size: number;
  type: string;
  pageCount?: number;
}

export interface ToolResult {
  success: boolean;
  message: string;
  data?: unknown;
  filename?: string;
  blob?: Blob;
}

// Astro component lazy loader type
export type LazyComponent<T = unknown> = () => Promise<{ default: T }>;

export interface ToolDefinition {
  /** Unique identifier for the tool (e.g., 'pdf-merge', 'json-formatter') */
  id: string;
  /** Category ID (e.g., 'pdf', 'dev', 'image') */
  categoryId: string;
  /** i18n key for the tool title */
  nameKey: string;
  /** i18n key for the tool description */
  descKey: string;
  /** SVG path data for the icon */
  icon: string;
  /** Theme color for the tool card */
  color: ThemeColor;
  /** Dynamic import path for the tool component */
  importPath?: string;
  /** Whether the tool is in development */
  isSoon?: boolean;
  /** Sort order within category */
  order?: number;
  /** URL path for the tool page */
  path?: string;
}

// ==================== CATEGORY TYPES ====================

export interface ToolCategory {
  id: string;
  nameKey: string;
  icon: string;
  descriptionKey?: string;
  color: ThemeColor;
  tools: ToolDefinition[];
  order?: number;
}

// ==================== TOOL REGISTRY ====================

export interface ToolRegistryConfig {
  categories: ToolCategory[];
  tools: ToolDefinition[];
  version: string;
}

// ==================== COMPOSABLE TYPES ====================

// Toast System
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

// File Handler
export interface FileHandlerOptions {
  accept: string | string[];
  multiple?: boolean;
  maxSize?: number; // in bytes
  onFilesSelected?: (files: File[]) => void;
  onError?: (error: string) => void;
}

export interface DropZoneHandlers {
  onDragOver?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent, files: File[]) => void;
}

// Progress Tracker
export interface ProgressState {
  current: number;
  total: number;
  percent: number;
  isComplete: boolean;
}

// Clipboard
export interface ClipboardResult {
  success: boolean;
  message: string;
}

// ==================== i18n TYPES ====================

export type SupportedLanguage = 'id' | 'en';

export interface I18nConfig {
  currentLang: SupportedLanguage;
  translations: TranslationMap;
}

export interface TranslationFunction {
  (key: string, fallback?: string): string;
}

// ==================== PWA TYPES ====================

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  icons: PWAIcon[];
}

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
}

// ==================== SEARCH TYPES ====================

export interface SearchableTool {
  id: string;
  title: string;
  titleLower: string;
  description: string;
  category: string;
  path: string;
}

export interface SearchResult {
  tools: SearchableTool[];
  query: string;
  totalResults: number;
}

// ==================== UTILITY TYPES ====================

export interface KeyValuePair<T = string> {
  key: string;
  value: T;
}

export interface NameValuePair extends KeyValuePair {
  nameKey: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  direction: SortDirection;
}