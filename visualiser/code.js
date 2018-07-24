'use strict';

var width, blockdata, chain;
var rect, recth, rectt, sep, text, img, circle;

// figure out network graph bootstrap grid size width ---------------------
if ($(window).width() < 768) {
    width = 768 // recalculated based on bootstrap 3/4 sizing of network graph
}
else if ($(window).width() >= 768 &&  $(window).width() <= 992) {
    width = 768
}
else if ($(window).width() > 992 &&  $(window).width() <= 1200) {
    width = 992
}
else  {
    width = 1100
}


// define global variables
const height             =        400
const r                  =        4   // circle radius
const resolution         =        10
const padheight          =        140
const padwidth           =        30
const block_title_height =        80
const btw_block_padding  =        160
const boxwidth           =        110 // fixed at 10 spaces
const block_title_color = d3.rgb(11 , 75, 40)
const block_title_dummy = d3.rgb(115, 121, 124)
const block_color       = d3.rgb(42 , 42, 42)
const blocktext         = d3.rgb(10 , 104, 192)
const transaction_color = d3.rgb(192, 180, 10)
const chain_color       = d3.rgb(192, 180, 10)


// create main SVG container ---------------------
var svg = d3.select('#ethereum').append('svg')
    .attr('width', width)
    .attr('height', height);


// FUNCTION TO UPDATE BLOCKCHAIN ---------------------
var drawBlocks = function(){

    chain = svg.append('g').selectAll('line')
    rect = svg.append('g').selectAll('rect')
    recth = svg.append('g').selectAll('rect')
    rectt = svg.append('g').selectAll('rect')
    sep = svg.append('g').selectAll('line')
    text = svg.append('g').selectAll('text')
    img = svg.append('g').selectAll('image')
    circle = svg.append('g').selectAll('circles')

    // CHAIN FOR BLOCKS
    chain = chain.data(blockdata.blocks)
    chain.enter().append('line')
        // don't draw chain for first, ie., latest block
        .attr('x1', function(e,counter){if (counter!=0) {return padwidth + (btw_block_padding * (counter)) - boxwidth + 60}})
        .attr('y1', padheight-(block_title_height/2) + 62)
        .attr('x2', function(e,counter){return padwidth + (btw_block_padding * (counter))})
        .attr('y2', padheight-(block_title_height/2) + 93)
        .attr({'stroke': chain_color, 'stroke-width':"2px", "shape-rendering": "crispEdges", "stroke-dasharray": "3,3"})

    // BLOCK TITLE RECTANGLE
    rect = rect.data(blockdata.blocks)
    rect.enter().append("rect")
        // shift block right for each dataset
        .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter))})
        .attr("y", padheight-block_title_height)
        .attr({"width":boxwidth, "height":block_title_height+80})
        .attr("fill", function(e){if (e.transactions != 0) {return block_title_color}
                                    else {return block_title_dummy}})
        .attr("opacity","1")

    // BLOCK HASH RECTANGLE
    recth = recth.data(blockdata.blocks)
    recth.enter().append("rect")
        .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter))+5})
        .attr("y", padheight + 5)
        .attr("rx",5)
        .attr("width", function(e) {return boxwidth-10})
        .attr("height", 50 + 15)
        .attr({"fill":"black", "opacity":"1"})
    
    // LINE SEPARATOR FOR HASH RECTANGLE
    sep = sep.data(blockdata.blocks)
    sep.enter().append('line')
        .attr('x1', function(e,counter){return padwidth + (btw_block_padding * (counter+1)) - boxwidth - 50})
        .attr('y1', padheight-(block_title_height/2) + 78)
        .attr('x2', function(e,counter){return padwidth + (btw_block_padding * (counter+1)) - 50})
        .attr('y2', padheight-(block_title_height/2) + 78)
        .attr('stroke-width','3px')
        .attr('stroke', function(e){if(e.transactions != 0){return block_title_color}
                                    else {return block_title_dummy}})

    // BLOCK TRANSACTIONS RECTANGLE
    rectt = rectt.data(blockdata.blocks)
    rectt.enter().append("rect")
        .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter))})
        .attr("y", padheight + 80)
        .attr("width", function(e) {if (e.transactions != 0) {return boxwidth}
                                    else {return 0}})
        .attr("height", function(e){return (e.transactions/10 + 1.5) * 10 + 12}) // 10 transactions in a row
        .attr({"fill":block_color, "opacity":"1"})

    // TEXT FOR BLOCK ------------------------
    text = text.data(blockdata.blocks)

    text.enter().append('text')
        .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter)) + 28 + 5})
        .attr("y", padheight - block_title_height + 20)
        .attr({"font-size":14, "fill":"white", "font-weight":"bold"})
        .text(function(e) {return '#' + blockdata.blocks.indexOf(e)})

    // TEXT FOR TIMESTAMP USED
    text.enter().append('text')
    .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter)) + 10})
    .attr("y", padheight - block_title_height + 65)
    .attr({"font-size":8, "fill":"white", "font-weight":"bolder"})
    .text(function(e) {return  e.data.data[0].payload.header.channel_header.timestamp.substring(0,25)})
    
    // TEXT FOR PREVIOUS HASH TITLE
    text.enter().append('text')
    .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter)) + 10})
    .attr("y", padheight - block_title_height + 65 + 67)
    .attr({"font-size":9, "fill":"white", "font-weight":"bolder"})
    .text("Previous Hash")

    // Text for previous hash
    text.enter().append('text')
    .attr("x", function(e, counter) {return padwidth + (btw_block_padding * (counter)) + 10})
    .attr("y", padheight - block_title_height + 65 + 79)
    .attr({"font-size":10, "fill":"white", "font-weight":"normal"})
    .text(function(e) {return e.header.previous_hash.substring(0,10) + '...'})

    /*
   






    // IMAGE
    img = img.data(blockdata.blocks)
    img.enter().append("image")
        .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter)) + 10})
        .attr("y", padheight - block_title_height + 5)
        .attr('width', 18)
        .attr('height', 18)
        .attr("xlink:href", "./img/blocks2.png")


    


    // TEXT FOR MINER
    text.enter().append('text')
        .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter)) + 10})
        .attr("y", padheight - block_title_height + 35)
        .attr({"font-size":8, "fill":"white", "font-weight":"bolder"})
        .text(function(e) {return 'Miner: ' + e.miner})


    // TEXT FOR GAS USED
    text.enter().append('text')
        .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter)) + 10})
        .attr("y", padheight - block_title_height + 45)
        .attr({"font-size":8, "fill":"white", "font-weight":"bolder"})
        .text(function(e) {return 'Gas Used: ' + e.gasUsed})



 

 

    // TEXT FOR PREVIOUS HASH VALUE
    text.enter().append('text')
        .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter)) + 10})
        .attr("y", padheight - block_title_height + 65 + 79)
        .attr({"font-size":10, "fill":"white", "font-weight":"normal"})
        .text(function(e) {return e.phash})

    // TEXT FOR # TRANSACTIONS
    text.enter().append('text')
        .attr("x", function(e, counter){return padwidth + (btw_block_padding * (counter)) + 5})
        .attr("y", padheight - block_title_height + 90 + 80)
        .attr({"font-size":8, "fill":transaction_color, "font-weight":"bolder"})
        .attr('word-spacing',2)
        .text(function(e) {if (e.transactions == 1){return e.transactions + ' transaction'}
                            else if (e.transactions == 0) {return ''}
                            else {return  e.transactions + ' transactions'}})
    */

};


function updateBlocks(new_blocks) {
    
    // find out how many new blocks so can shift current blockchain according
    console.log("blockchain length:" + blockdata.blocks.length);
    var num_of_new_blocks = new_blocks.blocks.length;
    console.log(num_of_new_blocks);
    
    // remove all elements before reloading
    d3.selectAll('#ethereum>svg>g').remove()

    // insert new blocks to blockchain
    new_blocks.blocks.map(async function (i) {
        let translate = 'translate(-160, 0)';
        blockdata.blocks.push(i);
        if (blockdata.blocks.length > 6) {
            blockdata.blocks = blockdata.blocks.slice(1);
        }
        d3.selectAll('rect,text,line,image,circle').transition().attr('transform',translate).duration(1000)
    })

    drawBlocks();
 
}

function getInitialBlocks() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (this.readyState === 4) {
            blockdata = JSON.parse(this.responseText);
            console.log(blockdata);
            drawBlocks();
        }
    }
    xhr.open("GET", "http://localhost:9999/blocks");
    xhr.send();
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
    setInterval(getNewBlocks, 3000);
}

init();