document.getElementById("status").textContent =
    "Application deployed successfully!";

function updateClock() {
    const now = new Date();
    document.getElementById("clock").textContent =
        now.toLocaleString();
}

function showMessage() {
    document.getElementById("message").textContent =
        "JavaScript is running successfully on the VM!";
}

updateClock();
setInterval(updateClock, 1000);