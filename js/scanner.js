const scanBtn = document.getElementById("scanAgainBtn");
const reader = new Html5Qrcode("reader");

function showResult(data, isValid) {
  console.log("📊 Showing Result | Valid:", isValid, "| Data:", data);

  const resultBox = document.getElementById("verificationResult");

  if (isValid) {
    document.getElementById("studentName").innerText = `Name: ${data.name}`;
    document.getElementById("studentRoll").innerText = `Roll No: ${data.rollNo}`;
    document.getElementById("studentDeptYear").innerText = `Dept: ${data.department}, Year: ${data.year}`;
    document.getElementById("studentPhoto").src = "./assets/default-photo.jpg";
    document.getElementById("validityStatus").innerText = "✅ Valid QR";
    document.getElementById("validityStatus").className = "valid";
  } else {
    document.getElementById("studentName").innerText = "";
    document.getElementById("studentRoll").innerText = "";
    document.getElementById("studentDeptYear").innerText = "";
    document.getElementById("studentPhoto").src = "";
    document.getElementById("validityStatus").innerText = "❌ Invalid or Tampered QR Code";
    document.getElementById("validityStatus").className = "invalid";
  }

  resultBox.style.display = "block";
  scanBtn.style.display = "inline-block";
  setTimeout(() => reader.stop(), 300);
}

// ✅ Initial QR scan
reader.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  async (decodedText) => {
    console.log("📦 QR Scanned:", decodedText);

    try {
      const payload = JSON.parse(decodedText);

      const res = await fetch("https://qr-backend-0t0z.onrender.com/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload.data, signature: payload.signature }),
      });

      const result = await res.json();
      console.log("✅ Backend Response:", result);

      showResult(payload.data, result.valid);
    } catch (err) {
      console.error("❌ Scan Error:", err);
    }
  },
  (errorMsg) => {
    console.warn("⚠️ QR scan error:", errorMsg);
  }
);

// 🔁 Re-scan button
scanBtn.addEventListener("click", () => {
  document.getElementById("verificationResult").style.display = "none";
  scanBtn.style.display = "none";

  reader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {
      console.log("🔁 Re-Scanned:", decodedText);

      try {
        const payload = JSON.parse(decodedText);

        const res = await fetch("https://qr-backend-0t0z.onrender.com/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: payload.data, signature: payload.signature }),
        });

        const result = await res.json();
        showResult(payload.data, result.valid);
      } catch (err) {
        console.error("❌ Re-scan Error:", err);
      }
    },
    (errorMsg) => {
      console.warn("⚠️ Re-scan QR error:", errorMsg);
    }
  );
});
