// Gunakan CDN agar otomatis di-cache oleh PWA
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

self.onmessage = async function(e) {
  try {
    const { fileData, fileName } = e.data;
    const pdf = await pdfjsLib.getDocument({ data: fileData }).promise;
    let fullMarkdown = `# ${fileName.replace('.pdf', '')}\n\n`;

    for (let i = 1; i <= pdf.numPages; i++) {
      self.postMessage({ type: 'progress', current: i, total: pdf.numPages });
      
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      let lastY;
      let pageText = '';
      
      textContent.items.forEach(item => {
        if (lastY !== item.transform[5] && lastY !== undefined) pageText += '\n';
        pageText += item.str;
        lastY = item.transform[5];
      });

      fullMarkdown += `## Halaman ${i}\n\n${pageText}\n\n---\n\n`;
    }

    self.postMessage({ type: 'done', result: fullMarkdown });
  } catch (err) {
    self.postMessage({ type: 'error', error: err.message });
  }
};