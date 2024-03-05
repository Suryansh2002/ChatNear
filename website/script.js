import {BACKEND_URL, WEBSOCKET_URL} from "./config.js";

let name = new URLSearchParams(window.location.search).get("name");
if (name == null){
    window.location.href = "/login";
}
let user_id = Date.now().toString(36);

let ws = new WebSocket(WEBSOCKET_URL);

ws.onopen = () => {
    console.log("connected");
}

ws.onmessage = (event) => {
    let data = JSON.parse(event.data);
    addMessage(data.name,data.user_id,data.message);
}

ws.onclose = () => {
    console.log("disconnected");
}

function addMessage(name, id, message){
    let chats = document.getElementById("chatdiv");
    let bodycls = id == user_id ? "message-body-self" : "message-body-other";
    let headercls = id == user_id ? "message-header-self" : "message-header-other";
    name = id == user_id ? "You" : name;

    chats.innerHTML += `\n
    <div class="message">
        <div class=${headercls}> ${name} </div>
        <div class="${bodycls}">${message}</div>
    </div>
    `;
}

function updateLocation(location){
    if (!ws.OPEN){
        return;
    }
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;
    ws.send(JSON.stringify({user_id:user_id,latitude:latitude,longitude:longitude}));
}

function onLocation(location) {
    if (!ws.OPEN){
        return;
    }
    updateLocation(location);
    sendMessage();
}

function onLocationError(error) {
    alert(`Failed to get location ${error}\nLocation is needed for sending messages !`);
    document.getElementById("sendbutton").disabled = false;
}

async function sendMessage(){
    let input = document.getElementById("sendinput");
    let value = input.value;
    input.value = "";
    if (value.length < 1){
        alert("Message cannot be empty");
        return;
    }
    let req = await fetch(`${BACKEND_URL}/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name:name,user_id:user_id,message:value}),
    });
    document.getElementById("sendbutton").disabled = false;

    if (req.status != 200){
        alert("Failed to send message");
    }
}

async function sendPress(){
    document.getElementById("sendbutton").disabled = true;
    navigator.geolocation.getCurrentPosition(onLocation, onLocationError, {enableHighAccuracy: true});
}

window.sendPress = sendPress;