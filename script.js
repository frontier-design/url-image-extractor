const input = document.getElementById("input");
const openBtn = document.getElementById("open");
const downloadBtn = document.getElementById("download");
const previewImg = document.getElementById("preview-img");
const preview = document.getElementById("preview");
const statusBar = document.getElementById("status-bar");

function setStatus(msg) {
  statusBar.textContent = msg;
}

function extractUrl(text) {
  const match = text.match(/:url\s*"([^"]+)"/);
  return match ? match[1] : null;
}

function updatePreview() {
  const url = extractUrl(input.value);
  if (url) {
    setStatus("Loading preview...");
    previewImg.src = url;
    previewImg.style.display = "";
    previewImg.onload = () => setStatus("Preview loaded.");
    previewImg.onerror = () => {
      previewImg.style.display = "none";
      previewImg.src = "";
      setStatus("Preview failed to load.");
    };
  } else {
    previewImg.src = "";
    previewImg.style.display = "none";
    setStatus(input.value.trim() ? "No :url \"...\" in input." : "Ready.");
  }
}

previewImg.style.display = "none";
setStatus("Ready.");
input.addEventListener("input", updatePreview);
input.addEventListener("paste", () => setTimeout(updatePreview, 0));
updatePreview();

function getImageBlob(url) {
  return fetch(url, { mode: "cors" })
    .then((r) => r.blob())
    .catch(() => null);
}

openBtn.addEventListener("click", function () {
  const url = extractUrl(input.value);
  if (url) {
    window.open(url, "_blank");
    setStatus("Opened in new tab.");
  } else {
    setStatus("No :url \"...\" found in the pasted text.");
  }
});

downloadBtn.addEventListener("click", async function () {
  const url = extractUrl(input.value);
  if (!url) {
    setStatus("No :url \"...\" found in the pasted text.");
    return;
  }
  setStatus("Downloading...");
  const blob = await getImageBlob(url);
  if (!blob) {
    setStatus("Download failed (CORS or network).");
    return;
  }
  const a = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  a.href = objectUrl;
  a.download = url.split("/").pop().split("?")[0] || "image";
  a.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
  setStatus("Download complete.");
});
