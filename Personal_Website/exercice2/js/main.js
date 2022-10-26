const DATA_NAME = "cat_data_introduction";

//needed to use the "map()" p5 function
function setup() {noCanvas();}
function draw() {}

window.onload = function(){
    
}

let data;
$(document).ready(function() {
    data = JSON.parse(localStorage.getItem(DATA_NAME));

    if (data === null) {
        $.getJSON('assets/data/data.json', function(e){
            console.log(e);
            data = e;
            buildPage();
        })
        .fail(function() {
            console.error("ERROR: failed to load data");
        });
    }
    
    
});

let dayInputMin;
let dayInputMax;
let submitRangeButton;
function buildPage() {
    let wrapper = $('<div>').addClass("wrapper").appendTo($('body'));

    dayInputMin = $("<input>").attr({
        name: 'input-day-min', 
        placeholder: 'min',
        type: 'number',
        min: '1',
        max: (data.catIntroduction1.data.length).toString()
    }).addClass("input-day").appendTo(wrapper);
    dayInputMax = $("<input>").attr({
        name: 'input-day-min', 
        placeholder: 'max',
        type: 'number',
        min: '1',
        max: (data.catIntroduction1.data.length).toString()
    }).addClass("input-day").appendTo(wrapper);

    submitRangeButton = $('<button>').attr({
        type: 'button',
        onclick: 'displayRange();'
    })
    .html('submit')
    .addClass("ex2-button").appendTo(wrapper);
}

function displayRange() {
    let filteredResult = data.catIntroduction1.data.filter(getDays);
    
    let container = $('<div>').addClass("container").appendTo($('body'));
    let title = $('<h2>').html(`Proximity from day ${dayInputMin.val()} to day ${dayInputMax.val()}`).appendTo(container);
    let canvas = $('<canvas>').attr('id', "result-canvas").appendTo(container);
    console.log(container);
    let containerParams = container[0].getBoundingClientRect();
    canvas[0].width = containerParams.width;
    canvas[0].height = containerParams.height;
    context = canvas[0].getContext("2d");
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas[0].width, canvas[0].height);

    let imgSize = 30;
    let cat1 = {
        x: 0 - imgSize/2 + canvas[0].width/10,
        y: canvas[0].height/2 - imgSize/2
    }
    let cat2 = {
        x: canvas[0].width - imgSize/2 - canvas[0].width/10,
        y: canvas[0].height/2 - imgSize/2
    }

    let closeness = determineCloseness(filteredResult);
    let Mappedcloseness = map(closeness, 0, 10, (cat2.x - cat1.x)/2, 0);
    context.fillStyle = "white";
    context.fillRect(cat1.x + Mappedcloseness, cat1.y, imgSize, imgSize);

    context.fillStyle = "red";
    context.fillRect(cat2.x - Mappedcloseness, cat2.y, imgSize, imgSize);

    //display a heart if very close
    let heartSize = 10;
    if (closeness <= 1) {
        context.fillRect(canvas[0].width/2 - heartSize/2, canvas[0].height/6 - heartSize/2, heartSize, heartSize);
    }
    //display fusion if fusionned
    let fusionSize = 10;
    if (closeness === 0) {
        context.fillStyle = "white";
        context.fillRect(canvas[0].width/2 - fusionSize/2, canvas[0].height/6 - fusionSize/2, fusionSize, fusionSize);
    }
}

function getDays(day) {
    if (day.day >= dayInputMin.val() && day.day <= dayInputMax.val())
    return day;
}

function determineCloseness(days) {
    let closeness = 10;
    days.forEach((day) => {
        if (day.fight) {closeness = 10}
        if (day.play) {closeness -= 5}
        if (day.sleep) {closeness = 0}
        if (day.scentContact) {closeness -= 0.1}
        if (day.visualContact) {closeness -= 0.4}
        if (day.eatenTogether.withoutVisual > 0) {closeness -= 0.2}
        if (day.eatenTogether.withoutVisual > 2) {closeness -= 0.3}
        if (day.eatenTogether.withPartialVisual > 0) {closeness -= 0.25}
        if (day.eatenTogether.withPartialVisual > 2) {closeness -= 0.35}
        if (day.eatenTogether.withVisual > 0) {closeness -= 0.3}
        if (day.eatenTogether.withVisual > 2) {closeness -= 0.4}
        if (day.eatenTogether.withoutBarrier > 0) {closeness -= 1}
        if (day.eatenTogether.withoutBarrier > 2) {closeness -= 1.5}
    });
    
    if (closeness < 0)
        closeness = 0;
    return closeness;
}

function storeData(data) {
    localStorage.setItem(DATA_NAME, JSON.stringify(data));
}