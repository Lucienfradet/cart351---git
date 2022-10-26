//name for the data in the localStorage
const DATA_NAME = "cat_data_introduction";
let divToAppendTheExerciceTo = $('#ex2-super-wrapper');

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
            data = e;
            buildPage();
        })
        .fail(function() {
            console.error("ERROR: failed to load data");
        });
    }
    else {
        buildPage();
    }
});

//important html element stored as global variables
let wrapper;
let entryWrapper;
let dayInputMin;
let dayInputMax;
function buildPage() {
    wrapper = $('<div>').addClass("ex2-wrapper").appendTo(divToAppendTheExerciceTo);

    $('<h2>').html("").html("Cat Introduction record and visualizer").appendTo(wrapper);
    $('<p>').html("").html("Assuming that you are following the classic 'slow and steady' cat introduction method, this allows you to visualize an approximation of your cat's closeness by inputing a day range.<br><br>For the sake of the exercice, the data has already been entered for the first 7 days. You can see how the cats got gradually closer for the first 6 days. If the range is set from 1 to 7, the cat are further apart due to the fight they had that day.<br>New data can be submited and will be stored in LocalStorage. (For exemple, you can add an 8th day and check the 'cat played together' box and see how it will affect the visalisation.<br><br>Sadly, functions to chose between different cat introductions or to clear the data have not been implemented. Although, it is possible to clear the LocalStorage data by executing the 'clearLocalStorage()' function in the console.<br><br>Note: This doesn't explain the method and is by no means a truly releiable way to tell if cats are ready to interact without constraints. (LOL)").appendTo(wrapper);
    
    //inputs for data visualization
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

    //submission button
    $('<button>').attr({
        type: 'button',
        onclick: 'displayRange();'
    })
    .html('submit')
    .addClass("ex2-button").appendTo(wrapper);

    //container for new entries
    entryWrapper = $('<div>').addClass("ex2-wrapper").appendTo(divToAppendTheExerciceTo);
    $('<button>').attr({
        type: 'button',
        onclick: 'addNewData();'
    })
    .html('New Day Entry')
    .addClass("ex2-button").appendTo(entryWrapper);
}

//Function to display cat proximity
function displayRange() {
    let filteredResult = data.catIntroduction1.data.filter(getDays); //filter the results with day range
    
    let container = $('<div>').addClass("ex2-container").appendTo(wrapper[0]);
    //title info
    $('<h2>').html(`Proximity from day ${dayInputMin.val()} to day ${dayInputMax.val()}`).appendTo(container);

    //create a canvas for display
    let Ex2Canvas = $('<canvas>').attr('id', "result-canvas").appendTo(container);
    let containerParams = container[0].getBoundingClientRect();
    Ex2Canvas[0].width = containerParams.width;
    Ex2Canvas[0].height = containerParams.height;
    Ex2Context = Ex2Canvas[0].getContext("2d");
    // Ex2Context.fillStyle = "black";
    // Ex2Context.fillRect(0, 0, canvas.width, canvas.height);

    //prep images to be displyed
    let catimg1 = new Image();
    catimg1.src = "assets/images/cat1.png"
    let catimg2 = new Image();
    catimg2.src = "assets/images/cat2.png";
    let imgSize = 75;
    let cat1 = {
        x: 0 - imgSize/2 + Ex2Canvas[0].width/10,
        y: Ex2Canvas[0].height/2 - imgSize/2
    }
    let cat2 = {
        x: Ex2Canvas[0].width - imgSize/2 - Ex2Canvas[0].width/10,
        y: Ex2Canvas[0].height/2 - imgSize/2
    }

    //determine the closeness of the cats using the data Provide a number between 0(close) and 10(not close)
    let closeness = determineCloseness(filteredResult);
    //map the results to the canvas in pixels
    let Mappedcloseness = map(closeness, 0, 10, (cat2.x - cat1.x)/2, 0);
    
    //draw the cats
    catimg1.onload = function(){
        Ex2Context.drawImage(catimg1, cat1.x + Mappedcloseness, cat1.y, imgSize, imgSize);
    };
    
    catimg2.onload = function(){
        Ex2Context.drawImage(catimg2, cat2.x - Mappedcloseness, cat2.y, imgSize, imgSize);
    };

    //display a heart if very close
    let heartSize = 50;
    if (closeness <= 1 && closeness !== 0) {
        let heartimg = new Image();
        heartimg.src = "assets/images/heart.png";
        heartimg.onload = function(){
            Ex2Context.drawImage(heartimg, Ex2Canvas[0].width/2 - heartSize/2, Ex2Canvas[0].height/6 - heartSize/2, heartSize, heartSize);
        };
    }
    //display fusion if fusionned
    let fusionSize = 50;
    if (closeness === 0) {
        let merge = new Image();
        merge.src = "assets/images/merge.png";
        merge.onload = function(){
            Ex2Context.drawImage(merge, Ex2Canvas[0].width/2 - heartSize/2, Ex2Canvas[0].height/8 - heartSize/2, fusionSize, fusionSize);
        };
    }
}

//filter by day function
function getDays(day) {
    if (day.day >= dayInputMin.val() && day.day <= dayInputMax.val())
    return day;
}

//parameters of closness (fully arbitrary lol)
function determineCloseness(days) {
    let closeness = 10;
    days.forEach((day) => {
        if (day.fight) {closeness = 10}
        if (day.play) {closeness -= 4}
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
    return closeness; //return value between 0 and 10
}

//variables containing the inputs for new submission
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

//create the form to enter new data (yes I know, I didn't use a form... didn't know it existed)
function addNewData() {
    for (let i = 0; i < 10; i++) { //the loop is to avoid repeating the to three div creation
        let element = $('<div>').addClass("submit-element").appendTo(entryWrapper);
        let textDiv = $('<div>').addClass("submit-element-text").appendTo(element);
        let contentDiv = $('<div>').addClass("submit-element-content").appendTo(element);

        //creates the various specific inputs
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

    //add submit button
    $('<button>').attr({
        type: 'button',
        onclick: 'submitNewData();'
    })
    .html('Submit')
    .addClass("ex2-button").appendTo(entryWrapper);
}

//adds the user entry to an object, pushes it in the data array and upload it to localStorage
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

    //uptdate the max range
    $(dayInputMax).attr('max', (data.catIntroduction1.data.length).toString());
}

//can be used in the console to clear the Data stored locally
function clearLocalStorage() {
    localStorage.removeItem(DATA_NAME);
}