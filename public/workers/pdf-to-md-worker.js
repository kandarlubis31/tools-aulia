// Load worker bundle dulu agar pdfjsLib tidak spawn nested worker
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
// Load main bundle
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');

// Set workerSrc ke blob kosong - mencegah pdf.js spawn nested worker
const fakeWorkerBlob = new Blob(['self.onmessage=()=>{}'], { type: 'application/javascript' });
pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(fakeWorkerBlob);

self.onmessage = async function(e) {
  try {
    const { fileData, fileName } = e.data;

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
          if (currentLine.trim()) pageLines.push(currentLine.trim());
          currentLine = item.str;
        } else {
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

      const formattedLines = pageLines.map(line => {
        if (line.length < 60 && line === line.toUpperCase() && line.length > 3) {
          return `### ${line}`;
        }
        return line;
      });

      fullMarkdown += `## Halaman ${i}\n\n${formattedLines.join('\n')}\n\n---\n\n`;
    }

    self.postMessage({ type: 'done', result: fullMarkdown });

  } catch (err) {
    self.postMessage({ type: 'error', error: err.message });
  }
};