//Exercie1 
let animateBool = true;

function exercice1AnimationSetup() {
    //Canvas Exercice1
    canvas = document.getElementById("my-canvas");
    let canvasContentParams = document.getElementById("canvas-content").getBoundingClientRect();
    canvas.width = canvasContentParams.width;
    canvas.height = canvasContentParams.height;

    context = canvas.getContext("2d");
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    shape[0] = new Shape("bottom");
    shape[1] = new Shape("top");
    canvas.addEventListener('click', function() {
        if (animateBool) {
            requestAnimationFrame(animate);
            animateBool = false;
        }
        for (let i = 0; i < shape.length; i++) {
            shape[i].click();
        }
    });
}

function animate() {
    //repaint with a black rect..
    context.fillStyle = "#B4F609";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < shape.length; i++) {
        shape[i].draw();
    }
    requestAnimationFrame(animate);
}

let canvas;
let context;
let shape = [];