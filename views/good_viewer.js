'use strict';

function initMap() {
    var mymap = L.map('mapid', {zoomControl:false} ).setView([45, 0], 0);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    }).addTo(mymap);

    mymap.dragging.disable();
    mymap.touchZoom.disable();
    mymap.doubleClickZoom.disable();
    mymap.scrollWheelZoom.disable();

    var pointA = new L.LatLng(14, -1);
    var pointB = new L.LatLng(0, 77.70641);
    var pointList = [pointA, pointB];

    var markerA = L.marker(pointA).addTo(mymap);
    var markerB = L.marker(pointB).addTo(mymap);

    var firstpolyline = new L.Polyline(pointList, {
        color: 'red',
        weight: 1,
        opacity: 0.5,
        smoothFactor: 0
    });
    firstpolyline.addTo(mymap);
}

function init() {
    /*
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (this.readyState === 4) {
            console.log(JSON.parse(this.responseText));
            updateBlocks(JSON.parse(this.responseText));
        }
    }
    xhr.open("GET", "http://localhost:9999/new_blocks");
    xhr.send();
    */
    initMap();
}