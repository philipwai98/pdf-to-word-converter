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

document.getElementById('splitBtn').addEventListener('click', async () => {
  const input = document.getElementById('splitFile');
  const status = document.getElementById('splitStatus');
  status.textContent = '';
  const file = input.files[0];
  if (!file) return alert('Pick a PDF file first.');

  try {
    status.textContent = 'Loading PDF...';
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const total = pdfDoc.getPageCount();
    status.textContent = `Splitting ${total} pages...`;

    for (let i = 0; i < total; i++) {
      const newDoc = await PDFLib.PDFDocument.create();
      const [copied] = await newDoc.copyPages(pdfDoc, [i]);
      newDoc.addPage(copied);
      const bytes = await newDoc.save();
      downloadBytes(bytes, `page-${i+1}.pdf`);
    }
    status.textContent = 'Done — each page downloaded separately.';
  } catch (e) {
    console.error(e);
    status.textContent = 'Error: ' + (e.message || e);
  }
});
