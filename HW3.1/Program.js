

class Program{
    shape = {
        RECTANGLE: 0,
        CIRCLE: 1,
        LINE: 2,
        POLYGON: 3
    };
    constructor(ColorPickerID, canvasID, fieldID){
        this.color = new Color(ColorPickerID);
        this.field = new Field(fieldID);
        this.layers = new Array();
        this.undo = new Array();
        this.canvas = document.getElementById(canvasID);
        
        this.renderer = function(){
            var context = this.canvas.getContext("2d")
            context.clearRect(0,0,800,600);
            for(var i = 0; i < this.layers.length; i++){
                //console.log(this.layers[i].rendered_image.data[3]);
                this.layers[i].render(context);
            }
        }
        this.callback = function(){
            var context = this.canvas.getContext("2d")
            context.clearRect(0,0,800,600);
            for(var i = 0; i < this.layers.length; i++){
                
                this.layers[i].render(context);
            }
        }
        this.constructedShape = new Rectangle(this.callback,this.canvas,this.color);
        this.currentShape = this.shape.RECTANGLE;

    }
    mouseDown(evt){
        this.constructedShape.mouseDown(evt);

    }
    mouseMove(evt){
        this.constructedShape.mouseMove(evt);
    }
    mouseUp(evt){
        this.constructedShape.mouseUp(evt);
        var img = this.constructedShape.render();
        var center = this.constructedShape.getCenter();
        console.log(img.data[4]);
        var bmp;
        var tmp = function(obj) {
            obj.layers.push(new Layer(bmp, center[0], center[1]));
            obj.constructedShape = null;
            switch(obj.currentShape){
                case obj.shape.RECTANGLE:
                    obj.constructedShape = new Rectangle(obj.callback, obj.canvas, obj.color);
                    break;
                case obj.shape.CIRCLE:
                    obj.constructedShape = new Circle(obj.callback, obj.canvas, obj.color);
                    break;
                case obj.shape.LINE:
                    obj.constructedShape = new Line(obj.callback, obj.canvas, obj.color);
                    break;
                case obj.shape.POLYGON:
                    obj.constructedShape = new Polygon(obj.callback, obj.canvas, obj.color, obj.field);
                    break;
            }
            var context = obj.canvas.getContext('2d');
            context.clearRect(0,0,800,600);
            obj.renderer();
        }
        var tobj = this;
        createImageBitmap(img).then(
            function(a){
                bmp = a;
                tmp(tobj);
            }
        );/*
        this.layers.push(new Layer(bmp, center[0], center[1]));
        switch(this.currentShape){
            case this.shape.RECTANGLE:
                this.constructedShape = new Rectangle(this.callback, this.canvas, this.color);
                break;
            case this.shape.CIRCLE:
                this.constructedShape = new Circle(this.callback, this.canvas, this.color);
                break;
            case this.shape.LINE:
                this.constructedShape = new Line(this.callback, this.canvas, this.color);
                break;
            case this.shape.POLYGON:
                this.constructedShape = new Polygon(this.callback, this.canvas, this.color, this.field);
                break;
        }
        var context = this.canvas.getContext('2d');
        context.clearRect(0,0,800,600);
        this.renderer();*/
    }
    setShape(type){
        this.currentShape = type;
        switch(type){
            case this.shape.RECTANGLE:
                this.constructedShape = new Rectangle(this.callback, this.canvas, this.color);
                break;
            case this.shape.CIRCLE:
                this.constructedShape = new Circle(this.callback, this.canvas, this.color);
                break;
            case this.shape.LINE:
                this.constructedShape = new Line(this.callback, this.canvas, this.color);
                break;
            case this.shape.POLYGON:
                this.constructedShape = new Polygon(this.callback, this.canvas, this.color, this.field);
                break;
        }
    }

}

window.onload = function(){
    var program = new Program("head","canvas","sample4");
    program.canvas.addEventListener("mousedown", 
        function(e){
            console.log("mousedown");
            program.mouseDown(e); });
    program.canvas.addEventListener("mousemove", 
        function(e){ 
            console.log("mousemove");
            program.mouseMove(e); });
    program.canvas.addEventListener("mouseup", 
        function(e){ 
            console.log("mouseup");
            program.mouseUp(e); });
    program.callback = function(){ program.renderer(); };
    program.constructedShape = new Rectangle(program.callback, program.canvas, program.color);
}