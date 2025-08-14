async function downloadBytes(bytes, filename, mime='application/pdf') {
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1500);
}

// Uses pdf.js for rendering pages into canvas, then re-embeds JPEGs into a new PDF via pdf-lib.
document.getElementById('compressBtn').addEventListener('click', async () => {
  const input = document.getElementById('compressFile');
  const qualityInput = document.getElementById('quality');
  const status = document.getElementById('compressStatus');
  status.textContent = '';
  const file = input.files[0];
  if (!file) return alert('Pick a PDF file first.');

  try {
    status.textContent = 'Loading PDF (pdf.js)...';
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const srcPdf = await loadingTask.promise;
    const outPdf = await PDFLib.PDFDocument.create();
    const quality = parseFloat(qualityInput.value) || 0.7;

    for (let i = 1; i <= srcPdf.numPages; i++) {
      status.textContent = `Rendering page ${i}/${srcPdf.numPages} ...`;
      const page = await srcPdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext('2d');

      await page.render({ canvasContext: ctx, viewport }).promise;
      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
      const arr = await blob.arrayBuffer();
      const jpgImage = await outPdf.embedJpg(arr);
      const pageDims = outPdf.addPage([viewport.width, viewport.height]);
      pageDims.drawImage(jpgImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });
    }

    status.textContent = 'Saving compressed PDF...';
    const outBytes = await outPdf.save();
    downloadBytes(outBytes, 'compressed.pdf');
    status.textContent = 'Done — downloaded compressed.pdf';
  } catch (e) {
    console.error(e);
    status.textContent = 'Error: ' + (e.message || e);
  }
});
