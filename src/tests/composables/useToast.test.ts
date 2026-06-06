/**
 * ToolsAulia - useToast Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useToast, useToastKey } from '../../composables/useToast';

describe('useToast', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  describe('show()', () => {
    it('should call window.showToast with translated message', () => {
      const { show } = useToast();
      
      show('test message', 'success');
      
      expect(window.showToast).toHaveBeenCalledWith('test message', 'success');
    });

    it('should use window._tToast for translation when available', () => {
      window._tToast = (key: string) => `translated: ${key}`;
      const { show } = useToast();
      
      show('test key', 'info');
      
      expect(window.showToast).toHaveBeenCalledWith('translated: test key', 'info');
      
      // Reset
      window._tToast = null;
    });

    it('should default to success type', () => {
      const { show } = useToast();
      
      show('test');
      
      expect(window.showToast).toHaveBeenCalledWith('test', 'success');
    });
  });

  describe('success()', () => {
    it('should call show with success type', () => {
      const { success } = useToast();
      
      success('Operation completed');
      
      expect(window.showToast).toHaveBeenCalledWith('Operation completed', 'success');
    });
  });

  describe('error()', () => {
    it('should call show with error type', () => {
      const { error } = useToast();
      
      error('Something went wrong');
      
      expect(window.showToast).toHaveBeenCalledWith('Something went wrong', 'error');
    });
  });

  describe('warning()', () => {
    it('should call show with warning type', () => {
      const { warning } = useToast();
      
      warning('Please be careful');
      
      expect(window.showToast).toHaveBeenCalledWith('Please be careful', 'warning');
    });
  });

  describe('info()', () => {
    it('should call show with info type', () => {
      const { info } = useToast();
      
      info('Here is some information');
      
      expect(window.showToast).toHaveBeenCalledWith('Here is some information', 'info');
    });
  });
});

describe('useToastKey', () => {
  it('should use window._tToast to translate key before showing toast', () => {
    window._tToast = (key: string) => `Translated: ${key}`;
    
    const { showKey } = useToastKey();
    
    showKey('msg.success', 'success');
    
    expect(window.showToast).toHaveBeenCalledWith('Translated: msg.success', 'success');
    
    // Reset
    window._tToast = null;
  });

  it('should fall back to key if _tToast is not available', () => {
    window._tToast = null;
    
    const { success } = useToastKey();
    
    success('fallback_key');
    
    expect(window.showToast).toHaveBeenCalledWith('fallback_key', 'success');
  });
});