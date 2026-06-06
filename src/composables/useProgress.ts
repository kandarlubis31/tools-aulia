/**
 * ToolsAulia - Progress Tracker Composable
 * Consistent progress bar for long-running operations
 */

import type { ProgressState } from '../types/tool';

export function useProgress() {
  let current = 0;
  let total = 0;
  let onProgressUpdate: ((state: ProgressState) => void) | null = null;

  const init = (totalItems: number, callback?: (state: ProgressState) => void) => {
    current = 0;
    total = totalItems;
    onProgressUpdate = callback || null;
    update();
  };

  const update = (increment: number = 1) => {
    current = Math.min(current + increment, total);
    const state = getState();
    onProgressUpdate?.(state);

    // Update DOM elements if they exist
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    const progressText = document.getElementById('progress-text');

    if (progressBar) {
      progressBar.style.width = `${state.percent}%`;
    }
    if (progressPercent) {
      progressPercent.textContent = `${state.percent}%`;
    }
    if (progressText && total > 0) {
      progressText.textContent = `Memproses ${current} dari ${total}...`;
    }
  };

  const getState = (): ProgressState => ({
    current,
    total,
    percent: total > 0 ? Math.round((current / total) * 100) : 0,
    isComplete: current >= total,
  });

  const complete = () => {
    current = total;
    update();
  };

  const reset = () => {
    current = 0;
    total = 0;
    update();
  };

  return {
    init,
    update,
    getState,
    complete,
    reset,
  };
}

/**
 * Creates a progress bar in the DOM
 */
export function createProgressBar(
  container: HTMLElement,
  options: {
    showPercent?: boolean;
    showText?: boolean;
    label?: string;
  } = {}
): { update: (percent: number) => void; setText: (text: string) => void; hide: () => void } {
  const { showPercent = true, showText = true, label = 'Memproses...' } = options;

  container.classList.remove('hidden');
  // Use safe DOM creation to prevent XSS
  const wrapper = document.createElement('div');
  wrapper.className = 'animate-fade-in';
  
  const labelDiv = document.createElement('div');
  labelDiv.className = 'mb-2 flex justify-between text-sm';
  const labelSpan = document.createElement('span');
  labelSpan.className = 'text-slate-600 dark:text-slate-400';
  labelSpan.textContent = label;
  labelDiv.appendChild(labelSpan);
  
  if (showPercent) {
    const percentSpan = document.createElement('span');
    percentSpan.id = 'progress-percent';
    percentSpan.className = 'text-slate-600 dark:text-slate-400';
    percentSpan.textContent = '0%';
    labelDiv.appendChild(percentSpan);
  }
  
  const barContainer = document.createElement('div');
  barContainer.className = 'w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2';
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  bar.className = 'h-2 rounded-full transition-all duration-300 bg-emerald-500';
  bar.style.width = '0%';
  barContainer.appendChild(bar);
  
  // Append in correct order: label -> bar -> text
  wrapper.appendChild(labelDiv);
  wrapper.appendChild(barContainer);
  
  if (showText) {
    const textP = document.createElement('p');
    textP.id = 'progress-text';
    textP.className = 'text-center text-xs text-slate-500 mt-2';
    textP.textContent = 'Memproses...';
    wrapper.appendChild(textP);
  }
  
  container.appendChild(wrapper);

  const progressBar = container.querySelector('#progress-bar') as HTMLElement;
  const progressPercent = container.querySelector('#progress-percent') as HTMLElement;
  const progressText = container.querySelector('#progress-text') as HTMLElement;

  return {
    update: (percent: number) => {
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressPercent) progressPercent.textContent = `${percent}%`;
    },
    setText: (text: string) => {
      if (progressText) progressText.textContent = text;
    },
    hide: () => {
      container.classList.add('hidden');
      container.innerHTML = '';
    },
  };
}