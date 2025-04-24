
const scanBtn = document.getElementById("scanAgainBtn");
const reader = new Html5Qrcode("reader");

function showResult(data, isValid) {
  document.getElementById("studentName").innerText = `Name: ${data.name}`;
  document.getElementById("studentRoll").innerText = `Roll No: ${data.rollNo}`;
  document.getElementById("studentDeptYear").innerText = `Dept: ${data.department}, Year: ${data.year}`;
  document.getElementById("studentPhoto").src = "./assets/default-photo.jpg";
  document.getElementById("validityStatus").innerText = isValid ? "✅ Valid QR" : "❌ Invalid or Tampered QR Code";
  document.getElementById("validityStatus").className = isValid ? "valid" : "invalid";
  document.getElementById("verificationResult").style.display = "block";
  scanBtn.style.display = "inline-block";
  setTimeout(() => reader.stop(), 300);
}

reader.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  async (decodedText) => {
    try {
      const payload = JSON.parse(decodedText);
      showResult(payload.data, true); // Simulated as always valid for GitHub Pages
    } catch (err) {
      console.error("Scan Error:", err);
    }
  },
  (errorMsg) => console.warn("QR scan error:", errorMsg)
);

scanBtn.addEventListener("click", () => {
  document.getElementById("verificationResult").style.display = "none";
  scanBtn.style.display = "none";
  reader.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
    async (decodedText) => {
      try {
        const payload = JSON.parse(decodedText);
        showResult(payload.data, true);
      } catch (err) {
        console.error("Rescan Error:", err);
      }
    });
});
