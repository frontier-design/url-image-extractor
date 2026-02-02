const input = document.getElementById("input");
const openBtn = document.getElementById("open");
const downloadBtn = document.getElementById("download");
const previewImg = document.getElementById("preview-img");
const preview = document.getElementById("preview");

function extractUrl(text) {
  const match = text.match(/:url\s*"([^"]+)"/);
  return match ? match[1] : null;
}

function updatePreview() {
  const url = extractUrl(input.value);
  if (url) {
    previewImg.src = url;
    previewImg.style.display = "";
    previewImg.onerror = () => {
      previewImg.style.display = "none";
      previewImg.src = "";
    };
  } else {
    previewImg.src = "";
    previewImg.style.display = "none";
  }
}

previewImg.style.display = "none";
input.addEventListener("input", updatePreview);
input.addEventListener("paste", () => setTimeout(updatePreview, 0));
updatePreview();

function getImageBlob(url) {
  return fetch(url, { mode: "cors" })
    .then((r) => r.blob())
    .catch(() => {
      alert("Could not load image. It may be blocked by CORS.");
      return null;
    });
}

openBtn.addEventListener("click", function () {
  const url = extractUrl(input.value);
  if (url) {
    window.open(url, "_blank");
  } else {
    alert('No :url "..." found in the pasted text.');
  }
});

downloadBtn.addEventListener("click", async function () {
  const url = extractUrl(input.value);
  if (!url) {
    alert('No :url "..." found in the pasted text.');
    return;
  }
  const blob = await getImageBlob(url);
  if (!blob) return;
  const a = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  a.href = objectUrl;
  a.download = url.split("/").pop().split("?")[0] || "image";
  a.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
});
