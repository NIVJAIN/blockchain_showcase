'use strict';

const CANVAS = document.getElementById('c');
const CTX = CANVAS.getContext('2d');
const STAGE = new createjs.Stage('c');
const SERVER_URL = "http://209.97.162.4:9999";

CANVAS.width = 1280;
CANVAS.height = 720;
CANVAS.style.border = "solid 1px black";
var BLOCKS = [];

// Rectangles are the visual representations of blocks
var RECTS = [];

let X = 0;
let Y = 150;
const BLOCK_WIDTH = 180;
const BLOCK_HEIGHT = 400;

const fake_block = {
    "header": {
        "previous_hash" : "1234567890-qwertyuiopasdfghjkl;"
    },
    "data": {
        "data": [{
            "payload": {
                "header": {
                    "channel_header": {
                        "timestamp": "Wednesday morning"
                    }
                }
            }
        }]
    }
}

function drawBlock(block, idx, x, y) {
    var rect = new createjs.Container();
    rect.x = x;
    rect.y = y;
    const font_face = "1em monospace";
    const big_font_face = "1.5em monospace";
    const font_color = "#111111";
    const font_color2 = "#FFFFFF";
    var block_box = new createjs.Shape();
    block_box.name = "block_box";   
    const block_num = new createjs.Text(`Block # ${idx}`, big_font_face, font_color);
    block_num.y = 0;
    const timestamp = new createjs.Text(block.data.data[0].payload.header.channel_header.timestamp.substring(0,25), font_face, font_color)
    timestamp.y = 30;
    timestamp.lineWidth = BLOCK_WIDTH;
    timestamp.lineHeight = 20;

    var lines = [];
    var display_lines = [];
    
    try {
        var ba = block.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[2].value;

        var ba = JSON.parse(ba);
        console.log(ba);
        //console.log(ba["$class"]);

        

        if (ba["$class"] === "org.example.mynetwork.UpdateLocation") {
            //console.log('hello');
            lines.push(
                "Location Update:",
                `${ba.good.slice(-5)} moved to ${ba.newLocation.name} (${ba.newLocation.coordinates[0]}, ${ba.newLocation.coordinates[1]})`
            )
        }
        else if (ba["$class"] === "org.hyperledger.composer.system.AddAsset") {
            console.log(ba.resources);
            lines.push(
                "Asset added: ",
                ba.resources[0].goodId,
                ba.resources[0].name,
                ba.resources[0].description,
            )
        }

        lines.forEach((line, idx) => {
            display_lines.push(new createjs.Text(line, font_face, font_color));
            display_lines[idx].y = 80+(20*idx)
            display_lines[idx].lineWidth = BLOCK_WIDTH;
            display_lines[idx].lineHeight = 20; 
        })
        
    }
    catch (e) {
        console.log('block data is undefined')
    }


    var hash_box = new createjs.Shape();
    hash_box.name = "hash_box";
    hash_box.y = 300;
    hash_box.graphics.beginFill("#444444").rect(0, 0, BLOCK_WIDTH, 100);
    const previous_hash_label = new createjs.Text("Previous hash: ", font_face, font_color2);
    previous_hash_label.y = 300;
    const previous_hash = new createjs.Text(block.header.previous_hash, font_face, font_color2);
    previous_hash.lineWidth = BLOCK_WIDTH;
    previous_hash.y = 320;

    
    block_box.graphics.beginFill("#DDDDDD").rect(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
    rect.addChild(block_box, hash_box, block_num, timestamp, previous_hash_label, previous_hash);
    display_lines.forEach((line) => {
        rect.addChild(line);
    })
    STAGE.addChild(rect);

    return rect;
}

function drawBlocks() {
    BLOCKS.map((block, idx) => {
        var rect = drawBlock(block, idx, 200*idx, Y);
        RECTS.push(rect);
    })
}


async function addNewBlock(blocks) {
    let X = 200;
    //console.log("hel");
    //console.log(length(RECTS));
    //console.log(RECTS[length(RECTS)-1]);
    let last_x = RECTS[RECTS.length-1].x;
    let x_to_move = last_x - CANVAS.width + 200 + (200*blocks.length);
    if (x_to_move < 0) {
        x_to_move = 0;
    }

    var promises = [];
    RECTS.forEach((rect) => {
        //var block_box = rect.getChildByName('block_box');
        let new_x = rect.x - x_to_move
        promises.push(new Promise((resolve, reject) => {
            createjs.Tween.get(rect).to({x : new_x}, 800).call(resolve);
        }));
    })

    Promise.all(promises).then(() => {
        //console.log("all promises resolved");
        last_x = RECTS[RECTS.length-1].x;
        blocks.map((block, idx) => {
            let rect = drawBlock(block, RECTS.length, last_x+(200*(idx+1)), 0);
            createjs.Tween.get(rect).to({y: Y}, 500);
            RECTS.push(rect)
        })
    })
}

function shiftBlockLeft() {
    
    RECTS.forEach( (rect) => {
        //var block_box = rect.getChildByName('block_box');
        let new_x = rect.x - 200
        createjs.Tween.get(rect).to({x : new_x}, 300);
    })

}


function getInitialBlocks() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (this.readyState === 4) {
            BLOCKS = JSON.parse(this.responseText);
            BLOCKS = BLOCKS.blocks;
            console.log(BLOCKS);
            drawBlocks();
        }
    }
    xhr.open("GET", `${SERVER_URL}/blocks`);
    xhr.send();
}

function updateBlocks(blocks) {
    let block_array = blocks.blocks
    addNewBlock(block_array)
}

function getNewBlocks() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (this.readyState === 4) {
            //console.log(JSON.parse(this.responseText));
            updateBlocks(JSON.parse(this.responseText));
        }
    }
    xhr.open("GET", `${SERVER_URL}/new_blocks`);
    xhr.send();
}

function init() {
    getInitialBlocks();
    drawBlocks();
    setInterval(getNewBlocks, 3000);
    //setInterval(shiftBlockLeft, 2000);
    //setInterval(addNew, 3000);
}

// doesn't work async...
async function addNew() {
    addNewBlock([fake_block, fake_block]);
    return;
}

createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick", STAGE);

init();
