/**
Site papier toilette
Lucien Cusson-Fradet

-Make the toilet paper
-allow unrolling with mouse
-add titles or some shit
-click and get to the back I guess
*/

"use strict";

function setup() {
    noCanvas();
}
function draw() {}

//global variables
let paper = document.getElementById('paper-container');
let pos = {
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    elementCLicked: undefined
};

let lastScrollPosY = 0;

let containerPaper;
let scrollStart;
let scrollEnd;
let scrollMap;


window.onload = function(event) {
    window.addEventListener("resize", onResize);
    onResize();

    //Create the content divs
    const CONTENT_NUM = 9;

    for (let i = -CONTENT_NUM + 1; i < CONTENT_NUM * 2 - 1; i++) {
        if (i < 0 || i > CONTENT_NUM) {
            //create empty divs
            let div = document.createElement('div');
            div.classList.add('empty-sheet');
            document.getElementById('paper').appendChild(div);
        }
        
        if (i >= 0 && i <= CONTENT_NUM) {
            //create the content divs
            let divSheet = document.createElement('div');
            let divContainer = document.createElement('div');
            let divItem = document.createElement('div');
            
            divSheet.classList.add('sheet');
            divSheet.setAttribute('id', `sheet-${i}`);
            document.getElementById('paper').appendChild(divSheet);

            divContainer.classList.add('item-container')
            divContainer.setAttribute('id', `item-container-${i}`);
            document.getElementById(`sheet-${i}`).appendChild(divContainer);

            divItem.classList.add('item');
            divItem.setAttribute('id', `item-${i}`);
            document.getElementById(`item-container-${i}`).appendChild(divItem);
            
        }
    }

    //Place the paper at the right position (approx cause I didn't find a better way)
    containerPaper = document.getElementById('paper-container');
    let itemParams = document.getElementById('item-0').getBoundingClientRect();
    console.log(document.getElementById('paper-container').scrollHeight);
    //set scroll start and end
    scrollStart = containerPaper.scrollHeight/4*3 - 30;
    scrollEnd = containerPaper.scrollHeight/4;

    console.log(scrollStart, scrollEnd);
    console.log(`scrollEnd: ${scrollEnd}`);
    containerPaper.scroll(0, scrollStart);

    //Event listenner for scrolling
    document.getElementById('paper-container').addEventListener('scroll', scrollHandler);
}

let rollRightSideStartWidth;
function scrollHandler(event) {
    let scrollSpeed = 3;
    let paperLine = document.getElementById("line");
    let paperLineParams = paperLine.getBoundingClientRect();
    let rollRightSideParams = document.getElementById('roll-bright-side').getBoundingClientRect();
    
    //First time!
    if (!lastScrollPosY) {
        lastScrollPosY = paper.scrollTop;
        rollRightSideStartWidth = rollRightSideParams.width;
    }

    if (paper.scrollTop > lastScrollPosY) {
       //scrollUp event
       paperLine.style.top = `${paperLineParams.top + scrollSpeed}px`;
    } else if (paper.scrollTop < lastScrollPosY) {
        //scrollDown event
        paperLine.style.top = `${paperLineParams.top - scrollSpeed}px`;
    }

     //checkOverflow
     if (paperLineParams.top < rollRightSideParams.top) {
        paperLine.style.top = `${rollRightSideParams.bottom}px`;
    }
    if (paperLineParams.top > rollRightSideParams.bottom) {
        paperLine.style.top = `${rollRightSideParams.top + 1}px`; //+1 to make sure it doesn't jump back on the next scrollevent
    }

    lastScrollPosY = paper.scrollTop;
    
    //Changing Roll Size
    let w = map(paper.scrollTop, scrollEnd, scrollStart, rollHoleParams.width, rollRightSideStartWidth, true);
    document.getElementById('roll-bright-side').style.width = `${w}px`;
    document.getElementById('roll-bright-side').style.height = `${w}px`;

    //Recenter middle
    reCenterRightSide();
    //Adjust other parts
    placeOtherRollParts();






    if (document.getElementById('paper-container').scrollHeight < scrollEnd) {
        
    }
}

/*
    Drag-to-scroll tutorial found here:
    https://htmldom.dev/drag-to-scroll/
*/  
paper.scrollTop = 150;
paper.scrollLeft = 100;

//Mouse scroll for the paper and roll
function mouseDownHandler(event) {
    pos = {
        top: paper.scrollTop,
        left: paper.scrollLeft,
        //get the current mouse position
        x: event.clientX,
        y: event.clientY,
        elementCLicked: event.srcElement.id
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
}


function mouseMoveHandler(event) {
    // How far the mouse has been moved
    let dx = event.clientX - pos.x;
    let dy = event.clientY - pos.y;

    // Scroll the element
    if (pos.elementCLicked === 'roll-dark-side' || pos.elementCLicked === 'roll-middle') {
        paper.scrollTop = pos.top + dy;
        paper.scrollLeft = pos.left + dx;
    } else {
        paper.scrollTop = pos.top - dy;
        paper.scrollLeft = pos.left - dx;
    }
    
    console.log(paper.scrollTop);
}

function mouseUpHandler() {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    paper.style.removeProperty('user-select');
}

//add event handlers on the roll and paper
paper.addEventListener('mousedown', mouseDownHandler); //this one should only be on the visible sheets!
document.getElementById('roll-middle').addEventListener('mousedown', mouseDownHandler);
document.getElementById('roll-dark-side').addEventListener('mousedown', mouseDownHandler);

let rollHoleParams;
let rollRightSide;
let rollRightSideParams;

function onResize() {
    //building the roll
    rollHoleParams = document.getElementById("roll-hole").getBoundingClientRect();

    //fix the right side
    rollRightSide = document.getElementById("roll-bright-side");
    rollRightSide.style.width = `${rollHoleParams.width*2}px`;
    rollRightSide.style.height = `${rollHoleParams.height*2}px`;
    reCenterRightSide();
    
    placeOtherRollParts();

    let curtainRight = document.getElementById("curtain-right");
    curtainRight.style.top = `${rollRightSideParams.top}px`;
    curtainRight.style.left = `${rollRightSideParams.left + rollRightSideParams.width}px`;
    curtainRight.style.height = `${window.innerHeight}px`;

    //place the container
    paper.style.width = `${rollRightSideParams.width + rollHoleParams.width/12*2}px`;
    paper.style.top = `0px`;
    paper.style.buttom = `${window.innerHeight}px`
    paper.style.left = `${rollRightSideParams.left - rollHoleParams.width/12*2}px`;

    //place the line
    let paperLine = document.getElementById("line");
    paperLine.style.left = '0px';
    paperLine.style.top = `${rollRightSideParams.bottom - 15}px`;
}

function reCenterRightSide() {
    rollRightSideParams = rollRightSide.getBoundingClientRect();
    rollRightSide.style.top = `${rollHoleParams.top - rollRightSideParams.width/4}px`;
    rollRightSide.style.left = `${rollHoleParams.left - rollRightSideParams.height/4}px`;
    rollRightSideParams = rollRightSide.getBoundingClientRect(); //update the params
}

function placeOtherRollParts() {
    rollRightSideParams = rollRightSide.getBoundingClientRect();
    
    let rollDarkSide = document.getElementById("roll-dark-side");
    rollDarkSide.style.top = `${rollRightSideParams.top}px`;
    rollDarkSide.style.left = `${rollRightSideParams.left - rollRightSideParams.width/2}px`;
    rollDarkSide.style.width = `${rollRightSideParams.width}px`;
    rollDarkSide.style.height = `${rollRightSideParams.height}px`;

    let rollMiddle = document.getElementById("roll-middle");
    rollMiddle.style.top = `${rollRightSideParams.top}px`;
    rollMiddle.style.left = `${rollRightSideParams.left}px`;
    rollMiddle.style.width = `${rollRightSideParams.width/2}px`;
    rollMiddle.style.height = `${rollRightSideParams.height}px`;

    let curtainTop = document.getElementById("curtain-top");
    curtainTop.style.bottom = `${-rollHoleParams.top + rollHoleParams.height/2}px`;
    curtainTop.style.height = `${window.innerHeight}px`;
}