const fileInput = document.getElementById('qr-input-file');
const fileName = document.getElementById('file-name');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const status = document.getElementById('status');
const result = document.getElementById('result');
const decodedText = document.getElementById('decoded-text');
const openLinkBtn = document.getElementById('open-link-btn');

// Check if library loaded
if (typeof Html5Qrcode === 'undefined') {
    showStatus('Error: QR library failed to load. Check your internet connection.', 'error');
}

const html5QrCode = new Html5Qrcode("qr-input-file");

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset UI
    hideElement(result);
    hideElement(openLinkBtn);
    fileName.textContent = file.name;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        showElement(imagePreview);
    };
    reader.readAsDataURL(file);

    // Start scanning
    showStatus('Scanning image...', 'loading');

    try {
        // scanFile(file, showImage) - showImage=true renders to a canvas
        const decodedResult = await html5QrCode.scanFile(file, true);

        showStatus('QR code found!', 'success');
        showElement(result);
        decodedText.textContent = decodedResult;

        // Check if it's a URL and handle auto-redirect
        if (isValidUrl(decodedResult)) {
            showElement(openLinkBtn);
            openLinkBtn.onclick = () => {
                window.location.href = decodedResult;
            };

            // Auto redirect after 1.5s
            setTimeout(() => {
                if (confirm(`Redirect to: ${decodedResult}?`)) {
                    window.location.href = decodedResult;
                }
            }, 1500);
        }

    } catch (err) {
        showStatus(`Error: ${err.message || 'No QR code found in image'}`, 'error');
        hideElement(result);
    }
});

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    showElement(status);
}

function showElement(el) {
    el.classList.remove('hidden');
}

function hideElement(el) {
    el.classList.add('hidden');
}
