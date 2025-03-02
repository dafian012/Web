let attackInterval;
let successCount = 0;
let failCount = 0;
let running = false;

function sendRequest(url) {
    fetch(url)
        .then(response => {
            if (response.ok) successCount++;
            else failCount++;
            updateMonitor();
        })
        .catch(() => {
            failCount++;
            updateMonitor();
        });
}

function updateMonitor() {
    document.getElementById("successCount").textContent = successCount;
    document.getElementById("failCount").textContent = failCount;
}

document.getElementById("start").addEventListener("click", function() {
    if (running) return;
    running = true;

    let url = document.getElementById("url").value;
    let requestCount = parseInt(document.getElementById("requestCount").value);
    let duration = parseInt(document.getElementById("duration").value);
    let timeUnit = document.getElementById("timeUnit").value;
    let durationMs = timeUnit === "seconds" ? duration * 1000 : duration * 3600000;
    
    if (!url.startsWith("http")) {
        alert("Masukkan URL yang valid!");
        running = false;
        return;
    }

    successCount = 0;
    failCount = 0;
    updateMonitor();
    document.getElementById("status").textContent = "Testing...";

    let startTime = Date.now();
    let activeRequests = 0;

    function makeRequest() {
        if (!running || (Date.now() - startTime > durationMs) || requestCount <= 0) {
            document.getElementById("status").textContent = "Selesai";
            running = false;
            return;
        }
        
        if (activeRequests < 5 && requestCount > 0) {
            activeRequests++;
            requestCount--;
            sendRequest(url);
            activeRequests--;
        }

        attackInterval = setTimeout(makeRequest, 1);
    }

    makeRequest();
});

document.getElementById("stop").addEventListener("click", function() {
    running = false;
    clearTimeout(attackInterval);
    document.getElementById("status").textContent = "Dihentikan";
});
