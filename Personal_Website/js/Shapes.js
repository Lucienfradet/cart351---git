class Shape {
    constructor(position) {
        let pos = position;
        this.bottom = {
            rightX: canvas.width,
            rightY: canvas.height,
            leftX: 0,
            leftY: canvas.height
        }
        this.direction = -1;
        this.time = 0;
        this.yoff = 0;
        this.step = 1;

        this.NUM_SEGMENTS = 500;
        
        this.stroke = "#bb8000";
    }

    draw() {
        context.beginPath();
        context.strokeStyle = this.stroke;
        context.fillStyle = this.stroke;
        context.lineWidth = 2; //change stroke 
        context.moveTo(this.bottom.rightX, this.bottom.rightY);
        context.lineTo(this.bottom.leftX, this.bottom.leftY);
        let x, yoff = 0;
        for (let i = 0; i <= this.NUM_SEGMENTS; i++) {
            x = i * canvas.width / this.NUM_SEGMENTS;
            let perl = perlin.get(this.yoff, this.time);
            console.log(perl);
            context.lineTo(x, canvas.height/4*3 + (perl * canvas.height/2));
            // console.log(perlin.get(x, y));
            this.yoff += this.step
        }
        this.time += this.step;
        
        context.fill(); // set the fill
        context.stroke();//set the stroke
        context.closePath();
    }
}