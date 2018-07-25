var express = require('express');
var app = express()
var port = process.env.PORT || 9999;
var cors = require('cors');
var bodyParser = require('body-parser');
var request = require('request');
const fs = require('fs');

app.set('port', port);
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/visualiser'));
app.set('view engine', 'pug');
app.set('views', './views')

var server = require('http').createServer(app);
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const card = 'admin@tutorial-network';
var bnc;
var bnd;
var fc;
var channel;

// Initialise some fake data
var fake_data = require("./init_data.json");
var LAST_BLOCK = 0;

function http(url, method, form){
    method = method.toLowerCase();
    var options= {
        url:url,
        form:form,
        headers:{
            'User-Agent': 'request'
        }
    };

    return new Promise(function(resolve, reject){
        request[method](options, function(err, response, body){
            if(err){
                reject(err)
            } 
            if(body){
                resolve(JSON.parse(body))
            }
        })
    })
}

async function init() {
    //console.log('called');
    bnc = new BusinessNetworkConnection();
    bnd = await bnc.connect(card);
    //const runtimeType = card.getConnectionProfile()['x-type'];
    //console.log(runtimeType);
    fc = bnc.getNativeAPI();
    channel = await fc.getChannel('composerchannel');
    bnc.on('event', handleEvent);
    server.listen(port);

}

function handleEvent(e) {
    console.log(e);
}

async function getBlockData(start_index) {
    const info = await channel.queryInfo();
    //console.log(info);
    let hashbuf = info.currentBlockHash;
    //console.log(hashbuf.buffer);
    //console.log('block height', info.height);
    console.log("Getting block data...")
    var res = {blocks:[]};
    for (let i = 0; i < info.height; i++) {
        if (start_index <= i) {
            res.blocks.push(await channel.queryBlock(i));    
        }
    }
    LAST_BLOCK = info.height;
    //console.log(res);
    return res;
}

async function updateBlockData(block_index) {
    let payload = await getBlockData(block_index);
    return payload;
}



app.get('/new_blocks', async function(req, res) {
    //console.log('hello');
    let payload = await updateBlockData(LAST_BLOCK);
    //res.send(payload);
    res.send(payload);
})

app.get('/blocks', async function(req, res) {
    //console.log('hello');
    let payload = await updateBlockData(0);
    //res.send(payload);
    res.send(payload);
})

app.get('/block_vis', async function(req, res) {
    res.sendFile(__dirname + '/visualiser/index.html')
})

app.get('/updatelocation', (req, res) => {
    let update = req.query;
    let now = new Date(Date.now()).toISOString();
    let obj = {
        "$class": "org.example.mynetwork.UpdateLocation",
        "time": now,
        "good": update.id,
        "newLocation": {
            "$class": "org.example.mynetwork.Location",
            "coordinates": [update.location_y, update.location_x],
            "name": update.location_name
        },
        "timestamp": now
    };
    console.log(update);
    http('http://localhost:3000/api/UpdateLocation', 'post', obj).then((post_req) => {
        res.send(post_req);
    })
})

app.get('/populate', function(req, res){
    // First, load in fake data from init_data.json
    console.log(fake_data);
    http('http://localhost:3000/api/Trader','post', fake_data.trader1)
    .then(function(restrader){  
        console.log("Promise1", restrader)
        return http('http://localhost:3000/api/Good','post', fake_data.good1)
    }).then(function(results){
        console.log("Promise1", results)
        return http('http://localhost:3000/api/Good','post', fake_data.good2)
    }).then((results) => {
        console.log("Promise2", results)
        return http('http://localhost:3000/api/UpdateLocation', 'post', fake_data.update1)
    }).then(function(results) {
         console.log("Promise2", results)
         http('http://localhost:3000/api/Good', 'get', null)        
    }).catch(function(err){
        console.log("ErrorFromHttpFunction::", err)
    }).then(res.send("OK"));
})

app.get('/history', (rq, rs) => {
    request('http://localhost:3000/api/system/historian', (err, res, body) => {
        if (err) {
            return console.log(err)
        }
        //console.log(body);
        rs.send(body);
    })
})

/*
app.get('/good_vis', function (req,res) {
    res.sendFile(__dirname + '/View/index.html')
})
*/

app.get('/goods', function(req, res){
    console.log(req.query);
    request(`http://localhost:3000/api/Good/${req.query.id}`, {json: true}, (err, resp, body) => {
        if (err) {return console.log(err)}
        console.log(body);
        var obj = `
<!DOCTYPE html>
<html>
    <meta name = "viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.3/dist/leaflet.css"
    integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="
    crossorigin=""/>
    <script>
    'use strict';

function initMap() {
    var mymap = L.map('mapid', {zoomControl:false} ).setView([45, 0], 0);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    }).addTo(mymap);

    mymap.dragging.disable();
    mymap.touchZoom.disable();
    mymap.doubleClickZoom.disable();
    mymap.scrollWheelZoom.disable();

    var pointList = [];`

    var coords = body.location.coordinates;
    obj += `
    pointList.push(new L.LatLng(${coords[0]}, ${coords[1]}));
    L.marker(pointList[0]).addTo(mymap);

    var firstpolyline = new L.Polyline(pointList, {
        color: 'red',
        weight: 1,
        opacity: 0.5,
        smoothFactor: 0
    });
    firstpolyline.addTo(mymap);
}
</script>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            text-align: center;
            height: 100%;
        }
        img {
            display:block;
            margin: 0 auto;
        }
        #mapid {height:30vh}
    </style>
    <body onload=initMap()>
    <h1>Asset Tracker</h1>
    ID: ${body.id}
    ${body.name} <br>
    <div id="mapid"></div>
    <ul>
        <li> ${body.description}
        <li> ${body.status}
        <li> ${body.location.name}
        <li> ${body.location.coordinates}`
    
    body.history.reverse().map((item) => {
        obj = obj + `<li> ${item}`
    });

    obj = obj +
    `    

    </body>
    <script src="https://unpkg.com/leaflet@1.3.3/dist/leaflet.js"
        integrity="sha512-tAGcCfR4Sc5ZP5ZoVz0quoZDYX5aCtEm/eu1KhSLj2c9eFrylXZknQYmxUssFaVJKvvc0dJQixhGjG2yXWiV9Q=="
        crossorigin="">
    </script>
    </html>`
        res.send(obj);
        //res.render('good_viewer', body);
    })
})

init();
