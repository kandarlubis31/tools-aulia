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
    let fullText = '';

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

      fullText += pageLines.join('\n') + '\n\n';
    }

    self.postMessage({ type: 'done', result: fullText.trim() });

  } catch (err) {
    self.postMessage({ type: 'error', error: err.message });
  }
};
