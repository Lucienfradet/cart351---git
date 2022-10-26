//name for the data in the localStorage
const DATA_NAME = "cat_data_introduction";

//needed to use the "map()" p5 function
function setup() {noCanvas();}
function draw() {}

let data;
$(document).ready(function() {
    //fetching data in localStorage
    data = JSON.parse(localStorage.getItem(DATA_NAME));

    //If there is none, get the JSON file
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

//important html element stored as global variables
let wrapper;
let entryWrapper;
let dayInputMin;
let dayInputMax;
function buildPage() {
    wrapper = $('<div>').addClass("wrapper").appendTo($('body'));

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

    $('<button>').attr({
        type: 'button',
        onclick: 'displayRange();'
    })
    .html('submit')
    .addClass("ex2-button").appendTo(wrapper);

    entryWrapper = $('<div>').addClass("wrapper").appendTo($('body'));
    $('<button>').attr({
        type: 'button',
        onclick: 'addNewData();'
    })
    .html('New Day Entry')
    .addClass("ex2-button").appendTo(entryWrapper);
}

function displayRange() {
    let filteredResult = data.catIntroduction1.data.filter(getDays);
    
    let container = $('<div>').addClass("container").appendTo(wrapper);
    $('<h2>').html(`Proximity from day ${dayInputMin.val()} to day ${dayInputMax.val()}`).appendTo(container);
    let canvas = $('<canvas>').attr('id', "result-canvas").appendTo(container);
    console.log(container);
    let containerParams = container[0].getBoundingClientRect();
    canvas[0].width = containerParams.width;
    canvas[0].height = containerParams.height;
    context = canvas[0].getContext("2d");
    // context.fillStyle = "black";
    // context.fillRect(0, 0, canvas[0].width, canvas[0].height);

    let catimg1 = new Image();
    catimg1.src = "assets/images/cat1.png"
    let imgSize = 100;
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
    catimg1.onload = function(){
        context.drawImage(catimg1, cat1.x + Mappedcloseness, cat1.y, imgSize, imgSize);
    };

    let catimg2 = new Image();
    catimg2.src = "assets/images/cat2.png";
    catimg2.onload = function(){
        context.drawImage(catimg2, cat2.x - Mappedcloseness, cat2.y, imgSize, imgSize);
    };

    //display a heart if very close
    let heartSize = 50;
    if (closeness <= 1 && closeness !== 0) {
        let heartimg = new Image();
        heartimg.src = "assets/images/heart.png";
        heartimg.onload = function(){
            context.drawImage(heartimg, canvas[0].width/2 - heartSize/2, canvas[0].height/6 - heartSize/2, heartSize, heartSize);
        };
    }
    //display fusion if fusionned
    let fusionSize = 50;
    if (closeness === 0) {
        let merge = new Image();
        merge.src = "assets/images/merge.png";
        merge.onload = function(){
            context.drawImage(merge, canvas[0].width/2 - heartSize/2, canvas[0].height/8 - heartSize/2, fusionSize, fusionSize);
        };
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

let newEntryDay;
let newEntryVisualContact;
let newEntryFight;
let newEntryScentContact;
let newEntryPlay;
let newEntrySleep;
let newEntryWithoutVisual;
let newEntryWithPartialVisual;
let newEntryWithVisual;
let newEntryWithoutBarrier;
function addNewData() {
    for (let i = 0; i < 10; i++) {
        let element = $('<div>').addClass("submit-element").appendTo(entryWrapper);
        let textDiv = $('<div>').addClass("submit-element-text").appendTo(element);
        let contentDiv = $('<div>').addClass("submit-element-content").appendTo(element);

        if (i === 0) {
            $('<p>').html("What day are we at?").appendTo(textDiv);
            let lastDayEntered = data.catIntroduction1.data[
                    (data.catIntroduction1.data.length - 1) //last element
                ].day + 1;
            newEntryDay = $("<input>").attr({
                name: 'entry-day', 
                type: 'number',
                min: lastDayEntered.toString(),
                value: lastDayEntered.toString()
            }).addClass("input-day").appendTo(contentDiv);
        }

        if (i === 1) {
            $('<p>').html("Were the cats in contact with scent?").appendTo(textDiv);
            newEntryScentContact = $("<input>").attr({
                name: 'entry-scent', 
                type: 'checkbox',
            }).addClass("input-checkbox").appendTo(contentDiv);
        }
        
        if (i === 2) {
            $('<p>').html("Did the cats have visual contact whitout showing signs of agression?").appendTo(textDiv);
            newEntryVisualContact = $("<input>").attr({
                name: 'entry-visual', 
                type: 'checkbox',
            }).addClass("input-checkbox").appendTo(contentDiv);
        }
        
        if (i === 3) {
            $('<p>').html("Did the cats play together?").appendTo(textDiv);
            newEntryPlay = $("<input>").attr({
                name: 'entry-play', 
                type: 'checkbox',
            }).addClass("input-checkbox").appendTo(contentDiv);
        }

        if (i === 4) {
            $('<p>').html("Did the cats sleep in proximity of eachother?").appendTo(textDiv);
            newEntrySleep = $("<input>").attr({
                name: 'entry-sleep', 
                type: 'checkbox',
            }).addClass("input-checkbox").appendTo(contentDiv);
        }

        if (i === 5) {
            $('<p>').html("Did the cats fight? :(").appendTo(textDiv);
            newEntryFight = $("<input>").attr({
                name: 'entry-fight', 
                type: 'checkbox',
            }).addClass("input-checkbox").appendTo(contentDiv);
        }

        if (i === 6) {
            $('<p>').html("Have the cats eaten in proximity of each other...").appendTo(element);
            $('<p>').html("Without visual contact?").appendTo(textDiv);
            newEntryWithoutVisual = $("<input>").attr({
                name: 'entry-eatVisual', 
                type: 'number',
                min: '0',
                value: '0'
            }).addClass("input-day").appendTo(contentDiv);
        }

        if (i === 7) {
            $('<p>').html("With partial visual contact?").appendTo(textDiv);
            newEntryWithPartialVisual = $("<input>").attr({
                name: 'entry-eatPartVisual',
                type: 'number',
                min: '0',
                value: '0'
            }).addClass("input-day").appendTo(contentDiv);
        }

        if (i === 8) {
            $('<p>').html("With full visual contact?").appendTo(textDiv);
            newEntryWithVisual = $("<input>").attr({
                name: 'entry-eatFullVisual', 
                type: 'number',
                min: '0',
                value: '0'
            }).addClass("input-day").appendTo(contentDiv);
        }

        if (i === 9) {
            $('<p>').html("Without a separating barrier?").appendTo(textDiv);
            newEntryWithoutBarrier = $("<input>").attr({
                name: 'entry-eatNoBarrier', 
                type: 'number',
                min: '0',
                value: '0'
            }).addClass("input-day").appendTo(contentDiv);
        }
    }

    $('<button>').attr({
        type: 'button',
        onclick: 'submitNewData();'
    })
    .html('Submit')
    .addClass("ex2-button").appendTo(entryWrapper);
}

function submitNewData() {
    let newEntry = {
        day: parseInt(newEntryDay.val()),
        visualContact: newEntryVisualContact[0].checked,
        fight: newEntryFight[0].checked,
        scentContact: newEntryScentContact[0].checked,
        play: newEntryPlay[0].checked,
        sleep: newEntrySleep[0].checked,
        eatenTogether: {
            withoutVisual: parseInt(newEntryWithoutVisual.val()),
            withPartialVisual: parseInt(newEntryWithPartialVisual.val()),
            withVisual: parseInt(newEntryWithVisual.val()),
            withoutBarrier: parseInt(newEntryWithoutBarrier.val())
        }
    }

    data.catIntroduction1.data.push(newEntry);
    localStorage.setItem(DATA_NAME, JSON.stringify(data));
}

//can be used in the console to clear the Data stored locally
function clearLocalStorage() {
    localStorage.removeItem(DATA_NAME);
}