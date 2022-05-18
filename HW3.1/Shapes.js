
const TAU = Math.PI * 2;
var temp_canvas = null;

class Interactable_Renderable extends Interactable{
    constructor(triggerRender, canvas, color){
        super();
        temp_canvas = document.getElementById("computeCanvas");
        temp_canvas.globalCompositeOperation = "copy"
        this.triggerRender = triggerRender;
        this.canvas = canvas;
        this.color = color;
    }
    render(){
        throw new Error("Render has not been implemented in the inheritable class");
    }
    rubberBanding(){
        throw new Error("rubberBanding not implemented");
    }

    getCenter(){
        throw new Error("getCenter has not been implemented in the inheritable class");
    }
}

class PointSelect extends Interactable_Renderable{
    constructor(triggerRender, canvas, color){
        super(triggerRender, canvas, color);
        this.state = false;
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.rect = this.canvas.getBoundingClientRect();
    }

    mouseDown(evt){
        this.x = evt.clientX - this.rect.left;
        this.y = evt.clientY - this.rect.top;
        this.state = true;
    }

    mouseMove(evt){
        if(this.state){
            this.h = evt.clientY - this.rect.top;
            this.w = evt.clientX - this.rect.left;
            this.rubberBanding();
        }
    }

    mouseUp(evt){
        this.h = evt.clientY - this.rect.top;
        this.w = evt.clientX - this.rect.left;
    }
}

class RadiusSelect extends Interactable_Renderable{

    constructor(triggerRender, canvas, color){
        super(triggerRender, canvas, color);
        this.state = false;
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.rect = this.canvas = getBoundingClientRect();
    }

    mouseDown(evt){
        this.x = evt.clientX - this.rect.left;
        this.y = evt.clientY - this.rect.top;
        this.state = true;
    }

    mouseMove(evt){
        if(this.state){
            var tx = evt.clientY - this.rect.top;
            var ty = evt.clientX - this.rect.left;
            this.r = Math.round(Math.sqrt(Math.pow(this.x - tx, 2) +  Math.pow(this.y - ty, 2)));
            this.rubberBanding();
        }
    }

    mouseUp(evt){
        var tx = evt.clientY - this.rect.top;
        var ty = evt.clientX - this.rect.left;
        this.r = Math.round(Math.sqrt(Math.pow(this.x - tx, 2) +  Math.pow(this.y - ty, 2)));
        this.state = false;
    }

}

class Rectangle extends PointSelect{
    
    constructor(triggerRender, canvas, color){
        super(triggerRender, canvas, color);
    }
    rubberBanding(){
        console.log("rubberbanding");
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0,0,800,600);
        this.triggerRender();
        ctx.beginPath();
        ctx.fillStyle = this.color.getCSS();
        ctx.rect(this.x, this.y, this.w - this.x, this.h - this.y);
        ctx.fill();
    }
    render(){


        var gl = temp_canvas.getContext('2d');
        gl.clearRect(0,0,800,600);
        gl.fillStyle = this.color.getCSS();
        gl.fillRect(this.x,this.y, this.w - this.x , this.h - this.y);

        return gl.getImageData(0,0,800,600);

    }

    getCenter(){
        return [(this.x + this.w) / 2, (this.y + this.h) / 2];
    }
}

class Circle extends RadiusSelect{
    
    constructor(triggerRender, canvas, color){
        super(triggerRender, canvas, color);
    }
    rubberBanding(){
        this.triggerRender();
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = this.color.getCSS();
        ctx.arc(this.x, this.y, this.r, 0, TAU);
        ctx.fill();
    }
    render(){


        var gl = temp_canvas.getContext('2d');
        gl.clearRect(0,0,800,600);
        gl.fillStyle = this.color.getCSS();
        gl.arc(this.x, this.y, this.r, 0, TAU);
        gl.fill();

        return gl.getImageData(0,0,800,600);

    }
    getCenter(){
        return [this.x, this.y];
    }
}

class Line extends PointSelect{
    constructor(triggerRender, canvas, color){
        super(triggerRender, canvas, color);
    }
    rubberBanding(){
        this.triggerRender();
        var ctx = this.canvas.getContext("2d");
        ctx.strokeStyle = this.color.getCSS();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.w, this.h);
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    render(){

        var gl = temp_canvas.getContext('2d');
        gl.clearRect(0,0,800,600);
        gl.strokeStyle = this.color.getCSS();
        gl.beginPath(this.x, this.y);
        gl.lineTo(this.w,this.h);
        gl.lineWidth = 1;
        gl.stroke();

        return gl.getImageData(0,0,800,600);

    }

    getCenter(){
        return [(this.x + this.w) / 2, (this.y + this.h) / 2];
    }
}

class Polygon extends RadiusSelect{

    constructor(triggerRender, canvas, color, sides){
        super(triggerRender, canvas, color);
        this.sides = sides;
    }

    rubberBanding(){

        this.triggerRender();

        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = this.color.getCSS();

        ctx.beginPath();
        ctx.moveTo(this.x + this.r, this.y);

        for(var i = 0; i < this.sides.value(); i++){
            var x = this.x + Math.cos(Math.PI * 2 * i / this.sides.value()) * this.r;
            var y = this.y + Math.cos(Math.PI * 2 * i / this.sides.value()) * this.r;
            ctx.lineTo(Math.round(x),Math.round(y));
        }
        ctx.lineWidth = 1;
        ctx.fill();
        
    }

    render(){

        var gl = temp_canvas.getContext('2d');
        gl.clearRect(0,0,800,600);
        gl.fillStyle = this.color.getCSS();

        gl.beginPath();
        gl.moveTo(this.x + this.r, this.y);

        for(var i = 0; i < this.sides.value(); i++){
            var x = this.x + Math.cos(Math.PI * 2 * i / this.sides.value()) * this.r;
            var y = this.y + Math.cos(Math.PI * 2 * i / this.sides.value()) * this.r;
            gl.lineTo(Math.round(x),Math.round(y));
        }

        gl.lineWidth = 1;
        gl.fill();

        return gl.getImageData(0,0,800,600);

    }

    getCenter(){
        return [this.x, this.y];
    }

}