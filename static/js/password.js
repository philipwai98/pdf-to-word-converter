document.getElementById('protectBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('passwordFile');
  const pwInput = document.getElementById('passwordText');
  const status = document.getElementById('passwordStatus');
  status.textContent = '';

  if (!fileInput.files[0]) return alert('Pick a PDF first.');
  if (!pwInput.value) return alert('Enter a password.');

  // This is a placeholder: reliable client-side PDF encryption requires a WASM qpdf build
  // or server-side qpdf. See README included with this package for instructions to enable qpdf-wasm.
  status.textContent = 'Password protection requires qpdf-wasm or server-side qpdf. See README for setup instructions.';
});
