'use strict';

const CANVAS = document.getElementById('c');
const CTX = CANVAS.getContext('2d');
const STAGE = new createjs.Stage('c');

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
    const font_face = "20px Arial";
    const font_color = "#222222";
    var block_box = new createjs.Shape();
    block_box.name = "block_box";   
    const block_num = new createjs.Text(`Block # ${idx}`, font_face, font_color);
    block_num.y = 0;
    const timestamp = new createjs.Text(block.data.data[0].payload.header.channel_header.timestamp.substring(0,25), font_face, font_color)
    timestamp.y = 20;
    const previous_hash = new createjs.Text(block.header.previous_hash.substring(0,10) + '...', font_face, font_color);
    previous_hash.y = 50
    block_box.graphics.beginFill("#DDDDDD").rect(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
    rect.addChild(block_box, block_num, timestamp, previous_hash);
    STAGE.addChild(rect);

    return rect;
}

function drawBlocks() {
    BLOCKS.map((block, idx) => {
        var rect = drawBlock(block, idx, 200*idx, Y);
        RECTS.push(rect);
    })
}


async function addNewBlock(block) {
    let X = 200;
    console.log("hel");
    //console.log(length(RECTS));
    //console.log(RECTS[length(RECTS)-1]);
    let last_x = RECTS[RECTS.length-1].x;
    let x_to_move = last_x - CANVAS.width + 400;
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
    //console.log(promises);

    Promise.all(promises).then(() => {
        console.log("all promises resolved");
        last_x = RECTS[RECTS.length-1].x;
        let rect = drawBlock(block, RECTS.length, last_x+200, 0);
        createjs.Tween.get(rect).to({y: Y}, 500);
        RECTS.push(rect)
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
    xhr.open("GET", "http://localhost:9999/blocks");
    xhr.send();
}

function updateBlocks(blocks) {
    
}

function getNewBlocks() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (this.readyState === 4) {
            console.log(JSON.parse(this.responseText));
            updateBlocks(JSON.parse(this.responseText));
        }
    }
    xhr.open("GET", "http://localhost:9999/new_blocks");
    xhr.send();
}




function init() {
    getInitialBlocks();
    drawBlocks();
    //setInterval(getNewBlocks, 3000);
    //setInterval(shiftBlockLeft, 2000);
    //setInterval(addNew, 3000);
}

function addNew() {
    addNewBlock(fake_block);
    return;
}

createjs.Ticker.setFPS(24);
createjs.Ticker.addEventListener("tick", STAGE);

init();