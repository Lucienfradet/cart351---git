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

let paperContainer;
let paperContainerParams;
let scrollStart;
let scrollEnd;
let scrollMap;


window.onload = function(event) {
    window.addEventListener("resize", onResize);
    onResize();

    //Create the content divs
    const CONTENT_NUM = 30;

    for (let i = -CONTENT_NUM; i <= CONTENT_NUM * 2; i++) {
        if (i < 0 || i > CONTENT_NUM) {
            //create empty divs
            let div = document.createElement('div');
            div.classList.add('empty-sheet');
            document.getElementById('paper').appendChild(div);
            div.style.height = `${div.getBoundingClientRect().height + 2}px` //compensate for the border on the items elements
        }
        
        if (i > 0 && i <= CONTENT_NUM) {
            //create the content divs
            let divSheet = document.createElement('div');
            let divContainer = document.createElement('div');
            let divItem;

            divSheet.classList.add('sheet');
            divSheet.setAttribute('id', `sheet-${i}`);
            document.getElementById('paper').appendChild(divSheet);

            divContainer.classList.add('item-container')
            divContainer.setAttribute('id', `item-container-${i}`);
            document.getElementById(`sheet-${i}`).appendChild(divContainer);

            if (document.getElementById(`item-${i}`) === null) { //if element doesn't exist, create empty one
                divItem = document.createElement('div');
            } else {

                divItem = document.getElementById(`item-${i}`);

                divItem.classList.remove('item-invisible');

            }
            divItem.classList.add('item');
            divItem.setAttribute('id', `item-${i}`);
            document.getElementById(`item-container-${i}`).appendChild(divItem);
        }
    }

    //Place the paper at the right position (approx cause I didn't find a better way)
    paperContainer = document.getElementById('paper-container');
    let emptySheetParams = document.getElementsByClassName('empty-sheet')[0].getBoundingClientRect();
    console.log(document.getElementById('paper-container').scrollHeight);
    //set scroll start and end
    let offset = emptySheetParams.height - rollHoleParams.top - rollHoleParams.height/2;
    scrollStart = paperContainer.scrollHeight/3*2 + offset;
    scrollEnd = paperContainer.scrollHeight/3 + offset;

    console.log(scrollStart, scrollEnd);
    console.log(`scrollEnd: ${scrollEnd}`);
    paperContainer.scroll(0, scrollStart);

    //Event listenner for scrolling
    paperContainer.addEventListener('scroll', scrollHandler);
}

let rollRightSideStart;
function scrollHandler(event) {
    if (paper.scrollTop < scrollEnd) {
        paper.scrollTop = scrollEnd;
    }

    let scrollSpeed = 3;
    let paperLine = document.getElementById("line");
    let paperLineParams = paperLine.getBoundingClientRect();
    let rollRightSideParams = document.getElementById('roll-bright-side').getBoundingClientRect();
    
    //First time!
    if (!lastScrollPosY) {
        lastScrollPosY = paper.scrollTop;
        rollRightSideStart = {
            width: rollRightSideParams.width,
            left: rollRightSideParams.left
        }
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
        paperLine.style.top = `${rollRightSideParams.bottom - 1}px`;
    }
    if (paperLineParams.top > rollRightSideParams.bottom) {
        paperLine.style.top = `${rollRightSideParams.top + 1}px`; //+1 to make sure it doesn't jump back on the next scrollevent
    }


    lastScrollPosY = paper.scrollTop;
    
    //Changing Roll Size
    let rollW = map(
        paper.scrollTop, 
        scrollEnd, 
        scrollStart, 
        rollHoleParams.width, 
        rollRightSideStart.width, 
        true
        );
    document.getElementById('roll-bright-side').style.width = `${rollW}px`;
    document.getElementById('roll-bright-side').style.height = `${rollW}px`;
    
    paperContainerParams = paperContainer.getBoundingClientRect();
    let paperL = map(
        paper.scrollTop, 
        scrollEnd, 
        scrollStart, 
        rollDarkSideParams.left,
        rollRightSideParams.left + rollRightSideStart.width - paperContainerParams.width,
        true
        );
    paperContainer.style.left = `${rollRightSideParams.left + rollRightSideParams.width - paperContainerParams.width}px`;

    // if (paper.scrollTop < scrollEnd) {
    //     console.log('doinguit');
    //     let rollMiddleParams = rollMiddle.getBoundingClientRect();
    //     rollMiddle.style.top = `${rollMiddleParams.top - scrollSpeed}px`;
    //     rollDarkSideParams = rollDarkSide.getBoundingClientRect();
    //     rollDarkSide.style.top = `${rollDarkSideParams.top - scrollSpeed}px`;
    // } else {
        //Recenter middle
        reCenterRightSide();
        //Adjust other parts
        placeOtherRollParts();
    // }
    
    






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
let curtainRight;

function onResize() {
    //building the roll
    rollHoleParams = document.getElementById("roll-hole").getBoundingClientRect();

    //fix the right side
    rollRightSide = document.getElementById("roll-bright-side");
    rollRightSide.style.width = `${rollHoleParams.width*2}px`;
    rollRightSide.style.height = `${rollHoleParams.height*2}px`;
    reCenterRightSide();
    
    placeOtherRollParts();

    curtainRight = document.getElementById("curtain-right");
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
    rollRightSide.style.top = `${rollHoleParams.top + rollHoleParams.height/2 - rollRightSideParams.height/2 }px`;
    rollRightSide.style.left = `${rollHoleParams.left + rollHoleParams.width/2 - rollRightSideParams.width/2 }px`;
    rollRightSideParams = rollRightSide.getBoundingClientRect(); //update the params
}

let rollDarkSide;
let rollDarkSideParams;
let initialDarkSidePos;
let rollMiddle;
let firstPlacement = false;
function placeOtherRollParts() {
    rollRightSideParams = rollRightSide.getBoundingClientRect();

    if (!firstPlacement) {
        initialDarkSidePos = rollRightSideParams.left - rollRightSideParams.width/2;
        firstPlacement = true;
    }
    
    rollDarkSide = document.getElementById("roll-dark-side");
    rollDarkSide.style.top = `${rollRightSideParams.top}px`;
    rollDarkSide.style.left = `${initialDarkSidePos}px`;
    rollDarkSide.style.width = `${rollRightSideParams.width}px`;
    rollDarkSide.style.height = `${rollRightSideParams.height}px`;

    rollDarkSideParams = rollDarkSide.getBoundingClientRect();
    rollMiddle = document.getElementById("roll-middle");
    rollMiddle.style.top = `${rollRightSideParams.top}px`;
    rollMiddle.style.left = `${rollDarkSideParams.left + rollDarkSideParams.width/2}px`;
    rollMiddle.style.width = `${rollRightSideParams.left - rollDarkSideParams.left}px`;
    rollMiddle.style.height = `${rollRightSideParams.height}px`;

    let curtainTop = document.getElementById("curtain-top");
    curtainTop.style.bottom = `${-rollHoleParams.top + rollHoleParams.height/2}px`;
    curtainTop.style.height = `${window.innerHeight}px`;
}