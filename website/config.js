var BACKEND_URL = window.location.href.split("/")[0] + "//" + window.location.host;
if (BACKEND_URL.startsWith("http://")) {
    var WEBSOCKET_URL = BACKEND_URL.replace("http://", "ws://")
} else {
    var WEBSOCKET_URL = BACKEND_URL.replace("https://", "wss://")
}
export {BACKEND_URL, WEBSOCKET_URL};