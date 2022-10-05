/**
Site papier toilette
Lucien Cusson-Fradet
*/

"use strict";

let device = deviceTypeDetect();

//needed to use the "map()" p5 function
function setup() {noCanvas();}
function draw() {}

//global variables
let paper = document.getElementById('paper-container');

let pos = { //used to drag and drop with the mouse
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

//setup the page onLoad
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

            //check if the div exists, if so, don't create a new one, use it!
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
    //set scroll start and end
    let offset = emptySheetParams.height - rollHoleParams.top - rollHoleParams.height/2;
    scrollStart = paperContainer.scrollHeight/3*2 + offset*2;
    scrollEnd = paperContainer.scrollHeight/3 + offset;

    paperContainer.scroll(0, scrollStart); //set the scroll starting pos

    //Event listenner for scrolling
    paperContainer.addEventListener('scroll', scrollHandler);

    //add event handlers on the roll and paper
    let visibleSheets = document.getElementsByClassName("sheet");
    for (let i = 0; i < visibleSheets.length; i++) {
        let sheet = visibleSheets[i];
        sheet.addEventListener('mousedown', mouseDownHandler);
        sheet.addEventListener('touchstart', mouseDownHandler);
    }
    
    document.getElementById('roll-middle').addEventListener('mousedown', mouseDownHandler);
    document.getElementById('roll-middle').addEventListener('touchstart', mouseDownHandler);
    document.getElementById('roll-dark-side').addEventListener('mousedown', mouseDownHandler);
    document.getElementById('roll-dark-side').addEventListener('touchstart', mouseDownHandler);

    //button event listenners
    document.getElementById("exercice-1-button").addEventListener('click', function() {
        showElement('item-12');
    });
    document.getElementById("palindrome-button").addEventListener('click', function() {
        showElement('item-19');
    });

    exercice1AnimationSetup();
}

function showElement(elementIdString) {
    let myDivTopPos = document.getElementById(elementIdString).offsetTop;
    myDivTopPos -= document.getElementById(elementIdString).getBoundingClientRect().height * 2;
    paperContainer.scrollTop = myDivTopPos;
    scrollHandler();
}

//Reajust the shapes of the roll on every scroll event
let rollRightSideStart;
function scrollHandler(event) {
    //limit the scroll to the scrollEnd
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
        rollRightSideStart = { //set the staring position of the shapes
            width: rollRightSideParams.width,
            left: rollRightSideParams.left
        }
    }

    //move the line on the roll
    if (paper.scrollTop > lastScrollPosY) {
       //scrollUp event
       paperLine.style.top = `${paperLineParams.top + scrollSpeed}px`;
    } else if (paper.scrollTop < lastScrollPosY) {
        //scrollDown event
        paperLine.style.top = `${paperLineParams.top - scrollSpeed}px`;
    }

     //checkOverflow and reset the line
     if (paperLineParams.top < rollRightSideParams.top) {
        paperLine.style.top = `${rollRightSideParams.bottom - 1}px`;
    }
    if (paperLineParams.top > rollRightSideParams.bottom) {
        paperLine.style.top = `${rollRightSideParams.top + 1}px`; //+1 to make sure it doesn't jump back on the next scrollevent
    }


    lastScrollPosY = paper.scrollTop; //save the scroll for the next event
    
    //Changing Roll Size
    let rollW = map( //p5.js map function
        paper.scrollTop, 
        scrollEnd, 
        scrollStart, 
        rollHoleParams.width, 
        rollRightSideStart.width, 
        true //limit in bounds
        );
    document.getElementById('roll-bright-side').style.width = `${rollW}px`;
    document.getElementById('roll-bright-side').style.height = `${rollW}px`;
    
    //set the paperContainer position
    paperContainerParams = paperContainer.getBoundingClientRect();
    paperContainer.style.left = `${rollRightSideParams.left + rollRightSideParams.width - paperContainerParams.width}px`;

    //Recenter middle
    reCenterRightSide();
    //Adjust other parts
    placeOtherRollParts();
}

/*
    Drag-to-scroll tutorial found here:
    https://htmldom.dev/drag-to-scroll/

    I should have removed the `left` cause I don't need it
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

    if (device !== "desktop" ) {
        pos.x = event.touches[0].clientX;
        pos.y = event.touches[0].clientY;
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('touchmove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('touchend', mouseUpHandler);
}


function mouseMoveHandler(event) {
    // How far the mouse has been moved
    let dx = event.clientX - pos.x;
    let dy = event.clientY - pos.y;

    if (device !== "desktop" ) {
        dx = event.touches[0].clientX - pos.x;
        dy = event.touches[0].clientY - pos.y;
    }

    // Scroll the element
    if (pos.elementCLicked === 'roll-dark-side' || pos.elementCLicked === 'roll-middle') {
        paper.scrollTop = pos.top + dy;
        paper.scrollLeft = pos.left + dx;
    } else {
        paper.scrollTop = pos.top - dy;
        paper.scrollLeft = pos.left - dx;
    }
}

function mouseUpHandler() {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('touchmove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    document.removeEventListener('touchend', mouseUpHandler);

    paper.style.removeProperty('user-select');
}

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

//https://attacomsian.com/blog/javascript-detect-mobile-device#:~:text=To%20detect%20if%20the%20user,and%20platform%20of%20the%20browser.
function deviceTypeDetect() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

//https://bobbyhadz.com/blog/javascript-get-random-float-in-range
function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
  }