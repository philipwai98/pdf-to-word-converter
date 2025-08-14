async function downloadBlob(blob, filename, mime) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1500);
}

document.getElementById('pdf2wordBtn').addEventListener('click', async () => {
  const input = document.getElementById('pdf2wordFile');
  const status = document.getElementById('pdf2wordStatus');
  status.textContent = '';
  const file = input.files[0];
  if (!file) return alert('Pick a PDF file first.');

  try {
    status.textContent = 'Loading PDF and extracting text...';
    const arrayBuffer = await file.arrayBuffer();
    const loading = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loading.promise;
    let html = '<html><head><meta charset="utf-8"></head><body>';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const txt = await page.getTextContent();
      const pageText = txt.items.map(it => it.str).join(' ');
      html += `<p>${escapeHtml(pageText)}</p>`;
      status.textContent = `Extracted page ${i}/${pdf.numPages}`;
    }
    html += '</body></html>';
    // Create a simple .doc file (Word accepts HTML-based .doc)
    const blob = new Blob([html], { type: 'application/msword' });
    downloadBlob(blob, 'converted.doc', 'application/msword');
    status.textContent = 'Done — downloaded converted.doc (open in Word).';
  } catch (e) {
    console.error(e);
    status.textContent = 'Error: ' + (e.message || e);
  }
});

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); });
}
