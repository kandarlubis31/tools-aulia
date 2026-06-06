/**
 * ToolsAulia - Tool Registry
 * Central configuration for all tools in the application
 */

import type { ToolDefinition, ToolCategory, ToolRegistryConfig } from '../types/tool';

// ==================== TOOL DEFINITIONS ====================

export const tools: ToolDefinition[] = [
  // PDF Tools
  { id: 'pdf-merge', categoryId: 'pdf', nameKey: 'tool.merge', descKey: 'tool.merge_desc', icon: 'path', color: 'red', path: '/pdf/merge' },
  { id: 'pdf-split', categoryId: 'pdf', nameKey: 'tool.split', descKey: 'tool.split_desc', icon: 'path', color: 'orange', path: '/pdf/split' },
  { id: 'pdf-compress', categoryId: 'pdf', nameKey: 'tool.compress', descKey: 'tool.compress_desc', icon: 'path', color: 'emerald', path: '/pdf/compress' },
  { id: 'pdf-delete', categoryId: 'pdf', nameKey: 'tool.delete_pages', descKey: 'tool.delete_pages_desc', icon: 'path', color: 'rose', path: '/pdf/delete' },
  { id: 'pdf-extract', categoryId: 'pdf', nameKey: 'tool.extract', descKey: 'tool.extract_desc', icon: 'path', color: 'violet', path: '/pdf/extract' },
  { id: 'pdf-rotate', categoryId: 'pdf', nameKey: 'tool.rotate', descKey: 'tool.rotate_desc', icon: 'path', color: 'sky', path: '/pdf/rotate' },
  { id: 'pdf-grayscale', categoryId: 'pdf', nameKey: 'tool.grayscale', descKey: 'tool.grayscale_desc', icon: 'path', color: 'slate', path: '/pdf/grayscale' },
  { id: 'pdf-watermark', categoryId: 'pdf', nameKey: 'tool.watermark', descKey: 'tool.watermark_desc', icon: 'path', color: 'amber', path: '/pdf/watermark' },
  { id: 'pdf-sign', categoryId: 'pdf', nameKey: 'tool.sign', descKey: 'tool.sign_desc', icon: 'path', color: 'blue', path: '/pdf/sign' },
  { id: 'pdf-page-numbers', categoryId: 'pdf', nameKey: 'tool.page_numbers', descKey: 'tool.page_numbers_desc', icon: 'path', color: 'green', path: '/pdf/page-numbers' },
  { id: 'pdf-reorder', categoryId: 'pdf', nameKey: 'tool.reorder', descKey: 'tool.reorder_desc', icon: 'path', color: 'teal', path: '/pdf/reorder' },
  { id: 'pdf-metadata', categoryId: 'pdf', nameKey: 'tool.metadata', descKey: 'tool.metadata_desc', icon: 'path', color: 'purple', path: '/pdf/metadata' },
  { id: 'pdf-to-jpg', categoryId: 'pdf', nameKey: 'tool.to_jpg', descKey: 'tool.to_jpg_desc', icon: 'path', color: 'pink', path: '/pdf/to-jpg' },
  { id: 'pdf-jpg-to-pdf', categoryId: 'pdf', nameKey: 'tool.jpg_to_pdf', descKey: 'tool.jpg_to_pdf_desc', icon: 'path', color: 'cyan', path: '/pdf/jpg-to-pdf' },
  { id: 'pdf-to-ppt', categoryId: 'pdf', nameKey: 'tool.to_ppt', descKey: 'tool.to_ppt_desc', icon: 'path', color: 'orange', path: '/pdf/to-ppt' },
  { id: 'pdf-html-to-pdf', categoryId: 'pdf', nameKey: 'tool.html_to_pdf', descKey: 'tool.html_to_pdf_desc', icon: 'path', color: 'indigo', path: '/pdf/html-to-pdf' },

  // Image Tools
  { id: 'image-compressor', categoryId: 'image', nameKey: 'tool.compressor', descKey: 'tool.compressor_desc', icon: 'path', color: 'emerald', path: '/image/compressor' },
  { id: 'image-converter', categoryId: 'image', nameKey: 'tool.converter', descKey: 'tool.converter_desc', icon: 'path', color: 'blue', path: '/image/converter' },
  { id: 'image-color', categoryId: 'image', nameKey: 'tool.color_picker', descKey: 'tool.color_picker_desc', icon: 'path', color: 'pink', path: '/image/color' },
  { id: 'image-editor', categoryId: 'image', nameKey: 'tool.editor', descKey: 'tool.editor_desc', icon: 'path', color: 'violet', path: '/image/editor' },
  { id: 'image-html-to-img', categoryId: 'image', nameKey: 'tool.html_to_image', descKey: 'tool.html_to_image_desc', icon: 'path', color: 'amber', path: '/image/html-to-img' },

  // Developer Tools
  { id: 'dev-base64', categoryId: 'dev', nameKey: 'tool.base64', descKey: 'tool.base64_desc', icon: 'path', color: 'sky', path: '/dev/base64' },
  { id: 'dev-json', categoryId: 'dev', nameKey: 'tool.json', descKey: 'tool.json_desc', icon: 'path', color: 'amber', path: '/dev/json' },
  { id: 'dev-url', categoryId: 'dev', nameKey: 'tool.url', descKey: 'tool.url_desc', icon: 'path', color: 'green', path: '/dev/url' },
  { id: 'dev-cron', categoryId: 'dev', nameKey: 'tool.cron', descKey: 'tool.cron_desc', icon: 'path', color: 'violet', path: '/dev/cron' },
  { id: 'dev-diff', categoryId: 'dev', nameKey: 'tool.diff', descKey: 'tool.diff_desc', icon: 'path', color: 'rose', path: '/dev/diff' },
  { id: 'dev-markdown', categoryId: 'dev', nameKey: 'tool.markdown', descKey: 'tool.markdown_desc', icon: 'path', color: 'slate', path: '/dev/markdown' },
  { id: 'dev-css-shadow', categoryId: 'dev', nameKey: 'tool.css_shadow', descKey: 'tool.css_shadow_desc', icon: 'path', color: 'purple', path: '/dev/css-shadow' },
  { id: 'dev-my-ip', categoryId: 'dev', nameKey: 'tool.my_ip', descKey: 'tool.my_ip_desc', icon: 'path', color: 'cyan', path: '/dev/my-ip' },
  { id: 'dev-proxy', categoryId: 'dev', nameKey: 'tool.proxy', descKey: 'tool.proxy_desc', icon: 'path', color: 'orange', path: '/dev/proxy' },
  { id: 'dev-timestamp', categoryId: 'dev', nameKey: 'tool.timestamp', descKey: 'tool.timestamp_desc', icon: 'path', color: 'blue', path: '/dev/timestamp' },

  // Calculator Tools
  { id: 'calc-age', categoryId: 'calc', nameKey: 'tool.age', descKey: 'tool.age_desc', icon: 'path', color: 'violet', path: '/calc/age' },
  { id: 'calc-bmi', categoryId: 'calc', nameKey: 'tool.bmi', descKey: 'tool.bmi_desc', icon: 'path', color: 'emerald', path: '/calc/bmi' },
  { id: 'calc-currency', categoryId: 'calc', nameKey: 'tool.currency', descKey: 'tool.currency_desc', icon: 'path', color: 'amber', path: '/calc/currency' },
  { id: 'calc-unit', categoryId: 'calc', nameKey: 'tool.unit', descKey: 'tool.unit_desc', icon: 'path', color: 'blue', path: '/calc/unit' },
  { id: 'calc-number', categoryId: 'calc', nameKey: 'tool.number', descKey: 'tool.number_desc', icon: 'path', color: 'green', path: '/calc/number' },
  { id: 'calc-percentage', categoryId: 'calc', nameKey: 'tool.percentage', descKey: 'tool.percentage_desc', icon: 'path', color: 'pink', path: '/calc/percentage' },
  { id: 'calc-case', categoryId: 'calc', nameKey: 'tool.case', descKey: 'tool.case_desc', icon: 'path', color: 'sky', path: '/calc/case' },

  // Security Tools
  { id: 'security-hash', categoryId: 'security', nameKey: 'tool.hash', descKey: 'tool.hash_desc', icon: 'path', color: 'red', path: '/security/hash' },
  { id: 'security-password', categoryId: 'security', nameKey: 'tool.password', descKey: 'tool.password_desc', icon: 'path', color: 'emerald', path: '/security/password' },
  { id: 'security-uuid', categoryId: 'security', nameKey: 'tool.uuid', descKey: 'tool.uuid_desc', icon: 'path', color: 'violet', path: '/security/uuid' },

  // File Tools
  { id: 'file-csv-json', categoryId: 'file', nameKey: 'tool.csv_json', descKey: 'tool.csv_json_desc', icon: 'path', color: 'amber', path: '/file/csv-json' },
  { id: 'file-pdf-to-md', categoryId: 'file', nameKey: 'tool.pdf_to_md', descKey: 'tool.pdf_to_md_desc', icon: 'path', color: 'rose', path: '/file/pdf-to-md' },

  // Utility Tools
  { id: 'utils-qr', categoryId: 'utils', nameKey: 'tool.qr', descKey: 'tool.qr_desc', icon: 'path', color: 'violet', path: '/utils/qr' },
  { id: 'utils-todo', categoryId: 'utils', nameKey: 'tool.todo', descKey: 'tool.todo_desc', icon: 'path', color: 'sky', path: '/utils/todo' },
  { id: 'utils-stopwatch', categoryId: 'utils', nameKey: 'tool.stopwatch', descKey: 'tool.stopwatch_desc', icon: 'path', color: 'cyan', path: '/utils/stopwatch' },
  { id: 'utils-pomodoro', categoryId: 'utils', nameKey: 'tool.pomodoro', descKey: 'tool.pomodoro_desc', icon: 'path', color: 'red', path: '/utils/pomodoro' },
  { id: 'utils-word-counter', categoryId: 'utils', nameKey: 'tool.word_counter', descKey: 'tool.word_counter_desc', icon: 'path', color: 'emerald', path: '/utils/word-counter' },
  { id: 'utils-brainstorm', categoryId: 'utils', nameKey: 'tool.brainstorm', descKey: 'tool.brainstorm_desc', icon: 'path', color: 'amber', path: '/utils/brainstorm' },
  { id: 'utils-jokes', categoryId: 'utils', nameKey: 'tool.jokes', descKey: 'tool.jokes_desc', icon: 'path', color: 'pink', path: '/utils/jokes' },
  { id: 'utils-motivation', categoryId: 'utils', nameKey: 'tool.motivation', descKey: 'tool.motivation_desc', icon: 'path', color: 'violet', path: '/utils/motivation' },
  { id: 'utils-lorem', categoryId: 'utils', nameKey: 'tool.lorem', descKey: 'tool.lorem_desc', icon: 'path', color: 'slate', path: '/utils/lorem' },
  { id: 'utils-wa-builder', categoryId: 'utils', nameKey: 'tool.wa_builder', descKey: 'tool.wa_builder_desc', icon: 'path', color: 'green', path: '/utils/wa-builder' },
];

// ==================== CATEGORY DEFINITIONS ====================

export const categories: ToolCategory[] = [
  {
    id: 'pdf',
    nameKey: 'category.pdf',
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    descriptionKey: 'category.pdf_desc',
    color: 'red',
    tools: tools.filter(t => t.categoryId === 'pdf'),
    order: 1,
  },
  {
    id: 'image',
    nameKey: 'category.image',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14',
    descriptionKey: 'category.image_desc',
    color: 'emerald',
    tools: tools.filter(t => t.categoryId === 'image'),
    order: 2,
  },
  {
    id: 'dev',
    nameKey: 'category.dev',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    descriptionKey: 'category.dev_desc',
    color: 'amber',
    tools: tools.filter(t => t.categoryId === 'dev'),
    order: 3,
  },
  {
    id: 'calc',
    nameKey: 'category.calc',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    descriptionKey: 'category.calc_desc',
    color: 'violet',
    tools: tools.filter(t => t.categoryId === 'calc'),
    order: 4,
  },
  {
    id: 'security',
    nameKey: 'category.security',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    descriptionKey: 'category.security_desc',
    color: 'rose',
    tools: tools.filter(t => t.categoryId === 'security'),
    order: 5,
  },
  {
    id: 'file',
    nameKey: 'category.file',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    descriptionKey: 'category.file_desc',
    color: 'sky',
    tools: tools.filter(t => t.categoryId === 'file'),
    order: 6,
  },
  {
    id: 'utils',
    nameKey: 'category.utils',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    descriptionKey: 'category.utils_desc',
    color: 'orange',
    tools: tools.filter(t => t.categoryId === 'utils'),
    order: 7,
  },
];

// ==================== REGISTRY CONFIG ====================

export const registry: ToolRegistryConfig = {
  categories,
  tools,
  version: '1.0.0',
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get a tool by its ID
 */
export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find(tool => tool.id === id);
}

/**
 * Get all tools in a category
 */
export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  return tools.filter(tool => tool.categoryId === categoryId);
}

/**
 * Get a category by its ID
 */
export function getCategoryById(id: string): ToolCategory | undefined {
  return categories.find(cat => cat.id === id);
}

/**
 * Search tools by query
 */
export function searchTools(query: string): ToolDefinition[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  return tools.filter(tool => {
    const name = tool.nameKey.toLowerCase();
    const desc = tool.descKey.toLowerCase();
    return name.includes(lowerQuery) || desc.includes(lowerQuery);
  });
}

/**
 * Get all tools as searchable array
 */
export function getSearchableTools() {
  return tools.map(tool => ({
    id: tool.id,
    title: tool.nameKey,
    titleLower: tool.nameKey.toLowerCase(),
    description: tool.descKey,
    category: tool.categoryId,
    path: tool.path || `/${tool.categoryId}/${tool.id}`,
  }));
}

export default registry;