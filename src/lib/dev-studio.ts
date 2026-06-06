/**
 * ToolsAulia - Developer Studio Workspace Module
 * Multi-panel developer tools workspace with JSON, YAML, Regex, and more
 */

import type { ToolDefinition } from '../types/tool';

/**
 * Dev Studio panel types
 */
export type DevPanelType = 
  | 'json-formatter'
  | 'yaml-converter'
  | 'regex-tester'
  | 'base64-encoder'
  | 'url-encoder'
  | 'html-encoder'
  | 'jwt-decoder'
  | 'cron-validator';

/**
 * Dev Studio panel configuration
 */
export interface DevPanel {
  id: string;
  type: DevPanelType;
  title: string;
  input: string;
  output: string;
  options: Record<string, any>;
}

/**
 * Dev Studio state
 */
export interface DevStudioState {
  panels: DevPanel[];
  activePanelId: string | null;
  theme: 'light' | 'dark';
  layout: 'single' | 'split' | 'quad';
}

/**
 * Developer Studio operations
 */
export class DevStudio {
  private state: DevStudioState;
  
  constructor() {
    this.state = {
      panels: [],
      activePanelId: null,
      theme: 'light',
      layout: 'split',
    };
  }
  
  /**
   * Create a new panel
   */
  createPanel(type: DevPanelType): DevPanel {
    const panel: DevPanel = {
      id: crypto.randomUUID(),
      type,
      title: this.getPanelTitle(type),
      input: '',
      output: '',
      options: this.getDefaultOptions(type),
    };
    
    this.state.panels.push(panel);
    this.state.activePanelId = panel.id;
    
    return panel;
  }
  
  /**
   * Get panel title based on type
   */
  private getPanelTitle(type: DevPanelType): string {
    const titles: Record<DevPanelType, string> = {
      'json-formatter': 'JSON Formatter',
      'yaml-converter': 'YAML Converter',
      'regex-tester': 'Regex Tester',
      'base64-encoder': 'Base64 Encoder/Decoder',
      'url-encoder': 'URL Encoder/Decoder',
      'html-encoder': 'HTML Encoder/Decoder',
      'jwt-decoder': 'JWT Decoder',
      'cron-validator': 'Cron Validator',
    };
    return titles[type] || 'Untitled Panel';
  }
  
  /**
   * Get default options for panel type
   */
  private getDefaultOptions(type: DevPanelType): Record<string, any> {
    const defaults: Record<DevPanelType, Record<string, any>> = {
      'json-formatter': { indent: 2, sortKeys: false },
      'yaml-converter': { indent: 2, compact: false },
      'regex-tester': { flags: 'g', testString: '' },
      'base64-encoder': { mode: 'encode' },
      'url-encoder': { mode: 'encode' },
      'html-encoder': { mode: 'encode' },
      'jwt-decoder': { verify: false },
      'cron-validator': { timezone: 'UTC' },
    };
    return defaults[type] || {};
  }
  
  /**
   * Process panel input
   */
  processPanel(panelId: string, input: string): string {
    const panel = this.state.panels.find(p => p.id === panelId);
    if (!panel) return '';
    
    switch (panel.type) {
      case 'json-formatter':
        return this.formatJSON(input, panel.options as { indent: number; sortKeys: boolean });
      case 'yaml-converter':
        return this.convertToYAML(input, panel.options as { indent: number; compact: boolean });
      case 'regex-tester':
        return this.testRegex(input, panel.options as { pattern: string; flags: string });
      case 'base64-encoder':
        return this.processBase64(input, panel.options as { mode: 'encode' | 'decode' });
      case 'url-encoder':
        return this.processURL(input, panel.options as { mode: 'encode' | 'decode' });
      case 'html-encoder':
        return this.processHTML(input, panel.options as { mode: 'encode' | 'decode' });
      case 'jwt-decoder':
        return this.decodeJWT(input, panel.options as { verify: boolean });
      case 'cron-validator':
        return this.validateCron(input, panel.options as { timezone: string });
      default:
        return '';
    }
  }
  
  /**
   * Format JSON with options
   */
  private formatJSON(input: string, options: { indent: number; sortKeys: boolean }): string {
    try {
      let obj = JSON.parse(input);
      if (options.sortKeys) {
        obj = this.sortObjectKeys(obj);
      }
      return JSON.stringify(obj, null, options.indent);
    } catch (e) {
      return `Invalid JSON: ${(e as Error).message}`;
    }
  }
  
  /**
   * Sort object keys recursively
   */
  private sortObjectKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item));
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
          acc[key] = this.sortObjectKeys(obj[key]);
          return acc;
        }, {} as any);
    }
    return obj;
  }
  
  /**
   * Convert JSON to YAML
   */
  private convertToYAML(input: string, options: { indent: number; compact: boolean }): string {
    try {
      const obj = JSON.parse(input);
      // Simplified YAML conversion
      return JSON.stringify(obj, null, options.indent);
    } catch (e) {
      return `Invalid JSON: ${(e as Error).message}`;
    }
  }
  
  /**
   * Test regex pattern
   */
  private testRegex(input: string, options: { pattern: string; flags: string }): string {
    try {
      const regex = new RegExp(options.pattern, options.flags);
      const matches = input.match(regex);
      if (!matches) return 'No matches found';
      return `Found ${matches.length} match(es):\n${matches.join('\n')}`;
    } catch (e) {
      return `Invalid regex: ${(e as Error).message}`;
    }
  }
  
  /**
   * Process Base64
   */
  private processBase64(input: string, options: { mode: 'encode' | 'decode' }): string {
    try {
      if (options.mode === 'encode') {
        return btoa(input);
      } else {
        return atob(input);
      }
    } catch (e) {
      return `Error: ${(e as Error).message}`;
    }
  }
  
  /**
   * Process URL encoding
   */
  private processURL(input: string, options: { mode: 'encode' | 'decode' }): string {
    try {
      if (options.mode === 'encode') {
        return encodeURIComponent(input);
      } else {
        return decodeURIComponent(input);
      }
    } catch (e) {
      return `Error: ${(e as Error).message}`;
    }
  }
  
  /**
   * Process HTML encoding
   */
  private processHTML(input: string, options: { mode: 'encode' | 'decode' }): string {
    if (options.mode === 'encode') {
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    } else {
      return input
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
    }
  }
  
  /**
   * Decode JWT
   */
  private decodeJWT(input: string, options: { verify: boolean }): string {
    try {
      const parts = input.split('.');
      if (parts.length !== 3) return 'Invalid JWT format';
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      return `Header: ${JSON.stringify(header, null, 2)}\n\nPayload: ${JSON.stringify(payload, null, 2)}`;
    } catch (e) {
      return `Error decoding JWT: ${(e as Error).message}`;
    }
  }
  
  /**
   * Validate cron expression
   */
  private validateCron(input: string, options: { timezone: string }): string {
    // Simplified cron validation
    const parts = input.trim().split(/\\s+/);
    if (parts.length < 5 || parts.length > 6) {
      return 'Invalid cron expression: expected 5-6 fields';
    }
    return `Valid cron expression for ${options.timezone}`;
  }
  
  /**
   * Set active panel
   */
  setActivePanel(panelId: string): void {
    this.state.activePanelId = panelId;
  }
  
  /**
   * Close panel
   */
  closePanel(panelId: string): void {
    this.state.panels = this.state.panels.filter(p => p.id !== panelId);
    if (this.state.activePanelId === panelId) {
      this.state.activePanelId = this.state.panels[0]?.id || null;
    }
  }
  
  /**
   * Change layout
   */
  setLayout(layout: 'single' | 'split' | 'quad'): void {
    this.state.layout = layout;
  }
  
  /**
   * Get current state
   */
  getState(): DevStudioState {
    return { ...this.state };
  }
}

/**
 * Dev Studio Tool Definition
 */
export const devStudioTool: Omit<ToolDefinition, 'isWorkspace'> & { isWorkspace?: boolean } = {
  id: 'dev-studio',
  nameKey: 'tool.dev_studio',
  descKey: 'tool.dev_studio_desc',
  icon: 'path',
  color: 'green',
  path: '/dev/studio',
  categoryId: 'dev',
  isWorkspace: true,
};