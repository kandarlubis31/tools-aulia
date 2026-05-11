// Gunakan legacy build - tidak butuh document object
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');

// Override workerSrc dengan fake worker agar tidak load worker lagi di dalam worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

self.onmessage = async function(e) {
  try {
    const { fileData, fileName } = e.data;

    // Disable external worker - run in same thread
    const loadingTask = pdfjsLib.getDocument({
      data: fileData,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const baseName = fileName.replace(/\.pdf$/i, '');
    let fullMarkdown = `# ${baseName}\n\n`;

    for (let i = 1; i <= pdf.numPages; i++) {
      self.postMessage({ type: 'progress', current: i, total: pdf.numPages });

      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      let lastY = null;
      let lastX = null;
      let pageLines = [];
      let currentLine = '';

      textContent.items.forEach(item => {
        if (!item.str) return;

        const y = Math.round(item.transform[5]);
        const x = Math.round(item.transform[4]);

        if (lastY !== null && Math.abs(y - lastY) > 5) {
          // New line
          if (currentLine.trim()) pageLines.push(currentLine.trim());
          currentLine = item.str;
        } else {
          // Same line - check if there's a gap (space between words)
          if (lastX !== null && x - lastX > 3) {
            currentLine += ' ' + item.str;
          } else {
            currentLine += item.str;
          }
        }

        lastY = y;
        lastX = x + (item.width || 0);
      });

      if (currentLine.trim()) pageLines.push(currentLine.trim());

      // Heuristic: detect headings (short lines, all caps or large font)
      const formattedLines = pageLines.map(line => {
        if (line.length < 60 && line === line.toUpperCase() && line.length > 3) {
          return `### ${line}`;
        }
        return line;
      });

      const pageText = formattedLines.join('\n');
      fullMarkdown += `## Halaman ${i}\n\n${pageText}\n\n---\n\n`;
    }

    self.postMessage({ type: 'done', result: fullMarkdown });

  } catch (err) {
    self.postMessage({ type: 'error', error: err.message });
  }
};