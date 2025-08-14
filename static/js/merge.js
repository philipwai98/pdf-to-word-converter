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

document.getElementById('mergeBtn').addEventListener('click', async () => {
  const input = document.getElementById('mergeFiles');
  const status = document.getElementById('mergeStatus');
  status.textContent = '';
  const files = Array.from(input.files || []);
  if (!files.length) return alert('Select PDF files to merge.');

  try {
    status.textContent = 'Merging...';
    const mergedPdf = await PDFLib.PDFDocument.create();
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
      const copied = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copied.forEach(p => mergedPdf.addPage(p));
    }
    const mergedBytes = await mergedPdf.save();
    downloadBytes(mergedBytes, 'merged.pdf');
    status.textContent = 'Done — downloaded merged.pdf';
  } catch (e) {
    console.error(e);
    status.textContent = 'Error: ' + (e.message || e);
  }
});
