
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
        this.rect = this.canvas.getBoundingClientRect();
    }

    mouseDown(evt){
        this.x = evt.clientX - this.rect.left;
        this.y = evt.clientY - this.rect.top;
        this.state = true;
    }

    mouseMove(evt){
        if(this.state){
            var ty = evt.clientY - this.rect.top;
            var tx = evt.clientX - this.rect.left;
            console.log(tx);
            console.log(ty);
            this.r = Math.sqrt(Math.pow(this.x - tx, 2) +  Math.pow(this.y - ty, 2));
            console.log(this.r);
            console.log(this.x);
            console.log(this.y);
            this.rubberBanding();
        }
    }

    mouseUp(evt){
        var ty = evt.clientY - this.rect.top;
        var tx = evt.clientX - this.rect.left;
        this.r = Math.sqrt(Math.pow(this.x - tx, 2) +  Math.pow(this.y - ty, 2));
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
        ctx.beginPath();
        ctx.fillStyle = this.color.getCSS();
        ctx.arc(this.x, this.y, this.r, 0, TAU);
        ctx.fill();
    }
    render(){


        var gl = temp_canvas.getContext('2d');
        gl.beginPath();
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
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.w, this.h);
        ctx.stroke();
    }
    render(){

        var gl = temp_canvas.getContext('2d');
        
        gl.clearRect(0,0,800,600);
        gl.strokeStyle = this.color.getCSS();
        gl.lineWidth = 10;
        gl.beginPath();
        gl.moveTo(this.x, this.y);
        gl.lineTo(this.w,this.h);
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
        var ox = this.r;
        var oy = 0;
        console.log("----------");
        console.log(this.sides.value());
        console.log("------------");
        for(var i = 0; i < this.sides.value(); i++){
            var cur_theta = (Math.PI * 2 * i )/ this.sides.value();
            var x = Math.cos(cur_theta) * ox - oy * Math.sin(cur_theta);
            var y = Math.sin(cur_theta) * ox + oy * Math.cos(cur_theta);
            ctx.lineTo(x + this.x, y + this.y);
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

        var ox = this.r;
        var oy = 0;
        for(var i = 0; i < this.sides.value(); i++){
            var cur_theta = (Math.PI * 2 * i )/ this.sides.value();
            var x = Math.cos(cur_theta) * ox - oy * Math.sin(cur_theta);
            var y = Math.sin(cur_theta) * ox + oy * Math.cos(cur_theta);
            gl.lineTo(x + this.x, y + this.y);
        }

        gl.lineWidth = 1;
        gl.fill();

        return gl.getImageData(0,0,800,600);

    }

    getCenter(){
        return [this.x, this.y];
    }

}

class Square extends RadiusSelect{
    constructor(triggerRender, canvas, color){
        super(triggerRender,canvas,color);
        this.canvas = canvas;
        this.color = color;
        this.triggerRender = triggerRender;
    }

    rubberBanding(){

        console.log("rubberbanding");

        var ctx = this.canvas.getContext("2d");
        var nb_x = this.x - this.r/2;
        var nb_y = this.y - this.r/2;
        ctx.clearRect(0,0,800,600);
        this.triggerRender();
        ctx.beginPath();
        ctx.fillStyle = this.color.getCSS();
        ctx.rect(nb_x, nb_y, this.r, this.r);
        ctx.fill();
    }
    render(){

        console.log("rubberbanding");
        var ctx = temp_canvas.getContext('2d');
        var nb_x = this.x - this.r/2;
        var nb_y = this.y - this.r/2;
        ctx.clearRect(0,0,800,600);
        this.triggerRender();
        ctx.beginPath();
        ctx.fillStyle = this.color.getCSS();
        ctx.rect(nb_x, nb_y, this.r, this.r);
        ctx.fill();
        return ctx.getImageData(0,0,800,600);
    }
    getCenter(){
        return [this.x, this.y];
    }
}

class Ellipse extends PointSelect{
    constructor(triggerRender, canvas, color){
        super(triggerRender, canvas, color);
    }
    rubberBanding(){
        var sideways_radius = Math.abs(this.w - this.x)/2;
        var vertical_radius = Math.abs(this.h - this.y)/2;
        var cx = Math.abs(this.w + this.x)/2;
        var cy = Math.abs(this.h + this.y)/2;
        this.triggerRender();
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = this.color.getCSS();
        ctx.strokeStyle =  this.color.getCSS();
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.ellipse(cx,cy,sideways_radius,vertical_radius,0,0,Math.PI * 2);
        ctx.fill();
    }
    render(){

        var gl = temp_canvas.getContext('2d');
        var sideways_radius = Math.abs(this.w - this.x)/2;
        var vertical_radius = Math.abs(this.h - this.y)/2;
        var cx = Math.abs(this.w + this.x)/2;
        var cy = Math.abs(this.h + this.y)/2;

        gl.clearRect(0,0,800,600);
        gl.fillStyle = this.color.getCSS();
        gl.strokeStyle =  this.color.getCSS();
        gl.lineWidth = 10;
        gl.beginPath();
        gl.ellipse(cx,cy,sideways_radius,vertical_radius,0,0,Math.PI * 2);
        gl.fill();
        return gl.getImageData(0,0,800,600);

    }
    getCenter(){
        var sideways_radius = Math.abs(this.w - this.x)/2;
        var vertical_radius = Math.abs(this.h - this.y)/2;
        var cx = Math.abs(this.w + this.x)/2;
        var cy = Math.abs(this.h + this.y)/2;
        return [cx,cy]
    }

}

class Arc extends RadiusSelect{
    constructor(triggerRender, canvas, color, begin_angle,end_angle){
        super(triggerRender,canvas,color);
        this.triggerRender = triggerRender;
        this.canvas = canvas;
        this.color = color;
        this.begin_angle = begin_angle;
        this.end_angle = end_angle;
    }
    getCenter(){
        return [this.x, this.y];
    }
    rubberBanding(){
        var ctx = canvas.getContext('2d');
        this.triggerRender();
        ctx.beginPath();
        ctx.strokeStyle = this.color.getCSS();
        ctx.arc(this.x,this.y,this.r,this.begin_angle.value()/180*Math.PI,this.end_angle.value()/180*Math.PI);
        ctx.stroke();
    }
    render(){

        var ctx = temp_canvas.getContext('2d');
        ctx.clearRect(0,0,800,600);
        this.triggerRender();
        ctx.beginPath();
        ctx.color = this.color.getCSS();
        ctx.arc(this.x,this.y,this.r,this.begin_angle.value()/180*Math.PI,this.end_angle.value()/180*Math.PI);
        ctx.stroke();
        return ctx.getImageData(0,0,800,600);
    }
}