function showElement(elementIdString) {
    let myDivTopPos = document.getElementById(elementIdString).offsetTop;
    myDivTopPos -= document.getElementById(elementIdString).getBoundingClientRect().height * 2;
    paperContainer.scrollTop = myDivTopPos;
    scrollHandler();
}