/**
 * Shape objects for exercice 1
 */
class Shape {
    constructor(position) {

        //different parameters for the top and bottom shapes
        if (position === "bottom") {
            this.bottom = {
                rightX: canvas.width,
                rightY: canvas.height,
                leftX: 0,
                leftY: canvas.height
            }
            this.middle = canvas.height/4*3;
            this.startingPos = Math.random()*5; //offseting the shapes on the noise seed
            this.color = "#F64B09";
        } else if (position === "top") {
            this.bottom = {
                rightX: canvas.width,
                rightY: 0,
                leftX: 0,
                leftY: 0
            }
            this.middle = canvas.height/4;
            this.startingPos = Math.random()*5;
            this.color = "#F6C209";
        }

        this.yoff;
        this.time = 0;
        this.step = 0.003; //noise step (controls the frequency of peaks and valleys)
        this.timeStep = 0.005; //controls the speed at which the noise progresses
        this.acceleration = 0.005; //Affects the timeStep in the click function

        this.clicked = false;
        this.timeClick = 0; //keeps track of time for the click event

        this.NUM_SEGMENTS = 500; //number of segments with noise
    }

    draw() {
        context.beginPath();
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.lineWidth = 1; //change stroke 

        //drawing the first straight line
        context.moveTo(this.bottom.rightX, this.bottom.rightY);
        context.lineTo(this.bottom.leftX, this.bottom.leftY);
        
        //Segmenting the width and adding noise to every segments
        this.yoff = this.startingPos;
        for (let i = 0; i <= this.NUM_SEGMENTS; i++) {
            let x = i * canvas.width / this.NUM_SEGMENTS;
            let perl = perlin.get(this.yoff, this.time);
            context.lineTo(x, this.middle + (perl * canvas.height/2));
            this.yoff += this.step;
        }
        this.time += this.timeStep; //moving noise through time
        
        context.fill(); // set the fill
        context.stroke();//set the stroke
        context.closePath();

        //change timeStep if user clicks the canvas
        if (this.clicked) {
            switch (true) {
                case (this.timeClick < 25):
                this.timeStep += this.acceleration;
                break;

                case (this.timeClick < 50):
                this.timeStep -= this.acceleration;
                break;

                case (this.timeClick < 75):
                this.clicked = false;
                this.timeClick = 0;
                this.timeStep = 0.005;
                break;
            }
            this.timeClick++;
        }
    }

    click() {
        this.acceleration = getRandomFloat(0.005, 0.01, 3);
        this.clicked = true;
    }
}