const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const { calculateDistance } = require('./helpers.js');

const app = express();
const port = 80;
app.use(express.json());

/*
    name: {
        latitude: number,
        longitude: number,
        set_at: Date,
        socket: socket
    }
*/
let user_data = {};


app.get("/", (req, res) => {
    if("name" in req.query) {
        res.sendFile(path.join(__dirname, "/website/index.html"));
    } else {
        res.sendFile(path.join(__dirname, "/website/login/index.html"));
    }
});

app.post("/message", (req, res) => {
    if (!("name" in req.body && "user_id" in req.body && "message" in req.body)){
        res.status(400).send();
        return;
    }
    if (user_data[req.body.user_id] == undefined){
        res.status(400).send();
        return;
    }

    let payload = JSON.stringify(req.body);
    let user_lat = user_data[req.body.user_id].latitude;
    let user_lon = user_data[req.body.user_id].longitude;
    
    for (const key in user_data){
        if (user_data[key].socket.readyState != WebSocket.OPEN){
            delete user_data[key];
            continue;
        }
        if (Date.now() - user_data[key].set_at > 1000 * 60 * 5){
            delete user_data[key];
            continue;
        }
        let distance = calculateDistance(user_lat, user_lon, user_data[key].latitude, user_data[key].longitude);
        if(distance <= 1){
            user_data[key].socket.send(payload);
        }
    }
    res.status(202).send();
})

app.use(express.static(path.join(__dirname, "/website")));
const server = app.listen(process.env.PORT || port,() => {
    console.log(`Press Ctrl+C to quit.`);
});

const wss = new WebSocket.Server({ server })


function setLocation(socket, data){
    if (!("user_id" in data && "latitude" in data && "longitude" in data)){
        return;
    }
    user_data[data.user_id] = {
        latitude: data.latitude,
        longitude: data.longitude,
        set_at: Date.now(),
        socket: socket
    }
}

wss.on("connection",(socket)=>{
    socket.on("message",(data)=>{
        data = JSON.parse(data);
        setLocation(socket, data);
    })
})